// Contrato de dados que trafega entre desktop e celular via WebSocket.
// Tudo aqui precisa ser JSON-serializável (sem File, sem refs).

import { LoadedScript } from '../types';
import { AmbientId, AmbientLayerState } from '../hooks/useAmbientSounds';

export interface RemoteBlock {
  id: string;
  type: 'text' | 'audio';
  content: string | null;
  audioFileName: string | null;
  hasAudioLoaded: boolean; // true se o desktop tem o File carregado e pode tocar
  duration?: number;
  scriptId?: string;
  scriptName?: string;
}

export interface RemoteState {
  blocks: RemoteBlock[];
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
}

export type RemoteCommand =
  | { action: 'playPause' }
  | { action: 'stop' }
  | { action: 'playBlock'; blockIndex: number }
  | { action: 'seek'; time: number }
  | { action: 'setVolume'; volume: number }
  | { action: 'setLoop'; value: boolean }
  | { action: 'setCrossfade'; duration: number }
  | { action: 'setTrimSilence'; value: boolean }
  | { action: 'increaseFontSize' }
  | { action: 'decreaseFontSize' }
  | { action: 'resetFontSize' }
  | { action: 'ambient.togglePlay'; id: AmbientId }
  | { action: 'ambient.setVolume'; id: AmbientId; volume: number }
  | { action: 'ambient.setRate'; id: AmbientId; rate: number };

export interface RemoteMessage {
  type: 'state' | 'command' | 'welcome' | 'ping';
  payload?: RemoteState | RemoteCommand | any;
}

export interface RemoteInfo {
  url: string;
  port: number;
  clientCount: number;
}
