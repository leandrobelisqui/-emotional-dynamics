import { useState, useRef } from 'react';
import { Block } from '../types';

export function usePlaybackControls(blocks: Block[]) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  const playPause = (_currentAudioIndex: number, setCurrentAudioIndex: (index: number) => void) => {
    if (currentBlockIndex === -1 && blocks.length > 0) {
      setCurrentBlockIndex(0);
      setIsPlaying(true);
      // Find first audio block
      const firstAudioIndex = blocks.findIndex(b => b.type === 'audio');
      if (firstAudioIndex !== -1) {
        setCurrentAudioIndex(firstAudioIndex);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (nextAudioRef.current) {
      nextAudioRef.current.pause();
      nextAudioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentBlockIndex(-1);
  };

  const nextBlock = () => {
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const previousBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const playBlockAudio = (blockIndex: number, setCurrentAudioIndex: (index: number) => void) => {
    const block = blocks[blockIndex];
    if (block.type === 'audio' && block.audioFile) {
      // Definir o índice do áudio
      setCurrentAudioIndex(blockIndex);
      // Definir o bloco atual
      setCurrentBlockIndex(blockIndex);
      // Iniciar reprodução
      setIsPlaying(true);
      console.log('▶️ Iniciando reprodução do áudio:', block.audioFile.name, 'no índice:', blockIndex);
    }
  };

  return {
    currentBlockIndex,
    isPlaying,
    audioRef,
    nextAudioRef,
    playPause,
    stop,
    nextBlock,
    previousBlock,
    playBlockAudio,
  };
}
