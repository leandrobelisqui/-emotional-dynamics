import { useEffect, useMemo, useRef, useState } from 'react';
import { Block, LoadedScript } from '../types';
import { AmbientId, AmbientLayerState } from './useAmbientSounds';
import { RemoteBlock, RemoteCommand, RemoteInfo, RemoteState } from '../remote/types';

interface ElectronRemoteAPI {
  getInfo: () => Promise<RemoteInfo>;
  broadcastState: (state: RemoteState) => Promise<boolean>;
  onCommand: (cb: (cmd: RemoteCommand) => void) => () => void;
}

declare global {
  interface Window {
    electron?: {
      remote?: ElectronRemoteAPI;
      [key: string]: any;
    };
  }
}

interface UseRemoteSyncParams {
  // Read-only state to mirror
  blocks: Block[];
  loadedScripts: LoadedScript[];
  currentBlockIndex: number;
  currentAudioIndex: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
  crossfadeDuration: number;
  trimSilence: boolean;
  fontSize: number;
  nowPlayingLabel: string;
  nowPlayingType: 'audio' | 'text' | null;
  ambientLayers: Record<AmbientId, AmbientLayerState>;

  // Handlers invoked when remote commands arrive
  onPlayPause: () => void;
  onStop: () => void;
  onPlayBlockAudio: (index: number) => void;
  onSeek: (time: number) => void;
  onSetVolume: (volume: number) => void;
  onSetLoop: (value: boolean) => void;
  onSetCrossfade: (duration: number) => void;
  onSetTrimSilence: (value: boolean) => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
  onAmbientTogglePlay: (id: AmbientId) => void;
  onAmbientSetVolume: (id: AmbientId, volume: number) => void;
  onAmbientSetPlaybackRate: (id: AmbientId, rate: number) => void;
}

/**
 * Espelha o estado da aplicação para o servidor remoto e dispacha comandos
 * recebidos de clientes (celular) nos handlers locais.
 *
 * Broadcast é debounced em 200ms para não inundar clientes com updates
 * de currentTime a 60Hz.
 */
export function useRemoteSync(params: UseRemoteSyncParams) {
  const [remoteInfo, setRemoteInfo] = useState<RemoteInfo>({ url: null as any, port: 9000, clientCount: 0 });
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Construir RemoteState (memoized em mudanças de state relevante)
  const remoteState: RemoteState = useMemo(() => {
    const remoteBlocks: RemoteBlock[] = params.blocks.map(b => ({
      id: b.id,
      type: b.type,
      content: b.content,
      audioFileName: b.audioFileName || (b.audioFile?.name ?? null),
      hasAudioLoaded: !!b.audioFile,
      duration: b.duration,
      scriptId: b.scriptId,
      scriptName: b.scriptName,
    }));

    return {
      blocks: remoteBlocks,
      loadedScripts: params.loadedScripts,
      currentBlockIndex: params.currentBlockIndex,
      currentAudioIndex: params.currentAudioIndex,
      currentTime: params.currentTime,
      duration: params.duration,
      isPlaying: params.isPlaying,
      volume: params.volume,
      loop: params.loop,
      crossfadeDuration: params.crossfadeDuration,
      trimSilence: params.trimSilence,
      fontSize: params.fontSize,
      nowPlayingLabel: params.nowPlayingLabel,
      nowPlayingType: params.nowPlayingType,
      ambientLayers: params.ambientLayers,
    };
  }, [
    params.blocks,
    params.loadedScripts,
    params.currentBlockIndex,
    params.currentAudioIndex,
    params.currentTime,
    params.duration,
    params.isPlaying,
    params.volume,
    params.loop,
    params.crossfadeDuration,
    params.trimSilence,
    params.fontSize,
    params.nowPlayingLabel,
    params.nowPlayingType,
    params.ambientLayers,
  ]);

  // Broadcast debounced
  useEffect(() => {
    const api = window.electron?.remote;
    if (!api) return;

    const timeout = setTimeout(() => {
      api.broadcastState(remoteState).catch(() => {});
    }, 200);

    return () => clearTimeout(timeout);
  }, [remoteState]);

  // Registrar listener de comandos (uma vez)
  useEffect(() => {
    const api = window.electron?.remote;
    if (!api) return;

    const dispatch = (cmd: RemoteCommand) => {
      const p = paramsRef.current;
      switch (cmd.action) {
        case 'playPause': return p.onPlayPause();
        case 'stop': return p.onStop();
        case 'playBlock': return p.onPlayBlockAudio(cmd.blockIndex);
        case 'seek': return p.onSeek(cmd.time);
        case 'setVolume': return p.onSetVolume(cmd.volume);
        case 'setLoop': return p.onSetLoop(cmd.value);
        case 'setCrossfade': return p.onSetCrossfade(cmd.duration);
        case 'setTrimSilence': return p.onSetTrimSilence(cmd.value);
        case 'increaseFontSize': return p.onIncreaseFontSize();
        case 'decreaseFontSize': return p.onDecreaseFontSize();
        case 'resetFontSize': return p.onResetFontSize();
        case 'ambient.togglePlay': return p.onAmbientTogglePlay(cmd.id);
        case 'ambient.setVolume': return p.onAmbientSetVolume(cmd.id, cmd.volume);
        case 'ambient.setRate': return p.onAmbientSetPlaybackRate(cmd.id, cmd.rate);
      }
    };

    const unsubscribe = api.onCommand(dispatch);
    return unsubscribe;
  }, []);

  // Poll info (URL + client count) periodicamente
  useEffect(() => {
    const api = window.electron?.remote;
    if (!api) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const info = await api.getInfo();
        if (!cancelled) setRemoteInfo(info);
      } catch {}
    };
    tick();
    const interval = setInterval(tick, 2000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return remoteInfo;
}
