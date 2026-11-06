import {sizeOptions} from './fish-sizes.js';
import {species,blankInvoice,totals} from './model.js';
import {esc,money} from './print.js';
export function pickerHTML(){return `<div class="fish-picker" id="fish-picker"><div class="fish-choice" role="group" aria-label="Fish type"><strong dir="rtl">مچھلی کی قسم:</strong>${[...new Set([...species,'بگ ہیڈ'])].map((s,i)=>`<button type="button" class="fish-chip" data-fish="${esc(s)}" aria-pressed="${i===0}"><span class="selected-check" aria-hidden="true">✓</span>${esc(s)}</button>`).join('')}</div><div class="quick-fields"><label class="size-field"><span>Fish size · مچھلی کا سائز</span><select id="lot-size" aria-label="Individual fish size">${sizeOptions()}</select></label><label><span>وزن (کلو / kg)</span><input id="lot-weight" aria-label="Lot weight (kg)" type="number" min="0.001" step="0.001" placeholder="وزن (کلو / kg)"></label><label><span>ریٹ (فی من = 40 کلو)</span><input id="lot-rate" aria-label="Negotiated lot rate per 40 kg" type="number" min="0.01" step="0.01" placeholder="ریٹ (فی من = 40 کلو)"></label><output id="lot-price" aria-live="polite"><span>حساب شدہ قیمت (Rupees)</span><strong>Rs. 0</strong></output><button id="add-lot" type="button">＋ لاٹ شامل کریں (Enter)</button></div><div class="custom-fish"><label for="custom-fish">Other fish / دوسری مچھلی</label><input id="custom-fish" list="species" dir="auto" placeholder="Type a custom fish name"></div><p id="lot-error" role="alert"></p></div>`;}
export function bindPicker({onAdd,onChange}){
 let selected=species[0],sizeDirty=false;
 const size=document.querySelector('#lot-size');
 size.onchange=()=>{sizeDirty=true;onChange();};
 const weight=document.querySelector('#lot-weight'),rate=document.querySelector('#lot-rate'),custom=document.querySelector('#custom-fish'),error=document.querySelector('#lot-error');
 const row=()=>({species:custom.value.trim()||selected,weight:weight.value,rate:rate.value,sizeGrams:size.value?Number(size.value):null});
 const amount=()=>totals({...blankInvoice(),rows:[row()]}).lines[0];
 function refresh(){try{document.querySelector('#lot-price strong').textContent=`Rs. ${money(weight.value&&rate.value?amount():0)}`;error.textContent='';}catch(e){document.querySelector('#lot-price strong').textContent='—';error.textContent=e.message;}}
 document.querySelectorAll('[data-fish]').forEach(b=>b.onclick=()=>{selected=b.dataset.fish;custom.value='';document.querySelectorAll('[data-fish]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));refresh();weight.focus();});
 custom.oninput=()=>{document.querySelectorAll('[data-fish]').forEach(x=>x.setAttribute('aria-pressed',String(!custom.value.trim()&&x.dataset.fish===selected)));onChange();refresh();};
 for(const input of [weight,rate])input.oninput=()=>{onChange();refresh();};
 function add(){try{if(!(Number(weight.value)>0))throw new Error('Enter a weight greater than zero.');if(!(Number(rate.value)>0))throw new Error('Enter the negotiated rate greater than zero.');amount();onAdd(row());sizeDirty=false;weight.value='';rate.value='';custom.value='';document.querySelectorAll('[data-fish]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.fish===selected)));refresh();weight.focus();}catch(e){error.textContent=e.message;}}
 document.querySelector('#add-lot').onclick=add;
 weight.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();rate.focus();}};
 rate.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(!e.repeat)add();}};
 return {hasPending:()=>Boolean(sizeDirty||weight.value||rate.value||custom.value.trim())};
}
