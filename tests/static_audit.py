#!/usr/bin/env python3
"""Dependency-light static audit. Run: python tests/static_audit.py"""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit
import subprocess,sys,re
ROOT=Path(__file__).resolve().parents[1]
checks=0
failures=[]
def check(condition,message):
 global checks
 checks+=1
 if not condition:failures.append(message)
for page in sorted(ROOT.glob('*.html')):
 text=page.read_text(encoding='utf-8')
 doc=BeautifulSoup(text,'html.parser')
 check(bool(doc.html and doc.head and doc.body),f'{page.name}: missing document structure')
 check(bool(doc.title and doc.title.text.strip()),f'{page.name}: missing title')
 check(bool(doc.select_one('meta[name=viewport]')),f'{page.name}: missing viewport')
 check(bool(doc.select_one('link[href="assets/css/polish.css"]')),f'{page.name}: missing polish styles')
 # Broken local references (external CDNs are documented runtime dependencies)
 for attr,selector in [('src','script[src]'),('href','link[href],a[href]')]:
  for tag in doc.select(selector):
   val=tag.get(attr,'')
   if val.startswith(('https:','http:','mailto:','tel:','#','data:','javascript:')) or not val:continue
   target=ROOT/urlsplit(val).path
   check(target.exists(),f'{page.name}: broken {attr} {val}')
 ids=[el['id'] for el in doc.select('[id]')]
 check(len(ids)==len(set(ids)),f'{page.name}: duplicate IDs')
 for idx,script in enumerate(doc.select('script:not([src])')):
  import tempfile
  with tempfile.NamedTemporaryFile(mode='w',suffix='.js',encoding='utf-8') as fd:
   fd.write(script.text);fd.flush()
   r=subprocess.run(['node','--check',fd.name],capture_output=True,text=True)
  check(r.returncode==0, f'{page.name}: inline JavaScript parse error: {r.stderr[:140]}')
 if page.name not in ('login.html','404.html'):
  check(bool(doc.select_one('script[src="assets/js/ux.js"]')),f'{page.name}: missing UX logic')
  check(bool(doc.select_one('#sidebarToggle')),f'{page.name}: missing sidebar toggle')
  check(bool(doc.select_one('#toastWrap')),f'{page.name}: missing toast wrapper')
for script in (ROOT/'assets/js').glob('*.js'):
 r=subprocess.run(['node','--check',str(script)],capture_output=True,text=True)
 check(r.returncode==0,f'{script.name}: parse error {r.stderr[:150]}')
for name in ('sales','inventory'):
 page=BeautifulSoup((ROOT/f'{name}.html').read_text(),'html.parser')
 check(bool(page.select_one(f'script[src="assets/js/{name}-demo.js"]')),f'{name}: missing CRUD file')
check('admin@asml-erp.com' in (ROOT/'login.html').read_text(),'Login credential missing')
check('admin@asml-erp.com' in (ROOT/'README.md').read_text(),'README demo credential missing')
print(f'Static checks: {checks}; failures: {len(failures)}')
for failure in failures:print('FAIL:',failure)
sys.exit(1 if failures else 0)
