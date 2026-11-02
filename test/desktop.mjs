import {_electron as electron} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const dir=await fs.mkdtemp(path.join(os.tmpdir(),'mandi-test-'));
const launchOptions={
 ...(process.env.MANDI_EXECUTABLE?{executablePath:path.resolve(process.env.MANDI_EXECUTABLE)}:{}),
 args:[...(process.env.MANDI_EXECUTABLE?[]:['.']),`--user-data-dir=${dir}`,...(process.platform==='linux'?['--no-sandbox','--disable-gpu']:[])]
};
let app;
try{
 app=await electron.launch(launchOptions);
 let page=await app.firstWindow();
 await page.getByText('Try the screenshot example',{exact:true}).click();await page.locator('#save').click();
 await page.waitForFunction(()=>document.querySelector('#toast').textContent==='Invoice saved on this device.');
 const saved=JSON.parse(await fs.readFile(path.join(dir,'invoices.json'),'utf8'));assert.equal(saved.invoices[0].number,'6110');
 await page.locator('#preview').click();await page.evaluate(()=>document.fonts.ready);assert.ok((await page.locator('.bottom-totals').innerText()).includes('519250'));
 // Exercise the real PDF IPC and file writer while replacing only the OS dialog.
 await app.evaluate(({dialog},folder)=>{dialog.showSaveDialog=async()=>({canceled:false,filePath:folder+'/export.pdf'});},dir);
 await page.getByRole('button',{name:'Save as PDF',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#toast').textContent==='PDF saved.');
 assert.equal((await fs.readFile(path.join(dir,'export.pdf'))).subarray(0,5).toString(),'%PDF-');
 await app.evaluate(({dialog})=>{dialog.showSaveDialog=async()=>({canceled:true});});
 await page.getByRole('button',{name:'Save as PDF',exact:true}).click();
 await page.waitForFunction(()=>!document.querySelector('#save-pdf').disabled);
 await app.evaluate(({BrowserWindow})=>{const win=BrowserWindow.getAllWindows()[0];globalThis.printCalls=0;win.webContents.print=(_options,callback)=>{globalThis.printCalls++;callback(true);};});
 await page.getByRole('button',{name:'Print',exact:true}).click();
 await page.waitForFunction(()=>!document.querySelector('#print').disabled);
 assert.equal(await app.evaluate(()=>globalThis.printCalls),1);
 const bytes=await app.evaluate(async({BrowserWindow})=>Array.from(await BrowserWindow.getAllWindows()[0].webContents.printToPDF({printBackground:true,preferCSSPageSize:true})));
 assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
 await app.close();app=null;
 app=await electron.launch(launchOptions);page=await app.firstWindow();await page.getByRole('button',{name:'Open',exact:true}).click();assert.equal(await page.locator('[name=number]').inputValue(),'6110');
 console.log(`PASS desktop launch, native file save, preview, native PDF generation and restart persistence on ${process.platform}/${process.arch}`);
}finally{if(app)await app.close();await fs.rm(dir,{recursive:true,force:true});}
