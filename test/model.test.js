import {customerOption,findCustomer,closingBalance,effectiveInvoice,validateCustomerLinks,deleteInvoice,restoreInvoice} from '../src/customer-balance.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleInvoice,totals,validateInvoice,validateStore,emptyStore,defaultBusiness,legacyBusiness,upgradeBusinessDefaults,species} from '../src/model.js';
import {invoiceHTML} from '../src/print.js';
test('all 17 screenshot lines, species weights and final balances reconcile',()=>{const t=totals(sampleInvoice());assert.deepEqual(t.lines,[10762,10750,2137,25737,20900,5737,17118,3937,20475,18062,18375,5031,9112,7762,5850,31356,11787]);assert.equal(t.subtotal,224888);assert.equal(t.weight,544.5);assert.equal(t.maunds,13);assert.equal(t.remainder,24.5);assert.equal(t.commission,4498);assert.equal(t.merchandise,229600);assert.equal(t.current,231800);assert.equal(t.balance,519250);assert.deepEqual(Object.values(t.groups),[41,157,72.5,149,104.5,20.5]);});
test('negotiated rates remain independent for repeated fish',()=>{const i=sampleInvoice();i.rows=[{species:'روہو',weight:40,rate:100},{species:'روہو',weight:40,rate:200}];assert.deepEqual(totals(i).lines,[100,200]);});
test('decimal multiplication floors exactly and payments reduce balance',()=>{const i=sampleInvoice();i.rows=[{species:'Fish',weight:'0.001',rate:'39999.99'}];assert.equal(totals(i).lines[0],0);i.paid=500;assert.equal(totals(i).balance,totals({...i,paid:0}).balance-500);});
test('invalid monetary input and missing fields are rejected',()=>{for(const value of [-1,NaN,Infinity,'','1e9'])assert.throws(()=>totals({...sampleInvoice(),fee:value}));assert.throws(()=>validateInvoice({...sampleInvoice(),customer:''}));assert.throws(()=>totals({...sampleInvoice(),commission:101}));assert.throws(()=>totals({...sampleInvoice(),fee:0.5}));});
test('backup rejects malformed data and duplicate bills',()=>{assert.throws(()=>validateStore({version:2}));const s=emptyStore();s.invoices=[sampleInvoice()];assert.equal(validateStore(s),s);s.invoices.push({...sampleInvoice(),id:'other'});assert.throws(()=>validateStore(s));});
test('two-column odd/even layout, pagination and escaping',()=>{const s=emptyStore(),i=sampleInvoice();i.customer='<script>bad()</script>';let html=invoiceHTML(i,s.business);assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.equal((html.match(/class="paper"/g)||[]).length,1);assert.ok(html.indexOf('10762')<0);i.rows.push(...structuredClone(i.rows));html=invoiceHTML(i,s.business);assert.equal((html.match(/class="paper"/g)||[]).length,2);assert.equal((html.match(/519250/g)||[]).length,0);assert.equal((html.match(/class="bottom-totals"/g)||[]).length,1);});

test('upgrading untouched business defaults preserves invoice history and is idempotent',()=>{
 const old=emptyStore();old.business={...legacyBusiness};const noSnapshot=sampleInvoice();const customSnapshot={...sampleInvoice(),id:'second',number:'6111',business:{...legacyBusiness,name:'Historical header'}};old.invoices=[noSnapshot,customSnapshot];
 const before=structuredClone(old),upgraded=upgradeBusinessDefaults(old);
 assert.deepEqual(old,before);
 assert.deepEqual(upgraded.business,defaultBusiness);
 assert.deepEqual(upgraded.invoices[0].business,legacyBusiness);
 assert.equal(upgraded.invoices[1].business.name,'Historical header');
 assert.equal(upgradeBusinessDefaults(upgraded),upgraded);
 assert.equal(totals(upgraded.invoices[0]).balance,519250);
 const custom=structuredClone(old);custom.business.name='My business';assert.equal(upgradeBusinessDefaults(custom),custom);
});
test('new fish entries print the corrected business details without fixed prices',()=>{
 const i=sampleInvoice();i.rows=[{species:'ملی',weight:40,rate:100},{species:'چڑا',weight:40,rate:200}];
 const html=invoiceHTML(i,defaultBusiness);
 for(const text of ['مٹمل مچھلی منڈی','عامر شہزاد مٹمل','رانا آصف','منشی فرحان آصف','0320-5827942','0329-6499536','0303-4594274','0347-9612206','ملی','چڑا'])assert.ok(html.includes(text),text);
 assert.deepEqual(totals(i).lines,[100,200]);
 assert.ok(!species.includes('ٹلی') && !species.includes('چپڑا'));
 assert.ok(species.includes('ملی') && species.includes('چڑا'));
});

