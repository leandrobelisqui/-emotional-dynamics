// Gerenciador de scripts para Electron

export async function saveScriptToFile(data: any): Promise<boolean> {
  if (!window.electron) {
    console.error('Electron API not available');
    return false;
  }
  
  try {
    const path = await window.electron.dialog.saveJsonFile();
    if (!path) return false;
    
    await window.electron.fs.writeTextFile(path, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving script:', error);
    return false;
  }
}

export async function loadScriptFromFile(): Promise<any | null> {
  if (!window.electron) {
    console.error('Electron API not available');
    return null;
  }
  
  try {
    const path = await window.electron.dialog.openJsonFile();
    if (!path) return null;
    
    const content = await window.electron.fs.readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading script:', error);
    return null;
  }
}
