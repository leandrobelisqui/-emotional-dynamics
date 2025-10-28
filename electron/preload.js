const { contextBridge, ipcRenderer } = require('electron');

// Expor API do Electron para o React de forma segura
contextBridge.exposeInMainWorld('electron', {
  // Dialog APIs
  dialog: {
    openAudioFile: () => ipcRenderer.invoke('dialog:openAudioFile'),
    openJsonFile: () => ipcRenderer.invoke('dialog:openJsonFile'),
    saveJsonFile: () => ipcRenderer.invoke('dialog:saveJsonFile'),
  },
  
  // File System APIs
  fs: {
    readTextFile: (filePath) => ipcRenderer.invoke('fs:readTextFile', filePath),
    writeTextFile: (filePath, content) => ipcRenderer.invoke('fs:writeTextFile', filePath, content),
    readBinaryFile: (filePath) => ipcRenderer.invoke('fs:readBinaryFile', filePath),
    exists: (filePath) => ipcRenderer.invoke('fs:exists', filePath),
  },
  
  // Path APIs
  path: {
    basename: (filePath) => ipcRenderer.invoke('path:basename', filePath),
  },
});
