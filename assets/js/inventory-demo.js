/* Inventory module: browser-only, functional CRUD/filter/export. */
'use strict';
const InventoryDemo={
 page:1,size:5,search:'',category:'All Categories',status:'All Stock',editSku:null,
 init(){
  const saved=ERPStore.get('erp_demo_inventory_v2',null);
  if(Array.isArray(saved))products.splice(0,products.length,...saved.filter(p=>p&&typeof p.sku==='string'&&typeof p.name==='string'));
  this.modal=document.getElementById('addProductModal');
  const supplierSelect=this.modal.querySelectorAll('.modal-body select')[1];
  [...new Set(products.map(p=>p.supplier))].forEach(name=>{
    if (![...supplierSelect.options].some(o=>o.value===name)) {
      const option=document.createElement('option');option.value=name;option.textContent=name;supplierSelect.add(option);
    }
  });
  this.inputs=this.modal.querySelectorAll('.modal-body input, .modal-body select, .modal-body textarea');
  this.modal.querySelector('.modal-footer .btn-primary').removeAttribute('onclick');
  this.modal.querySelector('.modal-footer .btn-primary').addEventListener('click',()=>this.save());
  this.modal.addEventListener('hidden.bs.modal',()=>this.reset());
  const supplier=document.getElementById('addSupplierModal');
  const supSave=supplier?.querySelector('.modal-footer .btn-primary');
  if(supSave){supSave.removeAttribute('onclick');supSave.addEventListener('click',()=>Utils.showToast('Supplier management requires a connected backend.','info'));}
  this.card=document.getElementById('productTable').closest('.card');
  const h=this.card.querySelector('.card-header');
  const search=h.querySelector('input[type=text]');search.removeAttribute('onkeyup');
  search.addEventListener('input',e=>{this.search=e.target.value.toLowerCase().trim();this.page=1;this.render();});
  const sels=h.querySelectorAll('select');
  sels[0].addEventListener('change',e=>{this.category=e.target.value;this.page=1;this.render();});
  sels[1].addEventListener('change',e=>{this.status=e.target.value;this.page=1;this.render();});
  h.querySelectorAll('button').forEach(b=>{if(b.textContent.includes('Export'))b.addEventListener('click',()=>this.export());});
  this.pagination=this.card.querySelector('.table-wrapper + div');this.pagination.querySelector('.d-flex').innerHTML='';
  document.getElementById('productTbody').addEventListener('click',e=>{
   const btn=e.target.closest('[data-action]');if(!btn)return;
   const r=products.find(x=>x.sku===btn.dataset.sku);if(!r)return;
   if(btn.dataset.action==='view')ERPStore.details('Product '+r.sku,Object.entries(r).filter(([k])=>!['sc'].includes(k)));
   if(btn.dataset.action==='edit')this.edit(r);
   if(btn.dataset.action==='delete'&&confirm(`Delete demo product ${r.name}?`)){products.splice(products.indexOf(r),1);this.persist();this.render();Utils.showToast('Demo product deleted.','success');}
  });
  this.pagination.querySelector('.d-flex').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b){this.page=Number(b.dataset.page);this.render();}});
  this.render();
 },
 rows(){return products.filter(p=>{const q=(`${p.name} ${p.sku}`).toLowerCase().includes(this.search.toLowerCase());const cat=this.category==='All Categories'||p.cat===this.category;const st=this.status==='All Stock'||p.st===this.status;return q&&cat&&st;});},
 render(){
  const all=this.rows(),pages=Math.max(1,Math.ceil(all.length/this.size));this.page=Math.max(1,Math.min(pages,this.page));
  const subset=all.slice((this.page-1)*this.size,this.page*this.size);
  document.getElementById('productTbody').innerHTML=subset.map(p=>{
   const e=Utils.escapeHTML;const cls=['success','warning','danger'].includes(p.sc)?p.sc:'warning';
   return `<tr><td><input type="checkbox" aria-label="Select ${e(p.sku)}"></td><td><strong>${e(p.name)}</strong></td>
   <td><code>${e(p.sku)}</code></td><td>${e(p.cat)}</td><td>${e(p.supplier)}</td><td>${e(p.cost)}</td>
   <td><strong>${e(p.price)}</strong></td><td><strong>${Number(p.stock)||0}</strong></td><td>${Number(p.res)||0}</td><td>${Number(p.reorder)||0}</td>
   <td><span class="badge-status badge-${cls}">${e(p.st)}</span></td><td><div class="action-btns">
   <button type="button" class="btn-erp btn-ghost btn-sm" title="View product" aria-label="View product" data-action="view" data-sku="${e(p.sku)}"><i class="bi bi-eye"></i></button>
   <button type="button" class="btn-erp btn-ghost btn-sm" title="Edit product" aria-label="Edit product" data-action="edit" data-sku="${e(p.sku)}"><i class="bi bi-pencil"></i></button>
   <button type="button" class="btn-erp btn-danger-ghost btn-sm" title="Delete product" aria-label="Delete product" data-action="delete" data-sku="${e(p.sku)}"><i class="bi bi-trash"></i></button></div></td></tr>`;
  }).join('')||'<tr><td colspan="12" class="erp-empty">No products match the current filters.</td></tr>';
  const first=all.length?(this.page-1)*this.size+1:0;
  this.pagination.querySelector('span').textContent=`Showing ${first}–${Math.min(this.page*this.size,all.length)} of ${all.length} demo products`;
  const make=(label,p,active=false,disabled=false)=>`<button type="button" class="btn-erp ${active?'btn-primary':'btn-outline'} btn-sm" data-page="${p}" ${disabled?'disabled':''}>${label}</button>`;
  this.pagination.querySelector('.d-flex').innerHTML=make('← Prev',this.page-1,false,this.page===1)+Array.from({length:pages},(_,i)=>make(i+1,i+1,this.page===i+1)).join('')+make('Next →',this.page+1,false,this.page===pages);
 },
 save(){
  const modal=this.modal;
  // Input ordering in modal: Name, SKU, Category, Supplier, Cost, Price, Stock, Reorder, Warehouse, Description
  const fields=modal.querySelectorAll('.modal-body input, .modal-body select');
  const [name,sku,cat,supplier,cost,price,stock,reorder]=Array.from(fields).map(x=>x.value.trim());
  if(!name||!sku||!supplier){Utils.showToast('Product name, SKU and supplier are required.','warning');return;}
  const num=[cost,price,stock,reorder].map(Number);
  if(num.some(x=>!Number.isFinite(x)||x<0)||!Number.isInteger(num[2])||!Number.isInteger(num[3])){Utils.showToast('Prices and stock must be valid nonnegative numbers.','warning');return;}
  if(products.some(p=>p.sku.toLowerCase()===sku.toLowerCase()&&p.sku!==this.editSku)){Utils.showToast('SKU already exists. Use a unique SKU.','warning');return;}
  const st=num[2]===0?'Out of Stock':num[2]<=num[3]?'Low Stock':'In Stock';
  const record={name,sku,cat,supplier,cost:ERPStore.money(num[0]),price:ERPStore.money(num[1]),stock:num[2],res:0,reorder:num[3],st,sc:st==='In Stock'?'success':'danger'};
  const old=this.editSku?products.find(p=>p.sku===this.editSku):null;
  if(old){record.res=old.res;Object.assign(old,record);}else products.unshift(record);
  this.persist();this.page=1;this.render();
  window.bootstrap?.Modal?.getOrCreateInstance(modal).hide();this.reset();Utils.showToast('Product saved in this browser (demo).','success');
 },
 edit(p){this.reset();this.editSku=p.sku;const fields=this.modal.querySelectorAll('.modal-body input, .modal-body select');
  const vals=[p.name,p.sku,p.cat,p.supplier,p.cost.replace(/[^\d.]/g,''),p.price.replace(/[^\d.]/g,''),p.stock,p.reorder];
  vals.forEach((v,i)=>{fields[i].value=v;});
  this.modal.querySelector('.modal-title').textContent='Edit product '+p.sku;
  this.modal.querySelector('.modal-footer .btn-primary').textContent='Update Product';
  window.bootstrap?.Modal?.getOrCreateInstance(this.modal).show();
 },
 reset(){this.editSku=null;this.modal.querySelector('.modal-title').textContent='Add New Product';this.modal.querySelector('.modal-footer .btn-primary').textContent='Save Product';this.modal.querySelectorAll('.modal-body input, .modal-body textarea').forEach(i=>i.value='');},
 persist(){ERPStore.set('erp_demo_inventory_v2',products);},
 export(){ERPStore.csv('asml-erp-inventory-demo.csv',['Product','SKU','Category','Supplier','Cost','Price','Stock','Reserved','Reorder','Status'],this.rows().map(p=>[p.name,p.sku,p.cat,p.supplier,p.cost,p.price,p.stock,p.res,p.reorder,p.st]));Utils.showToast('CSV exported with current filters.','success');}
};
document.addEventListener('DOMContentLoaded',()=>InventoryDemo.init());
