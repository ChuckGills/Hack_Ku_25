// preload.ts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  runCommand: (cmd) => ipcRenderer.invoke('run-command', cmd),
});
