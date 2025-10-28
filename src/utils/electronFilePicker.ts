// Utilitários para seleção de arquivos no Electron

declare global {
  interface Window {
    electron?: {
      dialog: {
        openAudioFile: () => Promise<string | null>;
        openJsonFile: () => Promise<string | null>;
        saveJsonFile: () => Promise<string | null>;
      };
      fs: {
        readTextFile: (filePath: string) => Promise<string>;
        writeTextFile: (filePath: string, content: string) => Promise<boolean>;
        readBinaryFile: (filePath: string) => Promise<ArrayBuffer>;
        exists: (filePath: string) => Promise<boolean>;
      };
      path: {
        basename: (filePath: string) => Promise<string>;
      };
    };
  }
}

export async function selectAudioFile(): Promise<string | null> {
  if (!window.electron) {
    console.error('Electron API not available');
    return null;
  }
  
  try {
    const filePath = await window.electron.dialog.openAudioFile();
    return filePath;
  } catch (error) {
    console.error('Error selecting audio file:', error);
    return null;
  }
}

export async function selectJsonFile(): Promise<string | null> {
  if (!window.electron) {
    console.error('Electron API not available');
    return null;
  }
  
  try {
    const filePath = await window.electron.dialog.openJsonFile();
    return filePath;
  } catch (error) {
    console.error('Error selecting JSON file:', error);
    return null;
  }
}

export async function saveJsonFile(): Promise<string | null> {
  if (!window.electron) {
    console.error('Electron API not available');
    return null;
  }
  
  try {
    const filePath = await window.electron.dialog.saveJsonFile();
    return filePath;
  } catch (error) {
    console.error('Error saving JSON file:', error);
    return null;
  }
}
