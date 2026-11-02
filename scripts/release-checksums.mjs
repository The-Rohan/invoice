import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {version}=JSON.parse(await fs.readFile('package.json','utf8'));
const files=[`Mandi-Invoice-${version}-mac-intel.dmg`,`Mandi-Invoice-${version}-windows-x64.exe`];
const sums=[];
for(const name of files){
 const data=await fs.readFile(`release/${name}`);
 if(data.length<1_000_000)throw new Error(`Incomplete download: ${name}`);
 const expected=name.endsWith('.exe')?data.subarray(0,2).toString()==='MZ':data.subarray(-512,-508).toString()==='koly';
 if(!expected)throw new Error(`Invalid installer file signature: ${name}`);
 sums.push(`${createHash('sha256').update(data).digest('hex')}  ${name}`);
}
await fs.writeFile('release/SHA256SUMS',sums.join('\n')+'\n');
console.log('Both installer signatures verified; SHA256SUMS written.');
