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
  volumeRef: React.RefObject<number>;
}

export function useAudioTime({
  audioRef,
  nextAudioRef,
  isAudio1Active,
  trimSilence = false,
  trimTimes,
  currentBlockId,
  loop,
  volumeRef,
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

    // Retorna trimData válido para o bloco atual, ou null se não houver/for inválido.
    const getValidTrimData = (): { startTime: number; endTime: number } | null => {
      if (!trimSilence || !trimTimes || !currentBlockId) return null;
      const data = trimTimes.get(currentBlockId);
      if (!data) return null;
      if (
        !Number.isFinite(data.startTime) ||
        !Number.isFinite(data.endTime) ||
        data.endTime <= 0 ||
        data.endTime <= data.startTime
      ) {
        return null;
      }
      return data;
    };

    // Fade-in reutilizável: zera volume, depois sobe até volumeRef.current em LOOP_FADE_DURATION ms.
    const startFadeIn = () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
      activeAudio.volume = 0;
      const startTs = performance.now();

      const performFadeIn = (now: number) => {
        const elapsed = now - startTs;
        const progress = Math.min(Math.max(elapsed / LOOP_FADE_DURATION, 0), 1);

        const fadeInVolume = volumeRef.current * progress;
        activeAudio.volume = Math.max(0, Math.min(1, fadeInVolume));

        if (progress < 1 && !activeAudio.paused) {
          fadeAnimationRef.current = requestAnimationFrame(performFadeIn);
        } else {
          activeAudio.volume = Math.max(0, Math.min(1, volumeRef.current));
          fadeAnimationRef.current = null;
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(performFadeIn);
    };

    // Volta ao início do trim e inicia fade-in + play (usado tanto pelo timeupdate quanto pelo ended).
    const loopBackToTrimStart = (trimData: { startTime: number; endTime: number }) => {
      activeAudio.currentTime = trimData.startTime;
      console.log('🔁 Loop com fade - voltando para:', trimData.startTime.toFixed(2) + 's');
      startFadeIn();
      // Se o áudio pausou (ex.: via evento `ended`), retomar reprodução.
      if (activeAudio.paused) {
        activeAudio.play().catch(e => console.error('Error resuming trim loop:', e));
      }
    };

    const updateTime = () => {
      setCurrentTime(activeAudio.currentTime);

      // Monitorar endTime se trim estiver ativado e dados forem válidos
      const trimData = getValidTrimData();
      if (trimData) {
        const fadeStartTime = trimData.endTime - (LOOP_FADE_DURATION / 1000); // Iniciar fade antes do fim

        // Iniciar fade-out quando chegar perto do endTime
        if (activeAudio.currentTime >= fadeStartTime && activeAudio.currentTime < trimData.endTime && !activeAudio.paused) {
          const fadeProgress = Math.min(Math.max((activeAudio.currentTime - fadeStartTime) / (LOOP_FADE_DURATION / 1000), 0), 1);
          const targetVolume = volumeRef.current;

          // Aplicar fade-out com proteção de range [0, 1]
          const fadeOutVolume = targetVolume * (1 - fadeProgress);
          activeAudio.volume = Math.max(0, Math.min(1, fadeOutVolume));
        }

        // Fazer loop quando chegar ao endTime.
        // Tolerância maior (0.15s) para absorver a granularidade do `timeupdate` (~250ms).
        // O evento `ended` também serve de backup caso este tick não dispare a tempo.
        if (activeAudio.currentTime >= trimData.endTime - 0.15 && !activeAudio.paused) {
          console.log('⏱️ Chegou ao endTime em:', activeAudio.currentTime.toFixed(2) + 's');
          const targetVolume = volumeRef.current;

          if (loop) {
            loopBackToTrimStart(trimData);
          } else {
            // Sem loop: pausar e restaurar volume do usuário
            activeAudio.pause();
            activeAudio.volume = Math.max(0, Math.min(1, targetVolume));
            console.log('⏸️ Pausado (sem loop)');
          }
        }
      }
    };

    const updateDuration = () => {
      setDuration(activeAudio.duration || 0);
    };

    const handleEnded = () => {
      const trimData = getValidTrimData();

      if (trimData) {
        // Backup: se o `timeupdate` não conseguiu disparar o loop antes do fim do áudio
        // (comum quando endTime ≈ duration), tratar `ended` como gatilho do loop trimado.
        if (loop) {
          console.log('🔚 Evento ended em modo trim — forçando loop');
          loopBackToTrimStart(trimData);
        }
        return;
      }

      // Sem trim: comportamento padrão de loop manual (loop nativo está desabilitado apenas em modo trim).
      if (!trimSilence && loop) {
        activeAudio.currentTime = 0;
        activeAudio.play().catch(e => console.error('Error looping audio:', e));
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
  // Quando trimSilence está ativo, o loop customizado controla no endTime do trim,
  // então o loop nativo deve ser desabilitado para evitar conflito.
  useEffect(() => {
    if (!audioRef.current || !nextAudioRef.current) return;

    const activeAudio = isAudio1Active ? audioRef.current : nextAudioRef.current;
    activeAudio.loop = loop && !trimSilence;
  }, [audioRef, nextAudioRef, isAudio1Active, loop, trimSilence]);

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
