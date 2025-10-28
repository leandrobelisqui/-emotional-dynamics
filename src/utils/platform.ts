// Detecta se está rodando no Electron
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && 'electron' in window;
};

// Detecta se está rodando no Tauri
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

// Detecta se está rodando no navegador
export const isBrowser = (): boolean => {
  return !isTauri() && !isElectron();
};
