import { useCallback, useEffect, useRef, useState } from 'react';

export type AmbientId = 'breathing' | 'heartbeat';

export interface AmbientLayerState {
  fileName: string | null;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
}

export interface AmbientLayerConfig {
  id: AmbientId;
  label: string;
  icon: string; // font-awesome icon class (e.g. 'fa-lungs')
  accentColor: string; // tailwind hue fragment (e.g. 'sky', 'rose')
}

export const AMBIENT_LAYERS: AmbientLayerConfig[] = [
  { id: 'breathing', label: 'Respiração', icon: 'fa-lungs', accentColor: 'sky' },
  { id: 'heartbeat', label: 'Batimento', icon: 'fa-heart-pulse', accentColor: 'rose' },
];

export const PLAYBACK_RATE_PRESETS = [1, 1.5, 2, 3, 4, 5] as const;

const DEFAULT_STATE: AmbientLayerState = {
  fileName: null,
  isPlaying: false,
  volume: 0.6,
  playbackRate: 1,
};

/**
 * Gerencia 2 players de áudio ambiente independentes (respiração + batimento).
 * Cada camada tem arquivo, play/pause, volume e velocidade próprios.
 * Os áudios ficam carregados em memória durante a sessão.
 */
export function useAmbientSounds() {
  // Estado reativo por camada
  const [layers, setLayers] = useState<Record<AmbientId, AmbientLayerState>>({
    breathing: { ...DEFAULT_STATE },
    heartbeat: { ...DEFAULT_STATE },
  });

  // Um HTMLAudioElement por camada (não renderizado no DOM — apenas para playback)
  const audioRefs = useRef<Record<AmbientId, HTMLAudioElement | null>>({
    breathing: null,
    heartbeat: null,
  });

  // URL do blob atualmente em uso por camada (para revoke)
  const blobUrlsRef = useRef<Record<AmbientId, string | null>>({
    breathing: null,
    heartbeat: null,
  });

  // Instanciar elementos ao montar; limpar ao desmontar.
  useEffect(() => {
    AMBIENT_LAYERS.forEach(({ id }) => {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audioRefs.current[id] = audio;
    });

    return () => {
      AMBIENT_LAYERS.forEach(({ id }) => {
        const audio = audioRefs.current[id];
        if (audio) {
          audio.pause();
          audio.src = '';
        }
        const url = blobUrlsRef.current[id];
        if (url) URL.revokeObjectURL(url);
        audioRefs.current[id] = null;
        blobUrlsRef.current[id] = null;
      });
    };
  }, []);

  // Sincronizar volume/velocidade/play nos elementos quando o estado muda
  useEffect(() => {
    AMBIENT_LAYERS.forEach(({ id }) => {
      const audio = audioRefs.current[id];
      if (!audio) return;
      const state = layers[id];
      audio.volume = Math.max(0, Math.min(1, state.volume));
      audio.playbackRate = state.playbackRate;
    });
  }, [layers]);

  const loadFile = useCallback((id: AmbientId, file: File) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    // Revogar URL anterior, se houver
    const previousUrl = blobUrlsRef.current[id];
    if (previousUrl) URL.revokeObjectURL(previousUrl);

    const url = URL.createObjectURL(file);
    blobUrlsRef.current[id] = url;

    audio.pause();
    audio.src = url;
    audio.currentTime = 0;
    audio.load();

    setLayers(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        fileName: file.name,
        isPlaying: false,
      },
    }));
  }, []);

  const clearFile = useCallback((id: AmbientId) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    const url = blobUrlsRef.current[id];
    if (url) URL.revokeObjectURL(url);
    blobUrlsRef.current[id] = null;

    setLayers(prev => ({
      ...prev,
      [id]: { ...DEFAULT_STATE },
    }));
  }, []);

  const togglePlay = useCallback((id: AmbientId) => {
    const audio = audioRefs.current[id];
    if (!audio) return;

    setLayers(prev => {
      const current = prev[id];
      if (!current.fileName) return prev; // sem arquivo, sem ação

      if (current.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(e => console.error(`Error playing ambient ${id}:`, e));
      }

      return {
        ...prev,
        [id]: { ...current, isPlaying: !current.isPlaying },
      };
    });
  }, []);

  const stopAll = useCallback(() => {
    AMBIENT_LAYERS.forEach(({ id }) => {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setLayers(prev => ({
      breathing: { ...prev.breathing, isPlaying: false },
      heartbeat: { ...prev.heartbeat, isPlaying: false },
    }));
  }, []);

  const setVolume = useCallback((id: AmbientId, volume: number) => {
    setLayers(prev => ({
      ...prev,
      [id]: { ...prev[id], volume: Math.max(0, Math.min(1, volume)) },
    }));
  }, []);

  const setPlaybackRate = useCallback((id: AmbientId, rate: number) => {
    setLayers(prev => ({
      ...prev,
      [id]: { ...prev[id], playbackRate: rate },
    }));
  }, []);

  return {
    layers,
    loadFile,
    clearFile,
    togglePlay,
    stopAll,
    setVolume,
    setPlaybackRate,
  };
}
