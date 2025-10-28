import { useState, useEffect } from 'react';

interface UseAudioTimeProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  nextAudioRef: React.RefObject<HTMLAudioElement | null>;
  isAudio1Active: boolean;
  isPlaying: boolean;
}

export function useAudioTime({ audioRef, nextAudioRef, isAudio1Active }: UseAudioTimeProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loop, setLoop] = useState<boolean>(true); // Loop ativado por padrão

  // Atualizar tempo atual - ouvir ambos os elementos de áudio
  useEffect(() => {
    if (!audioRef.current || !nextAudioRef.current) return;

    const audio1 = audioRef.current;
    const audio2 = nextAudioRef.current;
    
    // Determinar qual áudio está ativo
    const activeAudio = isAudio1Active ? audio1 : audio2;

    const updateTime = () => {
      setCurrentTime(activeAudio.currentTime);
    };

    const updateDuration = () => {
      setDuration(activeAudio.duration || 0);
    };

    const handleEnded = () => {
      if (loop) {
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
    };
  }, [audioRef, nextAudioRef, isAudio1Active, loop]);

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

  const toggleLoop = () => {
    setLoop(!loop);
  };

  return {
    currentTime,
    duration,
    loop,
    seek,
    toggleLoop,
  };
}
