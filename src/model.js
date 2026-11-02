export const species = ['کفام','سلور','روہو','تھیلہ','بگ ہیڈ','گراس'];
export function blankInvoice(settings = {}) {
 return {id:crypto.randomUUID(), number:'', date:new Date().toLocaleDateString('en-CA'), customer:'', address:'', phone:'', account:'', rows:[{species:species[0],weight:0,rate:0}], commission:2, fee:0, labour:0, freight:0, other:0, previous:0, paid:0, notes:'', ...settings};
}
export const defaultBusiness = {name:'ملک مچھلی منڈی',subtitle:'مین گجرات روڈ نزد پُل بائی پاس چک',tagline:'ہول سیل کمیشن ایجنٹ',rightTitle:'پروپرائٹر',rightName:'ملک فہیم خالد',rightPhones:'0347-4904825\n0343-0503100',leftName:'محمد طاہر تارڑ',leftPhones:'0344-6559500',manager:'منیجر : رانا بابر',managerPhones:'0300-5627353\n0341-6065365'};
export function sampleInvoice() {
 const data = [[0,21,20500],[0,20,21500],[2,4.5,19000],[1,72.5,14200],[2,44,19000],[2,17,13500],[2,41.5,16500],[2,7.5,21000],[3,45.5,18000],[2,42.5,17000],[3,42,17500],[3,11.5,17500],[3,27,13500],[3,23,13500],[4,18,13000],[4,86.5,14500],[5,20.5,23000]];
 return {...blankInvoice(),number:'6110',date:'2026-10-04',customer:'آصف ماچھی بھروپی گڑھ',address:'بھروپ گڑھ',phone:'03034594274',account:'958',rows:data.map(([s,weight,rate])=>({species:species[s],weight,rate})),fee:214,labour:200,freight:2000,previous:287450};
}
// Decimal strings become scaled integers before multiplication: no binary float rounding at the rupee boundary.
function scaled(value, decimals) {
 const str=String(value);
 if(!/^\d+(\.\d+)?$/.test(str)) throw new Error('Enter a non-negative number.');
 const [whole,fraction='']=str.split('.');
 if(fraction.length>decimals && /[1-9]/.test(fraction.slice(decimals))) throw new Error(`Use at most ${decimals} decimal places.`);
 const n=Number(whole)*10**decimals + Number(fraction.slice(0,decimals).padEnd(decimals,'0'));
 if(!Number.isSafeInteger(n) || n>1e11) throw new Error('Number is too large.');
 return n;
}
export function totals(invoice) {
 if(!Array.isArray(invoice.rows) || invoice.rows.length<1 || invoice.rows.length>1000) throw new Error('Add between 1 and 1,000 items.');
 const groups={}; let grams=0;
 const lines=invoice.rows.map(row=>{
  if(typeof row.species!=='string' || !row.species.trim()) throw new Error('Choose a fish name for every row.');
  const weight=scaled(row.weight,3), rate=scaled(row.rate,2);
  const amount=Number(BigInt(weight)*BigInt(rate)/4000000n);
  if(!Number.isSafeInteger(amount)) throw new Error('Line total is too large.');
  grams+=weight; groups[row.species]=(groups[row.species]||0)+weight;
  return amount;
 });
 const subtotal=lines.reduce((a,b)=>a+b,0);
 const commissionRate=scaled(invoice.commission,2);
 if(commissionRate>10000) throw new Error('Commission must be between 0 and 100%.');
 const commission=Number((BigInt(subtotal)*BigInt(commissionRate)+5000n)/10000n);
 const amount=k=>scaled(invoice[k],0);
 const merchandise=subtotal+commission+amount('fee');
 const current=merchandise+amount('labour')+amount('freight')+amount('other');
 const balance=current+amount('previous')-amount('paid');
 if(!Number.isSafeInteger(balance)||!Number.isSafeInteger(current)) throw new Error('Total is too large.');
 return {lines,subtotal,commission,merchandise,current,balance,weight:grams/1000,maunds:Math.floor(grams/40000),remainder:(grams%40000)/1000,groups:Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v/1000]))};
}
export function validateInvoice(invoice) {
 for (const key of ['id','number','date','customer','address','phone','account','notes']) if(typeof invoice[key]!=='string' || invoice[key].length>2000) throw new Error('Invalid invoice text fields.');
 if(!invoice.customer?.trim()) throw new Error('Enter the customer name.');
 if(!invoice.number?.trim()) throw new Error('Enter a bill number.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(invoice.date)||Number.isNaN(Date.parse(invoice.date))||new Date(invoice.date).toISOString().slice(0,10)!==invoice.date) throw new Error('Choose a valid date.');
 totals(invoice);
 if(invoice.rows.some(r=>Number(r.weight)<=0 || Number(r.rate)<=0)) throw new Error('Every item needs a weight and a rate greater than zero.');
 return invoice;
}
export function validateStore(store) {
 if(store?.version!==1 || !Array.isArray(store.invoices)||typeof store.business!=='object'||!store.business||Array.isArray(store.business)) throw new Error('This is not a Mandi Invoice backup.');
 for(const key of Object.keys(defaultBusiness)) if(typeof store.business[key]!=='string') throw new Error('Invalid business settings in backup.');
 const ids=new Set(),numbers=new Set();
 for(const i of store.invoices){validateInvoice(i);if(typeof i.id!=='string'||!i.id||ids.has(i.id)||numbers.has(i.number))throw new Error('Duplicate or invalid invoice in backup.');ids.add(i.id);numbers.add(i.number);}
 return store;
}
export const emptyStore = ()=>({version:1,business:{...defaultBusiness},invoices:[]});
