export type BlockType = 'text' | 'audio';

export interface Block {
  id: string;
  type: BlockType;
  content: string | null;
  audioFile?: File | null;
  audioFilePath?: string | null;
  duration?: number;
}

export interface BlockListProps {
  blocks: Block[];
  currentBlockIndex: number;
  audioBasePath?: string;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
}

export interface BlockItemProps {
  block: Block;
  isActive: boolean;
  audioBasePath?: string;
  onUpdate: (updates: Partial<Block>) => void;
  onRemove: () => void;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}
