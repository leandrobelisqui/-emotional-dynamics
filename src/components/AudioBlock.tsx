import React, { useRef, ChangeEvent } from 'react';
import { Block } from '../types';
import { isTauri, isElectron } from '../utils/platform';

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
          audioFilePath: filePath, // Caminho completo!
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
          duration: Math.ceil(audio.duration)
        });
        URL.revokeObjectURL(audio.src);
      };
      audio.onerror = () => {
        onUpdate({ 
          audioFile: file,
          audioFilePath: filePath
        });
        URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    }
  };

  const handleTriggerFileInput = () => {
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
      
      {!block.audioFile && block.audioFilePath && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3 mb-3">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">⚠️ Áudio precisa ser recarregado</p>
              {audioBasePath ? (
                <>
                  <p className="text-xs text-yellow-700 mt-2 font-semibold">
                    📂 Procure o arquivo em:
                  </p>
                  <p className="text-xs text-yellow-900 mt-1 break-all font-mono bg-yellow-100 p-2 rounded">
                    {audioBasePath}{audioBasePath.endsWith('\\') ? '' : '\\'}{block.audioFilePath}
                  </p>
                  <p className="text-xs text-yellow-600 mt-2">
                    💡 Clique em "Recarregar" e navegue até esta pasta
                  </p>
                </>
              ) : (
                <p className="text-xs text-yellow-700 mt-1 break-all">
                  Arquivo: {block.audioFilePath}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            {block.audioFile ? block.audioFile.name : 'Nenhum arquivo selecionado'}
          </p>
          {block.duration && (
            <p className="text-xs text-gray-500 mt-1">
              Duração: {Math.floor(block.duration / 60)}:{String(block.duration % 60).padStart(2, '0')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleTriggerFileInput}
          className={`px-4 py-2 text-white text-sm rounded transition-colors ml-3 ${
            !block.audioFile && block.audioFilePath
              ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {block.audioFile ? 'Alterar' : block.audioFilePath ? 'Recarregar' : 'Selecionar'}
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
