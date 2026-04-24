import React from 'react';
import MobilePlayerBar from './components/MobilePlayerBar';
import ViewTab from '../src/components/ViewTab';
import { useTheme } from '../src/hooks/useTheme';
import ThemeToggle from '../src/components/ThemeToggle';
import { Block } from '../src/types';
import { AmbientId, AmbientLayerState, AMBIENT_LAYERS } from '../src/hooks/useAmbientSounds';
import { useRemoteClient } from './hooks/useRemoteClient';

// Default empty ambient state pra quando ainda não recebemos state do desktop
const EMPTY_AMBIENT: Record<AmbientId, AmbientLayerState> = AMBIENT_LAYERS.reduce(
  (acc, { id }) => {
    acc[id] = { fileName: null, isPlaying: false, volume: 0.6, playbackRate: 1 };
    return acc;
  },
  {} as Record<AmbientId, AmbientLayerState>
);

export default function MobileApp() {
  const { theme, toggleTheme } = useTheme();
  const { state, isConnected, sendCommand } = useRemoteClient();

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg mb-4">
          <i className={`fas ${isConnected ? 'fa-spinner fa-spin' : 'fa-wifi'} text-2xl ${
            isConnected ? 'text-sky-500' : 'text-gray-400'
          }`}></i>
        </div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {isConnected ? 'Conectando...' : 'Aguardando desktop'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isConnected
            ? 'Sincronizando estado...'
            : 'Certifique-se de que o app desktop está aberto e na mesma rede WiFi.'}
        </p>
      </div>
    );
  }

  // Montar blocks compatíveis com ViewTab (Block com hasAudioLoaded pra botão de tocar)
  const blocks: Block[] = state.blocks.map(b => ({
    id: b.id,
    type: b.type,
    content: b.content,
    audioFile: null,
    audioFileName: b.audioFileName,
    audioFilePath: null,
    duration: b.duration,
    scriptId: b.scriptId,
    scriptName: b.scriptName,
    hasAudioLoaded: b.hasAudioLoaded,
  }));

  // Handlers viram dispatchers de comando via WS
  const playPause = () => sendCommand({ action: 'playPause' });
  const stop = () => sendCommand({ action: 'stop' });
  const playBlockAudio = (index: number) => sendCommand({ action: 'playBlock', blockIndex: index });
  const seek = (time: number) => sendCommand({ action: 'seek', time });
  const setVolume = (volume: number) => sendCommand({ action: 'setVolume', volume });
  const toggleLoop = () => sendCommand({ action: 'setLoop', value: !state.loop });
  const setCrossfade = (duration: number) => sendCommand({ action: 'setCrossfade', duration });
  const toggleTrim = () => sendCommand({ action: 'setTrimSilence', value: !state.trimSilence });
  const incFont = () => sendCommand({ action: 'increaseFontSize' });
  const decFont = () => sendCommand({ action: 'decreaseFontSize' });
  const resetFont = () => sendCommand({ action: 'resetFontSize' });

  const ambientToggle = (id: AmbientId) => sendCommand({ action: 'ambient.togglePlay', id });
  const ambientVolume = (id: AmbientId, volume: number) => sendCommand({ action: 'ambient.setVolume', id, volume });
  const ambientRate = (id: AmbientId, rate: number) => sendCommand({ action: 'ambient.setRate', id, rate });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-72 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Header compacto */}
        <header className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                Controle Remoto
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {isConnected ? 'conectado ao desktop' : 'desconectado — tentando reconectar'}
              </p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* ViewTab com dados do desktop */}
        <ViewTab
          blocks={blocks}
          currentBlockIndex={state.currentBlockIndex}
          currentAudioIndex={state.currentAudioIndex}
          isPlaying={state.isPlaying}
          fontSize={state.fontSize}
          loadedScripts={state.loadedScripts}
          onPlayBlockAudio={playBlockAudio}
        />
      </div>

      {/* Barra mobile — layout vertical, touch-friendly */}
      <MobilePlayerBar
        isPlaying={state.isPlaying}
        currentTime={state.currentTime}
        duration={state.duration}
        volume={state.volume}
        loop={state.loop}
        crossfadeDuration={state.crossfadeDuration}
        trimSilence={state.trimSilence}
        fontSize={state.fontSize}
        nowPlayingLabel={state.nowPlayingLabel}
        nowPlayingType={state.nowPlayingType}
        onPlayPause={playPause}
        onStop={stop}
        onSeek={seek}
        onVolumeChange={setVolume}
        onLoopToggle={toggleLoop}
        onCrossfadeDurationChange={setCrossfade}
        onTrimSilenceToggle={toggleTrim}
        onIncreaseFontSize={incFont}
        onDecreaseFontSize={decFont}
        onResetFontSize={resetFont}
        ambientLayers={state.ambientLayers || EMPTY_AMBIENT}
        onAmbientTogglePlay={ambientToggle}
        onAmbientSetVolume={ambientVolume}
        onAmbientSetPlaybackRate={ambientRate}
      />
    </div>
  );
}
