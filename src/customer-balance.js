import {totals} from './model.js';
const clean=s=>String(s||'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase();
export function customerKey(i){return i.account?.trim()?`account:${clean(i.account)}`:i.phone?.trim()?`phone:${i.phone.replace(/\D/g,'')}`:`name:${clean(i.customer)}`;}
export function customerOption(i){return `${i.customer} — ${i.account||i.phone||'Customer'}`;}
export function findCustomer(invoices,text){
 invoices=invoices.filter(i=>!i.deletedAt);
 const exact=invoices.filter(i=>customerOption(i)===text);
 const matches=exact.length?exact:invoices.filter(i=>clean(i.customer)===clean(text));
 if(new Set(matches.map(customerKey)).size>1)throw new Error('Several customers have this name. Choose the entry with their account or phone number.');
 return matches[0]||null; // Stored newest first, independent of editable invoice date/number.
}
export function effectiveInvoice(invoice,invoices,seen=new Set()){
 if(seen.has(invoice.id))throw new Error('Circular customer balance link.');
 if(!invoice.previousSourceId)return {...invoice};
 const parent=invoices.find(i=>i.id===invoice.previousSourceId);
 if(!parent)throw new Error('The previous invoice for this customer is missing.');
 if(customerKey(parent)!==customerKey(invoice))throw new Error('The previous invoice belongs to a different customer.');
 const next=new Set(seen);next.add(invoice.id);
 return {...invoice,previous:totals(effectiveInvoice(parent,invoices,next)).balance};
}
export function closingBalance(invoice,invoices){return totals(effectiveInvoice(invoice,invoices)).balance;}
export function validateCustomerLinks(invoices){for(const i of invoices)effectiveInvoice(i,invoices);}
export function deleteInvoice(invoices,id){
 const invoice=invoices.find(i=>i.id===id&&!i.deletedAt);if(!invoice)throw new Error('Invoice not found.');
 if(invoices.some(i=>!i.deletedAt&&i.previousSourceId===id))throw new Error('A later invoice carries this balance. Delete the later linked invoices first, or keep this bill for the account history.');
 return invoices.map(i=>i.id===id?{...i,deletedAt:new Date().toISOString()}:i);
}
export function restoreInvoice(invoices,id){
 const invoice=invoices.find(i=>i.id===id&&i.deletedAt);if(!invoice)throw new Error('Deleted invoice not found.');
 if(invoice.previousSourceId&&!invoices.some(i=>i.id===invoice.previousSourceId&&!i.deletedAt))throw new Error('Restore the previous linked invoice first.');
 const result=invoices.map(i=>{if(i.id!==id)return i;const restored={...i};delete restored.deletedAt;return restored;});validateCustomerLinks(result);return result;
}
