import React from 'react';
import { Block } from '../types';
import { TextBlock } from './TextBlock';
import { AudioBlock } from './AudioBlock';

interface BlockItemProps {
  block: Block;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  audioBasePath?: string;
  onUpdate: (updates: Partial<Block>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  isActive,
  isFirst,
  isLast,
  audioBasePath,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {

  const getBlockIcon = () => {
    if (block.type === 'audio') {
      return <i className="fas fa-music text-green-500 dark:text-green-400"></i>;
    }
    return <i className="fas fa-font text-blue-500 dark:text-blue-400"></i>;
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-md border ${isActive ? 'border-blue-400 dark:border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'} 
        overflow-hidden transition-all duration-200 mb-3`}
    >
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">
            {getBlockIcon()}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {block.type === 'audio' ? 'Bloco de Áudio' : 'Bloco de Texto'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {/* Botão Subir */}
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Mover para cima"
          >
            <i className="fas fa-chevron-up"></i>
          </button>
          {/* Botão Descer */}
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Mover para baixo"
          >
            <i className="fas fa-chevron-down"></i>
          </button>
          {/* Botão Remover */}
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1"
            title="Remover bloco"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="p-4">
        {block.type === 'text' ? (
          <TextBlock block={block} onUpdate={onUpdate} />
        ) : (
          <AudioBlock block={block} audioBasePath={audioBasePath} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};

export default BlockItem;
