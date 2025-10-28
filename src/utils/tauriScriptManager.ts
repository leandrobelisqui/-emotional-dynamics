import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { selectJsonFile, saveJsonFile } from './tauriFilePicker';

export async function saveScriptToFile(data: any): Promise<boolean> {
  try {
    const path = await saveJsonFile();
    if (!path) return false;
    
    await writeTextFile(path, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving script:', error);
    return false;
  }
}

export async function loadScriptFromFile(): Promise<any | null> {
  try {
    const path = await selectJsonFile();
    if (!path) return null;
    
    const content = await readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading script:', error);
    return null;
  }
}
