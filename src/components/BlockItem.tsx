import React from 'react';
import { Block } from '../types';
import { TextBlock } from './TextBlock';
import { AudioBlock } from './AudioBlock';

interface BlockItemProps {
  block: Block;
  isActive: boolean;
  audioBasePath?: string;
  onUpdate: (updates: Partial<Block>) => void;
  onRemove: () => void;
}

const BlockItem: React.FC<BlockItemProps> = ({
  block,
  isActive,
  audioBasePath,
  onUpdate,
  onRemove,
}) => {

  const getBlockIcon = () => {
    if (block.type === 'audio') {
      return <i className="fas fa-music text-green-500"></i>;
    }
    return <i className="fas fa-font text-blue-500"></i>;
  };

  return (
    <div 
      className={`bg-white rounded-md border ${isActive ? 'border-blue-400 shadow-md' : 'border-gray-200'} 
        overflow-hidden transition-all duration-200 mb-3`}
    >
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">
            {getBlockIcon()}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {block.type === 'audio' ? 'Bloco de Áudio' : 'Bloco de Texto'}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
          title="Remover bloco"
        >
          <i className="fas fa-times"></i>
        </button>
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
