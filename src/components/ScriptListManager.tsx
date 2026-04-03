import React from 'react';
import { LoadedScript } from '../types';

interface ScriptListManagerProps {
  loadedScripts: LoadedScript[];
  onRemoveScript: (scriptId: string) => void;
  onMoveScriptUp: (scriptId: string) => void;
  onMoveScriptDown: (scriptId: string) => void;
  onClearAllScripts: () => void;
}

const ScriptListManager: React.FC<ScriptListManagerProps> = ({
  loadedScripts,
  onRemoveScript,
  onMoveScriptUp,
  onMoveScriptDown,
  onClearAllScripts,
}) => {
  if (loadedScripts.length === 0) return null;

  return (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 flex items-center">
          <i className="fas fa-layer-group mr-2 text-indigo-600 dark:text-indigo-400"></i>
          Dinâmicas Carregadas ({loadedScripts.length})
        </h3>
        {loadedScripts.length > 1 && (
          <button
            onClick={onClearAllScripts}
            className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            title="Remover todas as dinâmicas"
          >
            <i className="fas fa-trash-alt mr-1"></i>
            Limpar tudo
          </button>
        )}
      </div>

      <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-3">
        As dinâmicas serão executadas na ordem listada abaixo. Reordene ou remova conforme necessário.
      </p>

      <div className="space-y-2">
        {loadedScripts.map((script, index) => (
          <div
            key={script.id}
            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-indigo-200 dark:border-indigo-700 shadow-sm"
          >
            <div className="flex items-center min-w-0">
              <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mr-2 flex-shrink-0">
                {index + 1}.
              </span>
              <i className="fas fa-file-alt text-indigo-400 dark:text-indigo-500 mr-2 flex-shrink-0"></i>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={script.name}>
                {script.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                ({script.blockCount} {script.blockCount === 1 ? 'bloco' : 'blocos'})
              </span>
            </div>

            <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
              <button
                onClick={() => onMoveScriptUp(script.id)}
                disabled={index === 0}
                className={`p-1 rounded text-xs transition-colors ${
                  index === 0
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Mover para cima"
              >
                <i className="fas fa-chevron-up"></i>
              </button>
              <button
                onClick={() => onMoveScriptDown(script.id)}
                disabled={index === loadedScripts.length - 1}
                className={`p-1 rounded text-xs transition-colors ${
                  index === loadedScripts.length - 1
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Mover para baixo"
              >
                <i className="fas fa-chevron-down"></i>
              </button>
              <button
                onClick={() => onRemoveScript(script.id)}
                className="p-1 rounded text-xs text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Remover dinâmica"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptListManager;
