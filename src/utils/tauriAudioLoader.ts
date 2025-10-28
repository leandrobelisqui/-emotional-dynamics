import { readFile } from '@tauri-apps/plugin-fs';
import { basename } from '@tauri-apps/api/path';

export async function loadAudioFile(path: string): Promise<File | null> {
  try {
    const data = await readFile(path);
    const fileName = await basename(path);
    const blob = new Blob([data], { type: 'audio/mpeg' });
    return new File([blob], fileName, { type: 'audio/mpeg' });
  } catch (error) {
    console.error('Error loading audio file:', error);
    return null;
  }
}

export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(Math.ceil(audio.duration));
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(audio.src);
    };
    audio.src = URL.createObjectURL(file);
  });
}
