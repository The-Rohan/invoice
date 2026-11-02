import {_electron as electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mandi-test-'));
let app;
try{
 app=await electron.launch({args:['.',`--user-data-dir=${dir}`,...(process.platform==='linux'?['--no-sandbox','--disable-gpu']:[])]});
 let page=await app.firstWindow();
 await page.getByText('Try the screenshot example',{exact:true}).click();await page.locator('#save').click();
 await page.waitForFunction(()=>document.querySelector('#toast').textContent==='Invoice saved on this device.');
 const saved=JSON.parse(await fs.readFile(path.join(dir,'invoices.json'),'utf8'));assert.equal(saved.invoices[0].number,'6110');
 await page.locator('#preview').click();await page.evaluate(()=>document.fonts.ready);assert.ok((await page.locator('.bottom-totals').innerText()).includes('519250'));
 const bytes=await app.evaluate(async({BrowserWindow})=>Array.from(await BrowserWindow.getAllWindows()[0].webContents.printToPDF({printBackground:true,preferCSSPageSize:true})));
 assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
 await app.close();app=null;
 app=await electron.launch({args:['.',`--user-data-dir=${dir}`,...(process.platform==='linux'?['--no-sandbox','--disable-gpu']:[])]});page=await app.firstWindow();await page.getByRole('button',{name:'Open',exact:true}).click();assert.equal(await page.locator('[name=number]').inputValue(),'6110');
 console.log(`PASS desktop launch, native file save, preview, native PDF generation and restart persistence on ${process.platform}/${process.arch}`);
}finally{if(app)await app.close();await fs.rm(dir,{recursive:true,force:true});}
