// preload.ts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  runCommand: (cmd) => ipcRenderer.invoke('run-command', cmd),
});


contextBridge.exposeInMainWorld('geminiAPI', {
  summarizePR: (diffText: string) => ipcRenderer.invoke('gemini-summarize-pr', diffText),
  reviewPR: (diffText: string) => ipcRenderer.invoke('gemini-review-pr', diffText),
  generateCommitTitle: (diffText: string) => ipcRenderer.invoke('gemini-generate-commit-title', diffText),
  generateCommitMessage: (diffText: string) => ipcRenderer.invoke('gemini-generate-commit-message', diffText)
});
