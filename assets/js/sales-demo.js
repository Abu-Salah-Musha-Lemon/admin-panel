/* Sales module: browser-only, functional CRUD/pagination/filters/export. */
'use strict';
const SalesDemo = {
  page: 1, size: 5, search: '', status: 'All Status', start: '', end: '', editId: null,
  init() {
    const saved = ERPStore.get('erp_demo_sales_v2', null);
    if (Array.isArray(saved)) { salesData.splice(0, salesData.length, ...saved.filter(this.valid)); }
    const modal = document.getElementById('addSaleModal');
    this.inputs = modal.querySelectorAll('.modal-body select, .modal-body input, .modal-body textarea');
    this.inputs[0].options[0].disabled = true;
    this.inputs[0].options[0].value = '';
    this.inputs[0].value = '';
    this.inputs[1].value = new Date().toLocaleDateString('en-CA');
    this.inputs[5].min = 1; this.inputs[5].step = 1;
    this.inputs[6].min = 0; this.inputs[7].min = 0; this.inputs[7].max = 100;
    const save = modal.querySelector('.modal-footer .btn-primary');
    save.removeAttribute('onclick'); save.id = 'saveSaleBtn';
    save.addEventListener('click', () => this.save());
    const addItem = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Add Item'));
    if (addItem) addItem.addEventListener('click', () => this.addItem());
    modal.addEventListener('input', () => this.calculate());
    modal.addEventListener('change', e => {
      if (e.target.matches('table select')) {
        const row=e.target.closest('tr');
        const price=row.querySelectorAll('input')[1];
        price.value=e.target.value==='Wireless Headset Z3'?'129':'1299';
        this.calculate();
      }
    });
    this.calculate();
    modal.addEventListener('hidden.bs.modal', () => this.reset());
    const header = document.querySelector('#salesTable').closest('.card');
    this.tableCard = header;
    const tools = header.querySelector('.card-header');
    const search = tools.querySelector('input[type=text]');
    search.removeAttribute('onkeyup');
    search.addEventListener('input', e => { this.search = e.target.value.trim().toLowerCase(); this.page=1; this.render(); });
    const dates = tools.querySelectorAll('input[type=date]');
    dates.forEach((d,i) => { d.value='';d.setAttribute('aria-label',i?'To date':'From date');d.addEventListener('change',()=>{this.start=dates[0].value;this.end=dates[1].value;this.page=1;this.render();}); });
    const status = tools.querySelector('select');
    status.addEventListener('change', () => {this.status=status.value; this.page=1; this.render();});
    tools.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('Filter')) b.addEventListener('click',()=>this.render());
      if (b.textContent.includes('Export')) b.addEventListener('click',()=>this.export());
    });
    this.pagination=header.querySelector('.table-wrapper + div');
    this.pagination.querySelector('span').textContent='';
    this.pagination.querySelector('.d-flex').innerHTML='';
    this.render();
  },
  valid(r) { return r && typeof r.id === 'string' && typeof r.customer === 'string' && typeof r.total === 'string'; },
  rows() {
    return salesData.filter(r => {
      const q=(`${r.customer} ${r.id}`).toLowerCase().includes(this.search);
      const st=this.status==='All Status'||r.status===this.status;
      const dt=Date.parse(r.date);
      const start=!this.start||(!isNaN(dt)&&dt>=Date.parse(this.start));
      const end=!this.end||(!isNaN(dt)&&dt<=Date.parse(this.end)+86400000-1);
      return q&&st&&start&&end;
    });
  },
  render() {
    const all=this.rows(), pages=Math.max(1,Math.ceil(all.length/this.size));
    this.page=Math.max(1,Math.min(this.page,pages));
    const subset=all.slice((this.page-1)*this.size,this.page*this.size);
    document.getElementById('salesTbody').innerHTML=subset.map(r=>{
      const e=Utils.escapeHTML;
      const cls=['success','warning','danger','info'].includes(r.sc)?r.sc:'info';
      return `<tr><td><input aria-label="Select order ${e(r.id)}" type="checkbox"></td>
      <td><strong>${e(r.id)}</strong></td><td>${e(r.customer)}</td><td>${e(r.date)}</td>
      <td>${Number(r.items)||0}</td><td>${e(r.sub)}</td><td>${e(r.disc)}</td><td><strong>${e(r.total)}</strong></td>
      <td>${e(r.pay)}</td><td><span class="badge-status badge-${cls}">${e(r.status)}</span></td>
      <td><div class="action-btns">
        <button type="button" class="btn-erp btn-ghost btn-sm" title="View order" aria-label="View order" data-action="view" data-id="${e(r.id)}"><i class="bi bi-eye"></i></button>
        <button type="button" class="btn-erp btn-ghost btn-sm" title="Edit order" aria-label="Edit order" data-action="edit" data-id="${e(r.id)}"><i class="bi bi-pencil"></i></button>
        <button type="button" class="btn-erp btn-danger-ghost btn-sm" title="Delete order" aria-label="Delete order" data-action="delete" data-id="${e(r.id)}"><i class="bi bi-trash"></i></button>
      </div></td></tr>`;
    }).join('') || '<tr><td colspan="11" class="erp-empty">No orders match these filters.</td></tr>';
    const first=all.length?(this.page-1)*this.size+1:0;
    this.pagination.querySelector('span').textContent=`Showing ${first}–${Math.min(this.page*this.size,all.length)} of ${all.length} demo orders`;
    const nav=this.pagination.querySelector('.d-flex');
    const make=(label,p,active=false,disabled=false)=>`<button type="button" class="btn-erp ${active?'btn-primary':'btn-outline'} btn-sm" data-page="${p}" ${disabled?'disabled':''}>${label}</button>`;
    nav.innerHTML=make('← Prev',this.page-1,false,this.page===1) + Array.from({length:pages},(_,i)=>make(i+1,i+1,this.page===i+1)).join('')+make('Next →',this.page+1,false,this.page===pages);
  },
  bindEvents() {
    document.getElementById('salesTbody').addEventListener('click',event=>{
      const btn=event.target.closest('[data-action]');if(!btn)return;
      const r=salesData.find(x=>x.id===btn.dataset.id);if(!r)return;
      if(btn.dataset.action==='view') ERPStore.details('Sales order '+r.id,Object.entries(r).filter(([k])=>!['sc'].includes(k)));
      if(btn.dataset.action==='edit')this.edit(r);
      if(btn.dataset.action==='delete') {
        if(!confirm(`Delete demo order ${r.id}?`))return;
        salesData.splice(salesData.indexOf(r),1);this.persist();this.render();Utils.showToast('Demo order deleted.','success');
      }
    });
    this.pagination.querySelector('.d-flex').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b){this.page=Number(b.dataset.page);this.render();}});
  },
  addItem() {
    const body=document.querySelector('#addSaleModal table tbody');
    const source=body.querySelector('tr');
    const row=source.cloneNode(true);
    row.querySelector('select').value=source.querySelector('select').value;
    row.querySelectorAll('input').forEach((input,i)=>input.value=[1,1299,0][i]);
    row.querySelector('td:last-child').textContent='$1,299.00';
    body.appendChild(row);this.calculate();
  },
  calculate() {
    const rows=document.querySelectorAll('#addSaleModal table tbody tr');
    rows.forEach(row=>{
      const [qty,price,discount]=Array.from(row.querySelectorAll('input')).map(el=>Number(el.value));
      row.querySelector('td:last-child').textContent=ERPStore.money(Math.max(0,qty*price*(1-discount/100)));
    });
  },
  save() {
    const v=Array.from(this.inputs);
    const customer=v[0].value,date=v[1].value,pay=v[2].value;
    if(!customer||!date){Utils.showToast('Select a customer and order date.','warning');return;}
    if(v[3].value && v[3].value<date){Utils.showToast('Delivery date cannot be before order date.','warning');return;}
    const lines=Array.from(document.querySelectorAll('#addSaleModal table tbody tr'));
    let sub=0,disc=0,items=0;
    for(const line of lines){
      const [q,p,d]=Array.from(line.querySelectorAll('input')).map(x=>Number(x.value));
      if(!Number.isInteger(q)||q<1||!Number.isFinite(p)||p<0||d<0||d>100){Utils.showToast('Enter valid item quantity, price and discount (0–100%).','warning');return;}
      items+=q;sub+=q*p;disc+=q*p*d/100;
    }
    const original=this.editId?salesData.find(r=>r.id===this.editId):null;
    const id=original?.id||'#ORD-'+Date.now().toString().slice(-9);
    const rec={id, customer,date:new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),items,sub:ERPStore.money(sub),disc:ERPStore.money(disc),total:ERPStore.money(sub-disc),pay,status:original?.status||'Processing',sc:original?.sc||'warning'};
    if(original)Object.assign(original,rec);else salesData.unshift(rec);
    this.persist();this.page=1;this.render();
    window.bootstrap?.Modal?.getOrCreateInstance(document.getElementById('addSaleModal')).hide();
    this.reset();Utils.showToast('Sales order saved in this browser (demo).','success');
  },
  edit(record) {
    const modal=document.getElementById('addSaleModal');this.reset();this.editId=record.id;
    if (![...this.inputs[0].options].some(o=>o.value===record.customer)) {
      const option=document.createElement('option');option.value=record.customer;option.textContent=record.customer;this.inputs[0].add(option);
    }
    this.inputs[0].value=record.customer;
    const parsed=new Date(record.date);this.inputs[1].value=isNaN(parsed)?'':`${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}`;
    this.inputs[2].value=record.pay==='Card'?'Credit Card':record.pay==='Transfer'?'Bank Transfer':record.pay;
    const inputs=modal.querySelectorAll('table tbody tr:first-child input');
    inputs[0].value=record.items;
    inputs[1].value=Number(record.sub.replace(/[^\d.-]/g,''))/Math.max(1,Number(record.items));
    const sub=Number(record.sub.replace(/[^\d.-]/g,''));
    const disc=Number(record.disc.replace(/[^\d.-]/g,''));
    inputs[2].value=sub>0?Math.round(disc/sub*10000)/100:0;
    modal.querySelector('.modal-title').textContent='Edit '+record.id;
    document.getElementById('saveSaleBtn').textContent='Update Order';
    this.calculate();window.bootstrap?.Modal?.getOrCreateInstance(modal).show();
  },
  reset(){
    this.editId=null;
    const modal=document.getElementById('addSaleModal');
    modal.querySelector('.modal-title').textContent='New Sales Order';
    document.getElementById('saveSaleBtn').textContent='Create Order';
    modal.querySelector('table tbody').querySelectorAll('tr:not(:first-child)').forEach(r=>r.remove());
    this.inputs[0].value='';
    this.inputs[1].value=new Date().toLocaleDateString('en-CA');
    this.inputs[2].selectedIndex=0;this.inputs[3].value='';
    this.inputs[4].selectedIndex=0;
    this.inputs[5].value='1';this.inputs[6].value='1299';this.inputs[7].value='0';
    if(this.inputs[8])this.inputs[8].value='';
    this.calculate();
  },
  persist() { ERPStore.set('erp_demo_sales_v2',salesData); },
  export(){ERPStore.csv('asml-erp-sales-demo.csv',['Order ID','Customer','Date','Items','Subtotal','Discount','Total','Payment','Status'],this.rows().map(r=>[r.id,r.customer,r.date,r.items,r.sub,r.disc,r.total,r.pay,r.status]));Utils.showToast('CSV exported with current filters.','success');}
};
document.addEventListener('DOMContentLoaded',()=>{SalesDemo.init();SalesDemo.bindEvents();});
