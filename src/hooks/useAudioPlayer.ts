import { useState, useRef, useEffect } from 'react';
import { Block } from '../types';
import { useAudioAnalyzer } from './useAudioAnalyzer';

interface UseAudioPlayerProps {
  blocks: Block[];
  volume: number;
  crossfadeDuration: number;
  isPlaying: boolean;
  trimSilence: boolean;
  loop: boolean;
}

export function useAudioPlayer({ blocks, volume, crossfadeDuration, isPlaying, trimSilence, loop }: UseAudioPlayerProps) {
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(-1);
  const audioUrlsRef = useRef<Map<string, string>>(new Map());
  const { detectSilence } = useAudioAnalyzer();
  
  // Track which audio element is currently active (true = audio1, false = audio2)
  const [isAudio1Active, setIsAudio1Active] = useState<boolean>(true);
  const isAudio1ActiveRef = useRef<boolean>(true);
  
  // Cache de tempos de trim para cada arquivo de áudio
  const trimTimesRef = useRef<Map<string, { startTime: number; endTime: number }>>(new Map());
  
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

  useEffect(() => {
    isAudio1ActiveRef.current = isAudio1Active;
  }, [isAudio1Active]);

  // Effect to handle audio playback with crossfade and memory management
  useEffect(() => {
    if (currentAudioIndex === -1 || !blocks[currentAudioIndex]) return;

    const currentBlock = blocks[currentAudioIndex];
    
    if (currentBlock.type === 'audio' && currentBlock.audioFile && audio1Ref.current && audio2Ref.current) {
      // Get current and next audio elements based on which is active (use ref to avoid stale closure)
      const currentAudio = isAudio1ActiveRef.current ? audio1Ref.current : audio2Ref.current;
      const nextAudio = isAudio1ActiveRef.current ? audio2Ref.current : audio1Ref.current;
      
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
        
        // Detectar silêncio se ativado
        const setupAudioTrim = async (): Promise<void> => {
          if (trimSilence && currentBlock.audioFile && !trimTimesRef.current.has(currentBlock.id)) {
            try {
              console.log('🔍 Analisando silêncio para:', currentBlock.audioFile.name);
              const trimData = await detectSilence(currentBlock.audioFile);
              // Validar antes de cachear: endTime deve ser finito, positivo e maior que startTime.
              const valid =
                Number.isFinite(trimData.startTime) &&
                Number.isFinite(trimData.endTime) &&
                trimData.endTime > 0 &&
                trimData.endTime > trimData.startTime;
              if (valid) {
                trimTimesRef.current.set(currentBlock.id, {
                  startTime: trimData.startTime,
                  endTime: trimData.endTime,
                });
                console.log('✅ Trim salvo no cache:', currentBlock.id, trimData);
              } else {
                console.warn('⚠️ Trim inválido descartado, tocará sem trim:', currentBlock.id, trimData);
              }
            } catch (error) {
              console.error('❌ Erro ao detectar silêncio, tocará sem trim:', error);
            }
          } else if (trimSilence && trimTimesRef.current.has(currentBlock.id)) {
            console.log('💾 Usando trim do cache:', currentBlock.id, trimTimesRef.current.get(currentBlock.id));
          }
          // Sempre retornar Promise resolvida
          return Promise.resolve();
        };
        
        // Wait for audio to be fully loaded before starting crossfade
        const startCrossfade = async () => {
          // Restaurar volume do usuário antes do crossfade (pode ter sido reduzido pelo fade do loop)
          currentAudio.volume = volumeRef.current;
          
          // Aplicar trim se disponível
          if (trimSilence && trimTimesRef.current.has(currentBlock.id)) {
            const trimData = trimTimesRef.current.get(currentBlock.id)!;
            nextAudio.currentTime = trimData.startTime;
            console.log('✂️ Aplicando trim no crossfade - startTime:', trimData.startTime.toFixed(2) + 's');
          } else if (trimSilence) {
            console.warn('⚠️ Trim ativado mas dados não disponíveis no cache para:', currentBlock.id);
          }
          
          nextAudio.play().catch(e => console.error('Error playing next audio:', e));
          
          // Crossfade duration from ref (não reinicia a música quando muda)
          const fadeDuration = crossfadeDurationRef.current;
          const startTime = performance.now();
          let animationFrameId: number;
          
          const performCrossfade = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(Math.max(elapsed / fadeDuration, 0), 1);
            
            // Smooth fade curves
            // Fade out current audio (usa ref para não reiniciar)
            const fadeOutVolume = volumeRef.current * (1 - progress);
            currentAudio.volume = Math.max(0, Math.min(1, fadeOutVolume));
            
            // Fade in next audio (usa ref para não reiniciar)
            const fadeInVolume = volumeRef.current * progress;
            nextAudio.volume = Math.max(0, Math.min(1, fadeInVolume));
            
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
              delete currentAudio.dataset.originalVolume;

              // Switch active audio reference (functional update to avoid stale closure)
              setIsAudio1Active(prev => !prev);
              
              // O monitoramento de endTime será feito pelo useAudioTime
              
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
        
        // Wait for audio to be ready AND trim analysis to complete
        const handleCanPlayThrough = async () => {
          // Garantir que análise de silêncio terminou
          await setupAudioTrim();
          startCrossfade();
        };
        
        if (nextAudio.readyState >= 4) {
          // Already loaded - wait for trim analysis then start
          setupAudioTrim().then(() => {
            startCrossfade();
          });
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
        
        // Detectar silêncio se ativado
        const setupAudioTrim = async (): Promise<void> => {
          if (trimSilence && currentBlock.audioFile && !trimTimesRef.current.has(currentBlock.id)) {
            try {
              const trimData = await detectSilence(currentBlock.audioFile);
              trimTimesRef.current.set(currentBlock.id, {
                startTime: trimData.startTime,
                endTime: trimData.endTime,
              });
              // Aplicar trim imediatamente se já carregado
              if (currentAudio.readyState >= 3) {
                currentAudio.currentTime = trimData.startTime;
              }
            } catch (error) {
              console.error('Erro ao detectar silêncio:', error);
            }
          }
          // Sempre retornar Promise resolvida
          return Promise.resolve();
        };
        
        if (isPlaying) {
          // Wait for audio to be ready AND trim analysis before playing
          const playWhenReady = async () => {
            // Garantir que análise de silêncio terminou
            await setupAudioTrim();
            
            // Aplicar trim se disponível
            if (trimSilence && trimTimesRef.current.has(currentBlock.id)) {
              const trimData = trimTimesRef.current.get(currentBlock.id)!;
              currentAudio.currentTime = trimData.startTime;
              console.log('✂️ Aplicando trim no play - startTime:', trimData.startTime.toFixed(2) + 's');
            }
            
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
        } else {
          // Mesmo sem tocar, detectar silêncio para cache
          setupAudioTrim();
        }
        
        // O monitoramento de endTime será feito pelo useAudioTime
        let timeUpdateInterval: number | null = null;
        
        // Set up event listener for when audio ends
        const handleEnded = () => {
          // Se loop estiver ativado, não avançar para próximo áudio
          // (useAudioTime já controla o loop)
          if (loop) {
            console.log('🔁 Loop ativado - não avançando para próximo áudio');
            return;
          }
          
          // Find next audio block
          const nextAudioIndex = blocks.findIndex((b, idx) => 
            idx > currentAudioIndex && b.type === 'audio'
          );
          if (nextAudioIndex !== -1) {
            console.log('➡️ Avançando para próximo áudio');
            setCurrentAudioIndex(nextAudioIndex);
          } else {
            console.log('⏹️ Fim da lista de áudios');
          }
        };
        
        currentAudio.addEventListener('ended', handleEnded);
        
        return () => {
          currentAudio.removeEventListener('ended', handleEnded);
          if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
          }
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
    trimTimesRef,
    volumeRef,
  };
}
