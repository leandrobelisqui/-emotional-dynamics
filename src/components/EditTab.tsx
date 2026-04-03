import React from 'react';
import { Block, LoadedScript } from '../types';
import BlockList from './BlockList';
import ScriptListManager from './ScriptListManager';
import { isTauri, isElectron } from '../utils/platform';

interface EditTabProps {
  blocks: Block[];
  currentBlockIndex: number;
  audioBasePath: string;
  loadedScripts: LoadedScript[];
  onAddBlock: (type: 'text' | 'audio') => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlockUp: (id: string) => void;
  onMoveBlockDown: (id: string) => void;
  onAudioBasePathChange: (path: string) => void;
  onSaveScript: () => void;
  onLoadScript: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadScriptNative: () => void;
  onRemoveScript: (scriptId: string) => void;
  onMoveScriptUp: (scriptId: string) => void;
  onMoveScriptDown: (scriptId: string) => void;
  onClearAllScripts: () => void;
}

const EditTab: React.FC<EditTabProps> = ({
  blocks,
  currentBlockIndex,
  audioBasePath,
  loadedScripts,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onAudioBasePathChange,
  onSaveScript,
  onLoadScript,
  onLoadScriptNative,
  onRemoveScript,
  onMoveScriptUp,
  onMoveScriptDown,
  onClearAllScripts,
}) => {
  const isNativePlatform = isTauri() || isElectron();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      {/* File Operations + Audio Base Path */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
        {/* Save/Load buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSaveScript}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <i className="fas fa-save mr-2"></i>Salvar
          </button>
          {isNativePlatform ? (
            <button
              onClick={onLoadScriptNative}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <i className="fas fa-folder-open mr-2"></i>
              {loadedScripts.length > 0 ? 'Carregar +' : 'Carregar'}
            </button>
          ) : (
            <label className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer inline-flex items-center">
              <input
                type="file"
                accept=".json"
                onChange={onLoadScript}
                className="hidden"
              />
              <i className="fas fa-folder-open mr-2"></i>
              {loadedScripts.length > 0 ? 'Carregar +' : 'Carregar'}
            </label>
          )}
          {loadedScripts.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
              Clique em "Carregar +" para adicionar mais dinamicas
            </span>
          )}
        </div>

        {/* Audio Base Path */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="fas fa-folder text-sky-600 dark:text-sky-400 text-sm"></i>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Pasta Base dos Arquivos de Audio
            </label>
            <input
              type="text"
              value={audioBasePath}
              onChange={(e) => onAudioBasePathChange(e.target.value)}
              placeholder="Ex: C:\Users\Leandro\Music\Dinamicas"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Script List Manager */}
      {loadedScripts.length > 0 && (
        <div className="px-6 pt-4">
          <ScriptListManager
            loadedScripts={loadedScripts}
            onRemoveScript={onRemoveScript}
            onMoveScriptUp={onMoveScriptUp}
            onMoveScriptDown={onMoveScriptDown}
            onClearAllScripts={onClearAllScripts}
          />
        </div>
      )}

      {/* Blocks Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Blocos</h2>
          <div className="flex gap-2">
            <button
              onClick={() => onAddBlock('text')}
              className="px-3 py-1.5 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors border border-sky-200 dark:border-sky-800"
            >
              <i className="fas fa-plus mr-1"></i> Texto
            </button>
            <button
              onClick={() => onAddBlock('audio')}
              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800"
            >
              <i className="fas fa-plus mr-1"></i> Audio
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
      </div>
    </div>
  );
};

export default EditTab;
