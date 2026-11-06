import {sizeLabel} from './fish-sizes.js';
import {totals,speciesSummaryOrder} from './model.js';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money=n=>Number(n).toLocaleString('en-US');
const ur=s=>`<span dir="rtl">${esc(s)}</span>`;
const nl=s=>esc(s).replace(/\n/g,'<br>');
export function invoiceHTML(i,b){
 const t=totals(i), chunks=[];
 for(let start=0;start<i.rows.length;start+=18)chunks.push(i.rows.slice(start,start+18));
 return chunks.map((rows,page)=>{
 const start=page*18, last=page===chunks.length-1;
 const table=parity=>`<table class="invoice-table"><thead><tr><th>قیمت</th><th>ریٹ</th><th>وزن</th><th>تفصیل</th></tr></thead><tbody>${Array.from({length:Math.max(9,Math.ceil(rows.length/2))},(_,j)=>{const local=j*2+parity,r=rows[local],idx=start+local;return r?`<tr><td>${money(t.lines[idx])}</td><td>${r.rate}</td><td>${Number(r.weight).toFixed(2)}</td><td dir="rtl"><span class="serial">${idx+1}</span> ${esc(r.species)}${r.sizeGrams?` <span class="printed-size" dir="ltr">(${esc(sizeLabel(r.sizeGrams))})</span>`:''}</td></tr>`:'<tr class="empty"><td>&nbsp;</td><td></td><td></td><td></td></tr>';}).join('')}</tbody></table>`;
 const date=new Date(i.date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit'}).replaceAll(' ','-');
 return `<article class="paper"><div class="invoice-heading"><div class="contact"><strong>${ur(b.leftName)}</strong><div>${nl(b.leftPhones)}</div><strong>${ur(b.manager)}</strong><div>${nl(b.managerPhones)}</div></div><div class="business"><h1>${ur(b.name)}</h1><div dir="rtl">${esc(b.subtitle)}</div><div dir="rtl">${esc(b.tagline)}</div><strong>خریدار بل</strong></div><div class="contact"><div>${ur(b.rightTitle)}</div><strong>${ur(b.rightName)}</strong><div>${nl(b.rightPhones)}</div></div></div>
 <div class="customer-box"><div class="bill-meta"><div><b>${esc(date)}</b>${ur('تاریخ:')}</div><div><b>${esc(i.number)}</b>${ur('بل نمبر')}</div><div><b>${esc(i.account)}</b>${ur('کھاتہ نمبر')}</div></div><div class="customer-meta"><div><b dir="rtl">${esc(i.customer)}</b>${ur('نام گاہک')}</div><div><b dir="rtl">${esc(i.address)}</b>${ur('پتہ:')}</div><div><b>${esc(i.phone)}</b>${ur('فون نمبر')}</div></div></div>
 <div class="two-tables">${table(0)}${table(1)}</div>
 ${last?`<div class="weight-total"><b>${money(t.subtotal)}</b> <span>من</span><b>${t.maunds} - ${t.remainder.toFixed(2)}</b><span>کل وزن</span></div><div class="species-summary" dir="rtl">${Object.entries(t.groups).sort(([a],[b])=>{const order=speciesSummaryOrder;return (order.indexOf(a)<0?99:order.indexOf(a))-(order.indexOf(b)<0?99:order.indexOf(b));}).map(([s,w])=>`<span>${esc(s)} <b dir="ltr">${w.toFixed(1)}</b></span>`).join('')}</div>
 <div class="summary-columns"><div><p><b>${t.current}</b>${ur('موجودہ بل رقم')}</p><p><span>${i.previous}</span>${ur('سابقہ بقایا')}</p><p><span>${i.paid}</span>${ur('نقد وصولی')}</p></div><div><p><span>${i.labour}</span>${ur('مزدوری')}</p><p><span>${i.freight}</span>${ur('کرایہ')}</p><p><span>${i.other}</span>${ur('دیگر اخراجات')}</p></div><div><p class="goods-total"><b>${t.subtotal}</b>${ur('خام بکری')}</p><p><span>${t.commission}</span>${ur('کمیشن')}</p><p><span>${i.fee}</span>${ur('منشیانہ')}</p></div></div><div class="bottom-totals"><span class="signature">Signature</span><span><b>${t.balance}</b> واجب الوصول رقم</span><span><b>${t.current}</b> موجودہ بل رقم</span><span><b>${t.merchandise}</b> پکی بکری</span></div><div class="notes" dir="rtl">نوٹ: ${esc(i.notes)}</div>`:`<p class="continued" dir="rtl">جاری ہے — Page ${page+1} / ${chunks.length}</p>`}
 </article>`;
 }).join('');
}
