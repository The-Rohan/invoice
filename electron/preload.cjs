const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{load:()=>ipcRenderer.invoke('load'),save:data=>ipcRenderer.invoke('save',data),backup:data=>ipcRenderer.invoke('backup',data),print:()=>ipcRenderer.invoke('print')});
