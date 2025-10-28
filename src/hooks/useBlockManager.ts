import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Block, BlockType } from '../types';

export function useBlockManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: type === 'text' ? '' : null,
      audioFile: type === 'audio' ? null : undefined,
      duration: type === 'audio' ? 0 : undefined,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  return {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    removeBlock,
  };
}
