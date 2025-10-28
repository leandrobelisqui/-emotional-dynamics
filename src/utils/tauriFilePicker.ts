import { open, save } from '@tauri-apps/plugin-dialog';

export async function selectAudioFile(): Promise<string | null> {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Audio Files',
        extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac']
      }]
    });
    
    return selected as string | null;
  } catch (error) {
    console.error('Error selecting audio file:', error);
    return null;
  }
}

export async function selectJsonFile(): Promise<string | null> {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'JSON Files',
        extensions: ['json']
      }]
    });
    
    return selected as string | null;
  } catch (error) {
    console.error('Error selecting JSON file:', error);
    return null;
  }
}

export async function saveJsonFile(): Promise<string | null> {
  try {
    const path = await save({
      filters: [{
        name: 'JSON Files',
        extensions: ['json']
      }],
      defaultPath: `emotional-dynamics-${new Date().toISOString().slice(0, 10)}.json`
    });
    
    return path as string | null;
  } catch (error) {
    console.error('Error saving JSON file:', error);
    return null;
  }
}
