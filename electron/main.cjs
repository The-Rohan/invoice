const {app,BrowserWindow,ipcMain,dialog}=require('electron');
const fs=require('node:fs/promises');
const path=require('node:path');
let win;
const dataPath=()=>path.join(app.getPath('userData'),'invoices.json');
let writeQueue=Promise.resolve();
app.whenReady().then(()=>{
 win=new BrowserWindow({width:1320,height:940,minWidth:800,minHeight:600,backgroundColor:'#f5f6f2',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.loadFile(path.join(__dirname,'../src/index.html'));
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',e=>e.preventDefault());
 ipcMain.handle('load',async()=>{try{return JSON.parse(await fs.readFile(dataPath(),'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}});
 ipcMain.handle('save',async(_,data)=>{
  const {validateStore}=await import('../src/model.js');validateStore(data);
  const task=writeQueue.then(async()=>{const p=dataPath();await fs.mkdir(path.dirname(p),{recursive:true});try{await fs.copyFile(p,p+'.previous');}catch(e){if(e.code!=='ENOENT')throw e;}await fs.writeFile(p+'.tmp',JSON.stringify(data,null,2),{mode:0o600});await fs.rename(p+'.tmp',p);});
  writeQueue=task.catch(()=>{});await task;return true;
 });
 ipcMain.handle('backup',async(_,data)=>{const {canceled,filePath}=await dialog.showSaveDialog(win,{defaultPath:'mandi-backup.json',filters:[{name:'Mandi backup',extensions:['json']}]});if(canceled)return false;await fs.writeFile(filePath,data,{mode:0o600});return true;});
 ipcMain.handle('save-pdf',async(_,number)=>{
  const safe=String(number||'invoice').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,80);
  const {canceled,filePath}=await dialog.showSaveDialog(win,{title:'Save invoice as PDF',defaultPath:`Invoice-${safe}.pdf`,filters:[{name:'PDF document',extensions:['pdf']}],properties:['showOverwriteConfirmation']});
  if(canceled||!filePath)return false;
  const bytes=await win.webContents.printToPDF({printBackground:true,preferCSSPageSize:true,landscape:true,pageSize:'A4'});
  await fs.writeFile(filePath,bytes);
  return true;
 });
 ipcMain.handle('print',()=>new Promise((resolve,reject)=>win.webContents.print({silent:false,printBackground:true,landscape:true,pageSize:'A4'},(success,reason)=>{if(success||reason==='cancelled')resolve(success);else reject(new Error(reason));})));
});
app.on('window-all-closed',()=>app.quit());
