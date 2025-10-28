import React, { ChangeEvent } from 'react';
import { Block } from '../types';

interface TextBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate }) => {
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Conteúdo do texto
      </label>
      <textarea
        value={block.content || ''}
        onChange={handleTextChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={6}
        placeholder="Digite ou cole o texto aqui..."
      />
    </div>
  );
};
