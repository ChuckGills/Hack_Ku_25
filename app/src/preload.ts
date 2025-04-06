// preload.ts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
  runCommand: (cmd) => ipcRenderer.invoke('run-command', cmd),
  openLink: (url) => ipcRenderer.invoke('open-url', url)
});

contextBridge.exposeInMainWorld('geminiAPI', {
  summarizePR: (diffText) => ipcRenderer.invoke('gemini-summarize-pr', diffText),
  reviewPR: (diffText) => ipcRenderer.invoke('gemini-review-pr', diffText),
  generateCommitTitle: (diffText) => ipcRenderer.invoke('gemini-generate-commit-title', diffText),
  generateCommitMessage: (diffText) => ipcRenderer.invoke('gemini-generate-commit-message', diffText)
});