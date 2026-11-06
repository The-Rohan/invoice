// Store individual fish size in integer grams, independently of total lot weight.
export const fishSizes = Array.from({length:40},(_,i)=>(i+1)*250);
export function sizeLabel(grams){
 if(!grams)return '';
 if(Number(grams)===500)return 'Half kg (500 g)';
 return Number(grams)<1000?`${grams} g`:`${Number(grams)/1000} kg`;
}
export function sizeOptions(selected=''){
 return `<option value="">Size not specified</option>`+fishSizes.map(g=>`<option value="${g}" ${String(selected)===String(g)?'selected':''}>${sizeLabel(g)}</option>`).join('');
}
export function validSize(value){return value===undefined||value===null||value===''||((typeof value==='string'||typeof value==='number')&&fishSizes.includes(Number(value)));}
