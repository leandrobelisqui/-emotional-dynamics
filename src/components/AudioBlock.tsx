import React, { useRef, ChangeEvent } from 'react';
import { Block } from '../types';
import { isTauri, isElectron } from '../utils/platform';
import { getBasename, getRelativePath, joinPath } from '../utils/pathUtils';

interface AudioBlockProps {
  block: Block;
  audioBasePath?: string;
  onUpdate: (updates: Partial<Block>) => void;
}

export const AudioBlock: React.FC<AudioBlockProps> = ({ block, audioBasePath, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Se está no Electron
    if (isElectron()) {
      try {
        const { selectAudioFile } = await import('../utils/electronFilePicker');
        const { loadAudioFile, getAudioDuration } = await import('../utils/electronAudioLoader');
        
        const filePath = await selectAudioFile();
        if (!filePath) return;
        
        console.log('Electron - Caminho selecionado:', filePath);
        
        const file = await loadAudioFile(filePath);
        if (!file) {
          alert('Erro ao carregar o arquivo de áudio.');
          return;
        }
        
        const duration = await getAudioDuration(file);
        
        onUpdate({
          audioFile: file,
          audioFilePath: filePath, // Caminho completo resolvido em runtime
          // Se arquivo está dentro do basePath (possivelmente em subpasta),
          // preserva a parte relativa. Senão, só o nome.
          audioFileName: getRelativePath(audioBasePath || '', filePath),
          duration
        });
      } catch (error) {
        console.error('Error in Electron file selection:', error);
        alert('Erro ao selecionar arquivo.');
      }
      return;
    }

    // Se está no Tauri
    if (isTauri()) {
      try {
        const { selectAudioFile } = await import('../utils/tauriFilePicker');
        const { loadAudioFile, getAudioDuration } = await import('../utils/tauriAudioLoader');

        const filePath = await selectAudioFile();
        if (!filePath) return;

        const file = await loadAudioFile(filePath);
        if (!file) {
          alert('Erro ao carregar o arquivo de áudio.');
          return;
        }

        const duration = await getAudioDuration(file);

        onUpdate({
          audioFile: file,
          audioFilePath: filePath,
          audioFileName: getRelativePath(audioBasePath || '', filePath),
          duration
        });
      } catch (error) {
        console.error('Error in Tauri file selection:', error);
        alert('Erro ao selecionar arquivo.');
      }
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      let filePath = file.name;

      if ((file as any).path) {
        filePath = (file as any).path;
      }

      const audio = new Audio();
      audio.onloadedmetadata = () => {
        onUpdate({
          audioFile: file,
          audioFilePath: filePath,
          audioFileName: file.name,
          duration: Math.ceil(audio.duration)
        });
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => {
        onUpdate({
          audioFile: file,
          audioFilePath: filePath,
          audioFileName: file.name,
        });
        URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    }
  };

  // Tenta recarregar o áudio direto via audioBasePath + audioFileName, sem file picker.
  // Retorna true se conseguiu; false se falhou (e deve cair pro file picker).
  const tryDirectReload = async (): Promise<boolean> => {
    if (!audioBasePath || !block.audioFileName) return false;
    const fullPath = joinPath(audioBasePath, block.audioFileName);

    if (isElectron()) {
      try {
        const { loadAudioFile, getAudioDuration } = await import('../utils/electronAudioLoader');
        const file = await loadAudioFile(fullPath);
        if (!file) return false;
        const duration = await getAudioDuration(file);
        onUpdate({
          audioFile: file,
          audioFilePath: fullPath,
          audioFileName: getRelativePath(audioBasePath, fullPath),
          duration,
        });
        return true;
      } catch (error) {
        console.error('Falha no reload direto (Electron):', error);
        return false;
      }
    }

    if (isTauri()) {
      try {
        const { loadAudioFile, getAudioDuration } = await import('../utils/tauriAudioLoader');
        const file = await loadAudioFile(fullPath);
        if (!file) return false;
        const duration = await getAudioDuration(file);
        onUpdate({
          audioFile: file,
          audioFilePath: fullPath,
          audioFileName: getRelativePath(audioBasePath, fullPath),
          duration,
        });
        return true;
      } catch (error) {
        console.error('Falha no reload direto (Tauri):', error);
        return false;
      }
    }

    // Browser: não há como ler do disco sem user gesture → file picker obrigatório
    return false;
  };

  const handleTriggerFileInput = async () => {
    // Em plataformas nativas, se já temos basePath + fileName, tenta resolver direto.
    // Se já existe um audioFile carregado, o usuário está pedindo pra TROCAR → file picker.
    if (!block.audioFile && (isElectron() || isTauri())) {
      const ok = await tryDirectReload();
      if (ok) return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/mp3,audio/*"
        className="hidden"
      />
      
      {!block.audioFile && (block.audioFileName || block.audioFilePath) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-md p-3 mb-3">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">⚠️ Áudio precisa ser recarregado</p>
              {audioBasePath && block.audioFileName ? (
                <>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 font-semibold">
                    📂 Procure o arquivo em:
                  </p>
                  <p className="text-xs text-yellow-900 dark:text-yellow-100 mt-1 break-all font-mono bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded">
                    {joinPath(audioBasePath, block.audioFileName)}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-2">
                    💡 Clique em "Recarregar" e navegue até esta pasta
                  </p>
                </>
              ) : (
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 break-all">
                  Arquivo: {getBasename(block.audioFileName || block.audioFilePath || '')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {block.audioFile ? block.audioFile.name : 'Nenhum arquivo selecionado'}
          </p>
          {block.duration && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Duração: {Math.floor(block.duration / 60)}:{String(block.duration % 60).padStart(2, '0')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleTriggerFileInput}
          className={`px-4 py-2 text-white text-sm rounded transition-colors ml-3 ${
            !block.audioFile && (block.audioFileName || block.audioFilePath)
              ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {block.audioFile ? 'Alterar' : (block.audioFileName || block.audioFilePath) ? 'Recarregar' : 'Selecionar'}
        </button>
      </div>
      {block.audioFile && (
        <div className="mt-3">
          <audio 
            src={URL.createObjectURL(block.audioFile)}
            controls 
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
