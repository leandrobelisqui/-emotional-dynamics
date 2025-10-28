import React from 'react';
import { Block } from '../types';
import BlockList from './BlockList';
import { isTauri, isElectron } from '../utils/platform';

interface EditTabProps {
  blocks: Block[];
  currentBlockIndex: number;
  volume: number;
  audioBasePath: string;
  onAddBlock: (type: 'text' | 'audio') => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlockUp: (id: string) => void;
  onMoveBlockDown: (id: string) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioBasePathChange: (path: string) => void;
  onSaveScript: () => void;
  onLoadScript: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadScriptNative: () => void;
}

const EditTab: React.FC<EditTabProps> = ({
  blocks,
  currentBlockIndex,
  volume,
  audioBasePath,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onVolumeChange,
  onAudioBasePathChange,
  onSaveScript,
  onLoadScript,
  onLoadScriptNative,
}) => {
  const isNativePlatform = isTauri() || isElectron();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Audio Base Path Configuration */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-folder text-blue-600 mt-1 mr-3"></i>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              📂 Pasta Base dos Arquivos de Áudio
            </label>
            <input
              type="text"
              value={audioBasePath}
              onChange={(e) => onAudioBasePathChange(e.target.value)}
              placeholder="Ex: C:\Users\Leandro\Music\Dinamicas"
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              💡 Informe a pasta onde estão seus arquivos de áudio. Isso será salvo no script e facilitará encontrar os arquivos ao carregar.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Blocos</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onAddBlock('text')}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            + Texto
          </button>
          <button
            onClick={() => onAddBlock('audio')}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            + Áudio
          </button>
        </div>
      </div>
      
      <BlockList 
        blocks={blocks}
        currentBlockIndex={currentBlockIndex}
        audioBasePath={audioBasePath}
        onUpdateBlock={onUpdateBlock}
        onRemoveBlock={onRemoveBlock}
        onMoveBlockUp={onMoveBlockUp}
        onMoveBlockDown={onMoveBlockDown}
      />
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-32"
          />
        </div>
        
        <div className="mt-4 flex justify-between space-x-2">
          <button
            onClick={onSaveScript}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            <i className="fas fa-save mr-2"></i>Salvar
          </button>
          {isNativePlatform ? (
            <button
              onClick={onLoadScriptNative}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              <i className="fas fa-folder-open mr-2"></i>Carregar
            </button>
          ) : (
            <label className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-center cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={onLoadScript}
                className="hidden"
              />
              <i className="fas fa-folder-open mr-2"></i>Carregar
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTab;
