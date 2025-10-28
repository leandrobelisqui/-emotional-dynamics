import { useState, useRef, useEffect } from 'react';
import { Block } from '../types';

interface UseAudioPlayerProps {
  blocks: Block[];
  volume: number;
  crossfadeDuration: number;
  isPlaying: boolean;
}

export function useAudioPlayer({ blocks, volume, crossfadeDuration, isPlaying }: UseAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(-1);
  const audioUrlsRef = useRef<Map<string, string>>(new Map());
  
  // Use refs para volume e crossfadeDuration para não reiniciar a música quando mudarem
  const volumeRef = useRef<number>(volume);
  const crossfadeDurationRef = useRef<number>(crossfadeDuration);
  
  // Atualizar refs quando valores mudarem
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);
  
  useEffect(() => {
    crossfadeDurationRef.current = crossfadeDuration;
  }, [crossfadeDuration]);

  // Effect to handle audio playback with crossfade and memory management
  useEffect(() => {
    if (currentAudioIndex === -1 || !blocks[currentAudioIndex]) return;

    const currentBlock = blocks[currentAudioIndex];
    
    if (currentBlock.type === 'audio' && currentBlock.audioFile && audioRef.current) {
      const audio = audioRef.current;
      
      // Check if there's currently playing audio (for crossfade)
      const shouldCrossfade = !audio.paused && audio.src;
      
      if (shouldCrossfade && nextAudioRef.current) {
        // Crossfade implementation
        const nextAudio = nextAudioRef.current;
        const audioUrl = URL.createObjectURL(currentBlock.audioFile);
        
        // Store URL for cleanup
        audioUrlsRef.current.set(currentBlock.id, audioUrl);
        
        nextAudio.src = audioUrl;
        nextAudio.volume = 0;
        
        nextAudio.play().catch(e => console.error('Error playing next audio:', e));
        
        // Crossfade duration from ref (não reinicia a música quando muda)
        const fadeDuration = crossfadeDurationRef.current;
        const fadeSteps = 50;
        const fadeInterval = fadeDuration / fadeSteps;
        let step = 0;
        
        const crossfadeTimer = setInterval(() => {
          step++;
          const progress = step / fadeSteps;
          
          // Fade out current audio (usa ref para não reiniciar)
          audio.volume = Math.max(0, volumeRef.current * (1 - progress));
          // Fade in next audio (usa ref para não reiniciar)
          nextAudio.volume = Math.min(volumeRef.current, volumeRef.current * progress);
          
          if (step >= fadeSteps) {
            clearInterval(crossfadeTimer);
            
            // Cleanup old audio URL
            const oldSrc = audio.src;
            if (oldSrc && oldSrc.startsWith('blob:')) {
              URL.revokeObjectURL(oldSrc);
            }
            
            audio.pause();
            audio.currentTime = 0;
            
            // Swap references
            audio.src = nextAudio.src;
            audio.volume = volumeRef.current; // Usa ref
            audio.currentTime = nextAudio.currentTime;
            audio.play().catch(e => console.error('Error playing audio:', e));
            
            nextAudio.pause();
            nextAudio.currentTime = 0;
            nextAudio.src = '';
          }
        }, fadeInterval);
        
        return () => {
          clearInterval(crossfadeTimer);
          // Cleanup on unmount
          if (audioUrl && audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
            audioUrlsRef.current.delete(currentBlock.id);
          }
        };
      } else {
        // No crossfade, just play normally
        const audioUrl = URL.createObjectURL(currentBlock.audioFile);
        
        // Cleanup old audio URL before setting new one
        const oldSrc = audio.src;
        if (oldSrc && oldSrc.startsWith('blob:')) {
          URL.revokeObjectURL(oldSrc);
        }
        
        // Store URL for cleanup
        audioUrlsRef.current.set(currentBlock.id, audioUrl);
        
        audio.src = audioUrl;
        audio.volume = volumeRef.current; // Usa ref para não reiniciar
        
        if (isPlaying) {
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
        
        // Set up event listener for when audio ends
        const handleEnded = () => {
          // Find next audio block
          const nextAudioIndex = blocks.findIndex((b, idx) => 
            idx > currentAudioIndex && b.type === 'audio'
          );
          if (nextAudioIndex !== -1) {
            setCurrentAudioIndex(nextAudioIndex);
          }
        };
        
        audio.addEventListener('ended', handleEnded);
        
        return () => {
          audio.removeEventListener('ended', handleEnded);
          // Cleanup audio URL
          if (audioUrl && audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
            audioUrlsRef.current.delete(currentBlock.id);
          }
        };
      }
    }
  }, [currentAudioIndex, blocks, isPlaying]); // Removido volume e crossfadeDuration para não reiniciar música

  // Separate effect to handle volume changes without restarting audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (nextAudioRef.current) {
      nextAudioRef.current.volume = volume;
    }
  }, [volume]);

  return {
    audioRef,
    nextAudioRef,
    currentAudioIndex,
    setCurrentAudioIndex,
  };
}
