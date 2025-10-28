import { useState, useRef, useEffect } from 'react';
import { Block } from '../types';

interface UseAudioPlayerProps {
  blocks: Block[];
  volume: number;
  crossfadeDuration: number;
  isPlaying: boolean;
}

export function useAudioPlayer({ blocks, volume, crossfadeDuration, isPlaying }: UseAudioPlayerProps) {
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(-1);
  const audioUrlsRef = useRef<Map<string, string>>(new Map());
  
  // Track which audio element is currently active (true = audio1, false = audio2)
  const [isAudio1Active, setIsAudio1Active] = useState<boolean>(true);
  
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
    
    if (currentBlock.type === 'audio' && currentBlock.audioFile && audio1Ref.current && audio2Ref.current) {
      // Get current and next audio elements based on which is active
      const currentAudio = isAudio1Active ? audio1Ref.current : audio2Ref.current;
      const nextAudio = isAudio1Active ? audio2Ref.current : audio1Ref.current;
      
      // Check if there's currently playing audio (for crossfade)
      const shouldCrossfade = !currentAudio.paused && currentAudio.src;
      
      if (shouldCrossfade) {
        // Crossfade implementation with preload
        const audioUrl = URL.createObjectURL(currentBlock.audioFile);
        
        // Store URL for cleanup
        audioUrlsRef.current.set(currentBlock.id, audioUrl);
        
        nextAudio.src = audioUrl;
        nextAudio.volume = 0;
        nextAudio.preload = 'auto'; // Force preload
        
        // Wait for audio to be fully loaded before starting crossfade
        const startCrossfade = () => {
          nextAudio.play().catch(e => console.error('Error playing next audio:', e));
          
          // Crossfade duration from ref (não reinicia a música quando muda)
          const fadeDuration = crossfadeDurationRef.current;
          const startTime = performance.now();
          let animationFrameId: number;
          
          const performCrossfade = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / fadeDuration, 1);
            
            // Smooth fade curves
            // Fade out current audio (usa ref para não reiniciar)
            currentAudio.volume = Math.max(0, volumeRef.current * (1 - progress));
            // Fade in next audio (usa ref para não reiniciar)
            nextAudio.volume = Math.min(volumeRef.current, volumeRef.current * progress);
            
            if (progress < 1) {
              animationFrameId = requestAnimationFrame(performCrossfade);
            } else {
              // Crossfade complete - just cleanup old audio
              // Cleanup old audio URL
              const oldSrc = currentAudio.src;
              if (oldSrc && oldSrc.startsWith('blob:')) {
                URL.revokeObjectURL(oldSrc);
              }
              
              currentAudio.pause();
              currentAudio.currentTime = 0;
              currentAudio.src = '';
              currentAudio.volume = 0;
              
              // Switch active audio reference
              setIsAudio1Active(!isAudio1Active);
              
              // nextAudio continues playing - no interruption!
            }
          };
          
          animationFrameId = requestAnimationFrame(performCrossfade);
          
          return () => {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
            }
          };
        };
        
        // Wait for audio to be ready
        const handleCanPlayThrough = () => {
          startCrossfade();
        };
        
        if (nextAudio.readyState >= 4) {
          // Already loaded
          startCrossfade();
        } else {
          nextAudio.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
        }
        
        return () => {
          nextAudio.removeEventListener('canplaythrough', handleCanPlayThrough);
          // Cleanup on unmount
          if (audioUrl && audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioUrl);
            audioUrlsRef.current.delete(currentBlock.id);
          }
        };
      } else {
        // No crossfade, just play normally on current active audio
        const audioUrl = URL.createObjectURL(currentBlock.audioFile);
        
        // Cleanup old audio URL before setting new one
        const oldSrc = currentAudio.src;
        if (oldSrc && oldSrc.startsWith('blob:')) {
          URL.revokeObjectURL(oldSrc);
        }
        
        // Store URL for cleanup
        audioUrlsRef.current.set(currentBlock.id, audioUrl);
        
        currentAudio.src = audioUrl;
        currentAudio.volume = volumeRef.current; // Usa ref para não reiniciar
        currentAudio.preload = 'auto'; // Force preload
        
        if (isPlaying) {
          // Wait for audio to be ready before playing
          const playWhenReady = () => {
            currentAudio.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          };
          
          if (currentAudio.readyState >= 3) {
            // Already loaded enough to play
            playWhenReady();
          } else {
            currentAudio.addEventListener('canplay', playWhenReady, { once: true });
          }
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
        
        currentAudio.addEventListener('ended', handleEnded);
        
        return () => {
          currentAudio.removeEventListener('ended', handleEnded);
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
    // Update volume on the currently active audio
    const currentAudio = isAudio1Active ? audio1Ref.current : audio2Ref.current;
    if (currentAudio && !currentAudio.paused) {
      currentAudio.volume = volume;
    }
  }, [volume, isAudio1Active]);

  return {
    audioRef: audio1Ref,
    nextAudioRef: audio2Ref,
    currentAudioIndex,
    setCurrentAudioIndex,
    isAudio1Active,
  };
}
