// Carregador de áudio para Electron

export async function loadAudioFile(path: string): Promise<File | null> {
  if (!window.electron) {
    console.error('Electron API not available');
    return null;
  }
  
  try {
    const data = await window.electron.fs.readBinaryFile(path);
    const fileName = await window.electron.path.basename(path);
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

// Verificar se um arquivo de áudio existe
export async function audioFileExists(path: string): Promise<boolean> {
  if (!window.electron) {
    return false;
  }
  
  try {
    return await window.electron.fs.exists(path);
  } catch (error) {
    console.error('Error checking audio file:', error);
    return false;
  }
}
