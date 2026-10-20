/* Cross-page progressive enhancements. Frontend demonstration only. */
'use strict';
const ERPUX = {
  init() {
    this.settings();
    this.searchButton();
    this.labels();
    this.actions();
    this.logout();
    this.tabTitles();
  },
  settings() {
    const color=ERPStore.get('erp_accent',null);
    if (/^#[a-f\d]{6}$/i.test(color||'')) document.documentElement.style.setProperty('--accent',color);
    const size=ERPStore.get('erp_font_size','medium');
    document.body.classList.toggle('large-type',size==='large');
    document.body.classList.toggle('small-type',size==='small');
    document.body.classList.toggle('compact-tables', ERPStore.get('erp_compact_tables',false));
    document.body.classList.toggle('no-motion', ERPStore.get('erp_animations',true)===false);
    if (document.getElementById('setting-appearance')) this.appearance();
  },
  searchButton() {
    if(!document.querySelector('.topbar-actions'))return;
    if (!document.querySelector('.topbar-actions [data-action="open-search"]')) {
      const btn=document.createElement('button');btn.type='button';btn.className='topbar-btn';
      btn.setAttribute('aria-label','Open search');btn.setAttribute('title','Search (Ctrl+K)');
      btn.setAttribute('data-action','open-search');
      btn.innerHTML='<i class="bi bi-search" aria-hidden="true"></i>';
      document.querySelector('.topbar-actions').prepend(btn);
      btn.addEventListener('click',()=>SearchModal.open());
    }
  },
  labels() {
    document.querySelectorAll('button').forEach(b=>{
      if (b.hasAttribute('aria-label')||b.textContent.trim())return;
      const icon=b.querySelector('i[class*="bi-"]');
      const label=b.getAttribute('title')||icon?.className.match(/bi-([\w-]+)/)?.[1].replace(/-/g,' ')||'Action';
      b.setAttribute('aria-label',label);
    });
    document.querySelectorAll('[onclick^="setAccent"]').forEach(el=>{
      el.setAttribute('role','button');el.tabIndex=0;
      el.setAttribute('aria-label',el.getAttribute('title')||'Choose accent color');
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
    });
    document.querySelectorAll('.modal .form-label').forEach(label=>{
      const parent=label.parentElement;
      const field=parent?.querySelector('input,select,textarea');
      if(field && !field.id){field.id='erp-field-'+Math.random().toString(36).slice(2,10);label.htmlFor=field.id;}
    });
    document.querySelectorAll('.erp-table thead input[type=checkbox]').forEach(check=>{
      check.setAttribute('aria-label','Select all visible rows');
      check.addEventListener('change',()=>{
        check.closest('table').querySelectorAll('tbody input[type=checkbox]').forEach(box=>box.checked=check.checked);
      });
    });
    document.querySelectorAll('.topbar-actions .dropdown button').forEach(btn=>{
      if(!btn.getAttribute('aria-label'))btn.setAttribute('aria-label',btn.classList.contains('topbar-profile')?'Account menu':'Notifications');
    });
  },
  actions() {
    document.addEventListener('click',e=>{
      const btn=e.target.closest('button');if(!btn)return;
      if(btn.matches('[data-bs-toggle],[data-bs-dismiss],[data-action],[onclick],#sidebarToggle,[data-page],#saveSaleBtn'))return;
      if(btn.closest('#salesTable,#productTable'))return;
      if(btn.closest('.modal'))return;
      const label=btn.textContent.replace(/\s+/g,' ').trim();
      if(!label)return;
      if(/^Export PDF$/i.test(label)){e.preventDefault();window.print();return;}
      if(/^(Export|Download|Export CSV)$/i.test(label)){
        if (location.pathname.endsWith('/sales.html') || location.pathname.endsWith('/inventory.html')) return;
        e.preventDefault();const table=btn.closest('.card')?.querySelector('table')||document.querySelector('main table');
        if(!table){Utils.showToast('No table is available to export on this page.','info');return;}
        const heads=Array.from(table.querySelectorAll('thead th')).map(x=>x.textContent.trim());
        const remove=heads.findIndex(x=>/^(Actions)?$/i.test(x));
        const cols=heads.map((h,i)=>i).filter(i=>i!==remove&&heads[i]);
        const rows=Array.from(table.querySelectorAll('tbody tr')).map(r=>Array.from(r.querySelectorAll('td')).map(x=>x.textContent.trim()));
        ERPStore.csv('asml-erp-'+location.pathname.split('/').pop().replace('.html','')+'-demo.csv',cols.map(i=>heads[i]),rows.map(row=>cols.map(i=>row[i]||'')));
        Utils.showToast('Visible demo table exported as CSV.','success');return;
      }
      if(/^(Filter|View|Audit|Refresh|Add Listing|Stock Adjustment|Schedule Report|New Request|← Prev|Next →|Prev|Next|\d+)$/i.test(label)) {
        // The corresponding frontend prototype has no workflow behind this button.
        if(!btn.closest('#salesTable,#productTable')&&!btn.closest('.modal')){
          e.preventDefault();Utils.showToast('Demo preview: this action requires backend integration.','info');
        }
      }
    });
  },
  logout() {
    document.querySelectorAll('a[href="login.html"]').forEach(a=>a.addEventListener('click',()=>{
      sessionStorage.removeItem('erp_demo_signed_in');
    }));
  },
  tabTitles() {
    document.querySelectorAll('.sidebar .nav-link.active').forEach(a=>a.setAttribute('aria-current','page'));
  },
  appearance() {
    const pane=document.getElementById('setting-appearance');
    const titles=Array.from(pane.querySelectorAll('label')).filter(el=>['Light','Dark','System'].includes(el.textContent.trim()));
    titles.forEach((el)=>{
      el.removeAttribute('onclick');el.setAttribute('role','button');el.tabIndex=0;
      const mode=el.textContent.trim().toLowerCase();
      const apply=()=>{
        const dark=mode==='dark'||(mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
        dark?DarkMode.enable():DarkMode.disable();
        ERPStore.set('erp_theme_preference',mode);
        Utils.showToast('Theme preference saved.','info');
      };
      el.addEventListener('click',apply);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();apply();}});
    });
    const controls=Array.from(pane.querySelectorAll('select'));
    const size=controls.find(s=>s.textContent.includes('Medium (14px)'));
    const side=controls.find(s=>s.textContent.includes('Collapsed'));
    if(size){size.removeAttribute('onchange');size.value=ERPStore.get('erp_font_size','medium')==='large'?'Large (16px)':ERPStore.get('erp_font_size','medium')==='small'?'Small (12px)':'Medium (14px)';
      size.addEventListener('change',()=>{const v=size.value.startsWith('Large')?'large':size.value.startsWith('Small')?'small':'medium';ERPStore.set('erp_font_size',v);document.body.classList.toggle('large-type',v==='large');document.body.classList.toggle('small-type',v==='small');});}
    if(side){side.removeAttribute('onchange');side.value=ERPStore.get('erp_sidebar_collapsed',false)?'Collapsed':'Expanded';side.addEventListener('change',()=>{const v=side.value==='Collapsed';ERPStore.set('erp_sidebar_collapsed',v);document.body.classList.toggle('sidebar-collapsed',v);document.getElementById('sidebar')?.classList.toggle('collapsed',v);});}
    const switches=Array.from(pane.querySelectorAll('input[type=checkbox]'));
    for (const [i,key,fallback] of [[0,'erp_compact_tables',false],[1,'erp_animations',true]]) {
      const box=switches[i];if(!box)continue;box.removeAttribute('onchange');box.checked=ERPStore.get(key,fallback);
      box.addEventListener('change',()=>{ERPStore.set(key,box.checked);document.body.classList.toggle(i===0?'compact-tables':'no-motion',i===0?box.checked:!box.checked);});
    }
  }
};
document.addEventListener('DOMContentLoaded',()=>ERPUX.init());
