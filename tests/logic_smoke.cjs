/* Browser-independent regression checks for module business logic. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function load(file, key, module, name){
 const page=fs.readFileSync(path.join(root,`${file}.html`),'utf8');
 const match=page.match(new RegExp(`const ${key} = (\\[[\\s\\S]*?\\]);`));
 assert(match,`Missing ${key} seed data`);
 const data=vm.runInNewContext(match[1]);
 const context={document:{addEventListener(){}},ERPStore:{},Utils:{},confirm:()=>true};
 vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(root,'assets/js',`${module}.js`),'utf8'),context);
 return {context,data,api:vm.runInContext(name,context)};
}
const sales=load('sales','salesData','sales-demo','SalesDemo');
vm.runInContext(`var salesData=${JSON.stringify(sales.data)}`,sales.context);
assert.equal(sales.api.rows().length,10);
sales.api.search='john';
assert.equal(sales.api.rows().length,1);
sales.api.search='';sales.api.status='Cancelled';
assert.equal(sales.api.rows().length,1);
sales.api.status='All Status';sales.api.start='2026-05-03';
assert.equal(sales.api.rows().length,2);
sales.api.start='';sales.api.end='2026-04-30';
assert.equal(sales.api.rows().length,4);
const inv=load('inventory','products','inventory-demo','InventoryDemo');
vm.runInContext(`var products=${JSON.stringify(inv.data)}`,inv.context);
assert.equal(inv.api.rows().length,10);
inv.api.search='SKU-0101';assert.equal(inv.api.rows().length,1);
inv.api.search='';inv.api.category='Sports';assert.equal(inv.api.rows().length,2);
inv.api.category='All Categories';inv.api.status='Low Stock';assert.equal(inv.api.rows().length,3);
console.log('PASS: sales and inventory demo filters, seed counts, and date filtering.');
// CRUD mutation smoke checks with lightweight mocked form elements (not a browser UI test).
function field(value){return {value:String(value)};}
function mockLine(values){return {querySelectorAll:(sel)=>sel==='input'?values.map(field):[]};}
function mockEnv(item){
 const rows=[item];const messages=[];
 return {rows,messages,
  document:{querySelectorAll:()=>rows},
  Utils:{showToast:(msg)=>messages.push(msg)},
  ERPStore:{money:n=>'$'+Number(n).toFixed(2)}
 };
}
const saleEnv=mockEnv(mockLine([2,100,10]));
Object.assign(sales.context,{document:saleEnv.document,window:{},Utils:saleEnv.Utils,ERPStore:saleEnv.ERPStore});
sales.api.inputs=[field('John Davis'),field('2026-10-20'),field('Cash'),field(''),field(2),field(100),field(10),field('')];
sales.api.reset=()=>{};sales.api.persist=()=>{};sales.api.render=()=>{};
const originalSalesCount=vm.runInContext('salesData.length',sales.context);
sales.api.save();
assert.equal(vm.runInContext('salesData.length',sales.context),originalSalesCount+1);
assert.equal(vm.runInContext('salesData[0].total',sales.context),'$180.00');
const inventoryForm=[field('New Widget'),field('WID-007'),field('Electronics'),field('TechSupply Co.'),field('10'),field('20'),field('3'),field('5')];
const invEnv=mockEnv();
Object.assign(inv.context,{window:{},Utils:invEnv.Utils,ERPStore:invEnv.ERPStore});
inv.api.modal={querySelectorAll:()=>inventoryForm};
inv.api.reset=()=>{};inv.api.persist=()=>{};inv.api.render=()=>{};
const originalProductCount=vm.runInContext('products.length',inv.context);
inv.api.save();
assert.equal(vm.runInContext('products.length',inv.context),originalProductCount+1);
assert.equal(vm.runInContext('products[0].st',inv.context),'Low Stock');
console.log('PASS: mocked Sales and Inventory save workflows update demo records.');