test('returning customer balance chains carry once, account for payments and reflect edits',()=>{
 const a={...sampleInvoice(),id:'a',number:'1',previous:100,commission:0,fee:0,labour:0,freight:0,rows:[{species:'Fish',weight:40,rate:1000}],paid:300};
 const b={...a,id:'b',number:'2',previous:800,previousSourceId:'a',paid:200};
 const c={...a,id:'c',number:'3',previous:1600,previousSourceId:'b',paid:0};
 const invoices=[c,b,a];assert.equal(closingBalance(c,invoices),2600);
 a.paid=500;assert.equal(closingBalance(c,invoices),2400);assert.equal(effectiveInvoice(b,invoices).previous,600);
 b.paid=3000;assert.equal(closingBalance(b,invoices),-1400);assert.equal(effectiveInvoice(c,invoices).previous,-1400);
 assert.equal(closingBalance(c,invoices),-400);
});
test('duplicate names require account selection and unsafe customer links are rejected',()=>{
 const a={...sampleInvoice(),id:'a',account:'1'},b={...sampleInvoice(),id:'b',number:'2',account:'2'};
 assert.throws(()=>findCustomer([b,a],a.customer),/Several/);
 assert.equal(findCustomer([b,a],customerOption(a)),a);
 assert.throws(()=>validateCustomerLinks([a,{...b,previousSourceId:'a'}]),/different customer/);
 assert.throws(()=>validateCustomerLinks([{...a,previousSourceId:'missing'}]),/missing/);
 assert.throws(()=>validateCustomerLinks([{...a,previousSourceId:'a'}]),/Circular/);
});

test('invoice deletion is reversible and protects linked balances',()=>{
 const a={...sampleInvoice(),id:'a'},b={...sampleInvoice(),id:'b',number:'6111',previousSourceId:'a'};
 assert.throws(()=>deleteInvoice([b,a],'a'),/later invoice/);
 const deleted=deleteInvoice([b,a],'b');assert.equal(findCustomer(deleted,a.customer).id,'a');
 assert.ok(deleted[0].deletedAt);assert.ok(!b.deletedAt);
 const both=deleteInvoice(deleted,'a');assert.throws(()=>restoreInvoice(both,'b'),/previous linked/);
 const restored=restoreInvoice(restoreInvoice(both,'a'),'b');assert.equal(restored[0].deletedAt,undefined);
 assert.equal(closingBalance(restored[0],restored),closingBalance(b,[b,a]));
});
test('individual fish sizes preserve prices, survive backups and reject invalid ranges',()=>{
 const invoice=sampleInvoice(),expected=totals(invoice);
 for(let grams=250;grams<=10000;grams+=250){invoice.rows[0].sizeGrams=grams;validateInvoice(invoice);assert.deepEqual(totals(invoice),expected);}
 invoice.rows[0].sizeGrams=1250;
 const store=emptyStore();store.invoices=[invoice];const restored=JSON.parse(JSON.stringify(store));validateStore(restored);
 assert.equal(restored.invoices[0].rows[0].sizeGrams,1250);assert.match(invoiceHTML(invoice,store.business),/1.25 kg/);
 for(const bad of [0,249,251,10250,-250,'<script>',[],true]){invoice.rows[0].sizeGrams=bad;assert.throws(()=>validateStore(store),/fish size/);}
 delete invoice.rows[0].sizeGrams;validateStore(store);
});
