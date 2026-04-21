export type BlockType = 'text' | 'audio';

export interface Block {
  id: string;
  type: BlockType;
  content: string | null;
  audioFile?: File | null;
  /**
   * Caminho completo do arquivo (resolvido em runtime).
   * NÃO é persistido no JSON — é derivado de `audioBasePath + audioFileName` ao carregar.
   */
  audioFilePath?: string | null;
  /**
   * Apenas o nome do arquivo (ex.: "musica.mp3"). Persistido no JSON.
   * A pasta base fica em `ScriptData.audioBasePath`.
   */
  audioFileName?: string | null;
  duration?: number;
  scriptId?: string;
  scriptName?: string;
}

export interface LoadedScript {
  id: string;
  name: string;
  blockCount: number;
}

export interface BlockListProps {
  blocks: Block[];
  currentBlockIndex: number;
  audioBasePath?: string;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlockUp: (id: string) => void;
  onMoveBlockDown: (id: string) => void;
}

export interface BlockItemProps {
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

