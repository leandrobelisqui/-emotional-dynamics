import React, { useRef, useEffect } from 'react';
import { Block, BlockListProps } from '../types';
import BlockItem from './BlockItem';

const BlockList: React.FC<BlockListProps> = ({
  blocks,
  currentBlockIndex,
  audioBasePath,
  onUpdateBlock,
  onRemoveBlock,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active block
  useEffect(() => {
    if (currentBlockIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-block-id="${blocks[currentBlockIndex]?.id}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [currentBlockIndex, blocks]);

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-plus-circle text-3xl mb-2 text-blue-400"></i>
        <p>Adicione seu primeiro bloco para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto" ref={listRef}>
      {blocks.map((block, index) => (
        <div 
          key={block.id}
          data-block-id={block.id}
          className={`relative group ${currentBlockIndex === index ? 'ring-2 ring-blue-500' : ''}`}
        >
          <BlockItem
            block={block}
            isActive={currentBlockIndex === index}
            audioBasePath={audioBasePath}
            onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            onRemove={() => onRemoveBlock(block.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default BlockList;
