import {chromium} from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve('src');
const server=http.createServer(async(req,res)=>{try{const p=path.resolve(root,'.'+decodeURIComponent(req.url==='/'?'/index.html':req.url));if(!p.startsWith(root+path.sep))throw Error();const content=await fs.readFile(p);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf'})[path.extname(p)]||'application/octet-stream');res.end(content);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await fs.mkdir('docs/screenshots',{recursive:true});
 async function capture(name) {
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#toast').waitFor({state:'hidden'});
  await page.screenshot({path:`docs/screenshots/${name}.png`,fullPage:true});
  console.log(`Captured ${name}`);
 }
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.getByText('Try the screenshot example',{exact:true}).click();
 await page.locator('#save').click();
 await page.waitForFunction(()=>document.querySelector('#toast').textContent==='Invoice saved on this device.');
 await page.locator('#home').click();
 await page.getByRole('button',{name:'Open',exact:true}).waitFor();
 await capture('01-invoices');
 await page.getByRole('button',{name:'Open',exact:true}).click();
 await page.locator('#rows tr').last().waitFor();
 await capture('02-invoice-editor');
 await page.locator('#preview').click();
 await page.locator('.paper').waitFor();
 await capture('03-print-preview');
 await page.locator('#settings').click();
 await page.locator('#business').waitFor();
 await capture('04-business-settings');
 assert.deepEqual(errors,[]);
 console.log('Captured four real application screens without page errors.');
} finally {
 await browser.close();
 server.close();
}
