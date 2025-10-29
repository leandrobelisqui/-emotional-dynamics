import { useState, useEffect, useRef } from 'react';

interface UseAudioTimeProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  nextAudioRef: React.RefObject<HTMLAudioElement | null>;
  isAudio1Active: boolean;
  isPlaying: boolean;
  trimSilence?: boolean;
  trimTimes?: Map<string, { startTime: number; endTime: number }>;
  currentBlockId?: string;
  loop: boolean;
}

export function useAudioTime({ 
  audioRef, 
  nextAudioRef, 
  isAudio1Active, 
  trimSilence = false,
  trimTimes,
  currentBlockId,
  loop 
}: UseAudioTimeProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const fadeAnimationRef = useRef<number | null>(null);
  
  // Duração do fade no loop (em ms)
  const LOOP_FADE_DURATION = 500; // 500ms = 0.5s

  // Atualizar tempo atual - ouvir ambos os elementos de áudio
  useEffect(() => {
    if (!audioRef.current || !nextAudioRef.current) return;

    const audio1 = audioRef.current;
    const audio2 = nextAudioRef.current;
    
    // Determinar qual áudio está ativo
    const activeAudio = isAudio1Active ? audio1 : audio2;

    const updateTime = () => {
      setCurrentTime(activeAudio.currentTime);
      
      // Monitorar endTime se trim estiver ativado
      if (trimSilence && trimTimes && currentBlockId && trimTimes.has(currentBlockId)) {
        const trimData = trimTimes.get(currentBlockId)!;
        const fadeStartTime = trimData.endTime - (LOOP_FADE_DURATION / 1000); // Iniciar fade antes do fim
        
        // Iniciar fade-out quando chegar perto do endTime
        if (activeAudio.currentTime >= fadeStartTime && activeAudio.currentTime < trimData.endTime && !activeAudio.paused) {
          const fadeProgress = (activeAudio.currentTime - fadeStartTime) / (LOOP_FADE_DURATION / 1000);
          const originalVolume = activeAudio.dataset.originalVolume ? parseFloat(activeAudio.dataset.originalVolume) : activeAudio.volume;
          
          // Aplicar fade-out
          activeAudio.volume = originalVolume * (1 - fadeProgress);
        }
        
        // Fazer loop quando chegar ao endTime
        if (activeAudio.currentTime >= trimData.endTime - 0.05 && !activeAudio.paused) {
          console.log('⏱️ Chegou ao endTime em:', activeAudio.currentTime.toFixed(2) + 's');
          
          if (loop) {
            // Salvar volume original se ainda não foi salvo
            if (!activeAudio.dataset.originalVolume) {
              activeAudio.dataset.originalVolume = activeAudio.volume.toString();
            }
            const originalVolume = parseFloat(activeAudio.dataset.originalVolume);
            
            // Loop: voltar para startTime e fazer fade-in
            activeAudio.currentTime = trimData.startTime;
            activeAudio.volume = 0; // Começar do zero
            console.log('🔁 Loop com fade - voltando para:', trimData.startTime.toFixed(2) + 's');
            
            // Cancelar fade anterior se existir
            if (fadeAnimationRef.current) {
              cancelAnimationFrame(fadeAnimationRef.current);
            }
            
            // Fade-in usando requestAnimationFrame
            const startTime = performance.now();
            
            const performFadeIn = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / LOOP_FADE_DURATION, 1);
              
              activeAudio.volume = originalVolume * progress;
              
              if (progress < 1 && !activeAudio.paused) {
                fadeAnimationRef.current = requestAnimationFrame(performFadeIn);
              } else {
                activeAudio.volume = originalVolume; // Garantir volume final
                fadeAnimationRef.current = null;
              }
            };
            
            fadeAnimationRef.current = requestAnimationFrame(performFadeIn);
          } else {
            // Sem loop: pausar
            activeAudio.pause();
            console.log('⏸️ Pausado (sem loop)');
            
            // Restaurar volume original
            if (activeAudio.dataset.originalVolume) {
              activeAudio.volume = parseFloat(activeAudio.dataset.originalVolume);
            }
          }
        }
      }
    };

    const updateDuration = () => {
      setDuration(activeAudio.duration || 0);
    };

    const handleEnded = () => {
      // Só processar ended se não estiver usando trim
      // (trim já controla via timeupdate)
      if (!trimSilence) {
        if (loop) {
          activeAudio.currentTime = 0;
          activeAudio.play().catch(e => console.error('Error looping audio:', e));
        }
      }
    };

    // Event listeners no áudio ativo
    activeAudio.addEventListener('timeupdate', updateTime);
    activeAudio.addEventListener('loadedmetadata', updateDuration);
    activeAudio.addEventListener('durationchange', updateDuration);
    activeAudio.addEventListener('ended', handleEnded);

    // Atualizar duração inicial se já estiver carregada
    if (activeAudio.duration) {
      setDuration(activeAudio.duration);
    }

    return () => {
      activeAudio.removeEventListener('timeupdate', updateTime);
      activeAudio.removeEventListener('loadedmetadata', updateDuration);
      activeAudio.removeEventListener('durationchange', updateDuration);
      activeAudio.removeEventListener('ended', handleEnded);
      
      // Cancelar animação de fade se existir
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        fadeAnimationRef.current = null;
      }
    };
  }, [audioRef, nextAudioRef, isAudio1Active, loop, trimSilence, trimTimes, currentBlockId]);

  // Atualizar loop no elemento de áudio ativo
  useEffect(() => {
    if (!audioRef.current || !nextAudioRef.current) return;
    
    const activeAudio = isAudio1Active ? audioRef.current : nextAudioRef.current;
    activeAudio.loop = loop;
  }, [audioRef, nextAudioRef, isAudio1Active, loop]);

  const seek = (time: number) => {
    if (!audioRef.current || !nextAudioRef.current) return;
    
    const activeAudio = isAudio1Active ? audioRef.current : nextAudioRef.current;
    activeAudio.currentTime = time;
    setCurrentTime(time);
  };

  return {
    currentTime,
    duration,
    seek,
  };
}
