const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { startRemoteServer } = require('./electron/remoteServer');

// Desligar throttling do Chromium — janela continua executando JS/timers/rAF
// em taxa normal mesmo em segundo plano. Precisa ser antes de app.whenReady().
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

let mainWindow;
let remoteServer = null;
const REMOTE_PORT = 9000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  // Carregar do Vite em desenvolvimento
  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();
  const staticDir = path.join(__dirname, 'dist-mobile');
  try {
    remoteServer = await startRemoteServer({
      port: REMOTE_PORT,
      staticDir,
      onCommand: (cmd) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('remote:command', cmd);
        }
      },
    });
  } catch (err) {
    console.error('[remote] failed to start server:', err);
  }
});

app.on('window-all-closed', () => {
  if (remoteServer) {
    try { remoteServer.stop(); } catch {}
    remoteServer = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

ipcMain.handle('dialog:openAudioFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'] }
    ]
  });
  
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:openJsonFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('dialog:saveJsonFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
    defaultPath: `emotional-dynamics-${new Date().toISOString().slice(0, 10)}.json`
  });
  
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('fs:readTextFile', async (event, filePath) => {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

ipcMain.handle('fs:writeTextFile', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

ipcMain.handle('fs:readBinaryFile', async (event, filePath) => {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    console.error('Error reading binary file:', error);
    throw error;
  }
});

ipcMain.handle('path:basename', async (event, filePath) => {
  return path.basename(filePath);
});

ipcMain.handle('fs:exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});

// Remote control IPC handlers
ipcMain.handle('remote:get-info', async () => {
  if (!remoteServer) return { url: null, port: REMOTE_PORT, clientCount: 0 };
  return {
    url: remoteServer.url,
    port: remoteServer.port,
    clientCount: remoteServer.getClientCount(),
  };
});

ipcMain.handle('remote:broadcast-state', async (event, state) => {
  if (remoteServer) remoteServer.broadcast(state);
  return true;
});
