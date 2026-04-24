const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { startRemoteServer } = require('./remoteServer');

// Desligar throttling do Chromium para que a janela continue executando
// JS, timers e requestAnimationFrame em taxa normal mesmo em segundo plano.
// Essencial para o controle remoto (celular) funcionar com app minimizado/atrás.
// IMPORTANTE: precisa ser chamado antes de app.whenReady().
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
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Mantém timers/rAF/áudio rodando mesmo com janela em segundo plano
      backgroundThrottling: false,
    },
  });

  // Em desenvolvimento, carrega do Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Em produção, carrega os arquivos buildados
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createWindow();

  // Iniciar servidor de controle remoto (HTTP + WS)
  // Em dev, o build mobile fica em dist-mobile/. Em produção, o electron-builder
  // inclui essa pasta via "build.files" no package.json.
  const staticDir = path.join(__dirname, '..', 'dist-mobile');
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

// IPC Handlers para file system

// Selecionar arquivo de áudio
ipcMain.handle('dialog:openAudioFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'] }
    ]
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

// Selecionar arquivo JSON
ipcMain.handle('dialog:openJsonFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

// Salvar arquivo JSON
ipcMain.handle('dialog:saveJsonFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ],
    defaultPath: `emotional-dynamics-${new Date().toISOString().slice(0, 10)}.json`
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePath;
});

// Ler arquivo de texto
ipcMain.handle('fs:readTextFile', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

// Escrever arquivo de texto
ipcMain.handle('fs:writeTextFile', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

// Ler arquivo binário (para áudio)
ipcMain.handle('fs:readBinaryFile', async (event, filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    return buffer;
  } catch (error) {
    console.error('Error reading binary file:', error);
    throw error;
  }
});

// Obter nome do arquivo
ipcMain.handle('path:basename', async (event, filePath) => {
  return path.basename(filePath);
});

// Verificar se arquivo existe
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
  if (!remoteServer) {
    return { url: null, port: REMOTE_PORT, clientCount: 0 };
  }
  return {
    url: remoteServer.url,
    port: remoteServer.port,
    clientCount: remoteServer.getClientCount(),
  };
});

ipcMain.handle('remote:broadcast-state', async (event, state) => {
  if (remoteServer) {
    remoteServer.broadcast(state);
  }
  return true;
});
