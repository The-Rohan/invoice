import {esc} from './print.js';
export function ask({title,message,choices}){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='decision-dialog';dialog.setAttribute('aria-labelledby','decision-title');
  dialog.innerHTML=`<h2 id="decision-title">${esc(title)}</h2><p>${esc(message)}</p><div class="dialog-actions">${choices.map(c=>`<button type="button" data-choice="${esc(c.value)}" class="${c.primary?'primary':''}">${esc(c.label)}</button>`).join('')}</div>`;
  const done=value=>{dialog.close();dialog.remove();resolve(value);};
  dialog.addEventListener('cancel',e=>{e.preventDefault();done('cancel');});
  dialog.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>done(b.dataset.choice));document.body.append(dialog);dialog.showModal();dialog.querySelector('[data-choice="cancel"]')?.focus();
 });
}
