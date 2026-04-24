import React, { useRef } from 'react';
import {
  AmbientId,
  AmbientLayerState,
  AMBIENT_LAYERS,
  PLAYBACK_RATE_PRESETS,
} from '../hooks/useAmbientSounds';

interface AmbientSoundsPanelProps {
  layers: Record<AmbientId, AmbientLayerState>;
  onLoadFile: (id: AmbientId, file: File) => void;
  onClearFile: (id: AmbientId) => void;
  onTogglePlay: (id: AmbientId) => void;
  onSetVolume: (id: AmbientId, volume: number) => void;
  onSetPlaybackRate: (id: AmbientId, rate: number) => void;
  /** Quando true, esconde controles de upload/remover (modo remoto/mobile). */
  readOnlyFiles?: boolean;
}

const accentClasses: Record<string, {
  solidBg: string;
  solidHover: string;
  lightBg: string;
  lightBgDark: string;
  text: string;
  textDark: string;
  border: string;
  borderDark: string;
  sliderColor: string;
}> = {
  sky: {
    solidBg: 'bg-sky-500',
    solidHover: 'hover:bg-sky-400',
    lightBg: 'bg-sky-50',
    lightBgDark: 'dark:bg-sky-900/30',
    text: 'text-sky-600',
    textDark: 'dark:text-sky-400',
    border: 'border-sky-200',
    borderDark: 'dark:border-sky-800',
    sliderColor: '#0ea5e9',
  },
  rose: {
    solidBg: 'bg-rose-500',
    solidHover: 'hover:bg-rose-400',
    lightBg: 'bg-rose-50',
    lightBgDark: 'dark:bg-rose-900/30',
    text: 'text-rose-600',
    textDark: 'dark:text-rose-400',
    border: 'border-rose-200',
    borderDark: 'dark:border-rose-800',
    sliderColor: '#f43f5e',
  },
};

const AmbientSoundsPanel: React.FC<AmbientSoundsPanelProps> = ({
  layers,
  onLoadFile,
  onClearFile,
  onTogglePlay,
  onSetVolume,
  onSetPlaybackRate,
  readOnlyFiles = false,
}) => {
  const fileInputRefs = useRef<Record<AmbientId, HTMLInputElement | null>>({
    breathing: null,
    heartbeat: null,
  });

  const handleFileChange = (id: AmbientId, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onLoadFile(id, file);
    e.target.value = '';
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30">
      <div className="flex items-center gap-2 mb-2">
        <i className="fas fa-wave-square text-[11px] text-gray-400 dark:text-gray-500"></i>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Sons ambientes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AMBIENT_LAYERS.map(({ id, label, icon, accentColor }) => {
          const state = layers[id];
          const accent = accentClasses[accentColor];
          const hasFile = !!state.fileName;

          return (
            <div
              key={id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                hasFile
                  ? `${accent.lightBg} ${accent.lightBgDark} ${accent.border} ${accent.borderDark}`
                  : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
              } transition-colors`}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                  hasFile ? `${accent.solidBg} text-white` : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                } ${state.isPlaying ? 'animate-pulse' : ''}`}
              >
                <i className={`fas ${icon} text-xs`}></i>
              </div>

              {/* Label + filename */}
              <div className="min-w-0 w-24 flex-shrink-0">
                <p className={`text-xs font-semibold ${accent.text} ${accent.textDark}`}>
                  {label}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate" title={state.fileName || ''}>
                  {state.fileName || 'nenhum arquivo'}
                </p>
              </div>

              {/* Play/pause */}
              <button
                onClick={() => onTogglePlay(id)}
                disabled={!hasFile}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  hasFile
                    ? `${accent.solidBg} ${accent.solidHover} text-white shadow-md hover:scale-105 active:scale-95`
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                title={state.isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                <i className={`fas ${state.isPlaying ? 'fa-pause' : 'fa-play'} text-[11px] ${state.isPlaying ? '' : 'ml-0.5'}`}></i>
              </button>

              {/* Volume slider */}
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <i className="fas fa-volume-down text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0"></i>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.volume}
                  onChange={(e) => onSetVolume(id, parseFloat(e.target.value))}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer slider min-w-[60px]"
                  style={{
                    background: `linear-gradient(to right, ${accent.sliderColor} 0%, ${accent.sliderColor} ${state.volume * 100}%, var(--slider-track, #e5e7eb) ${state.volume * 100}%, var(--slider-track, #e5e7eb) 100%)`,
                  }}
                />
                <span className={`text-[10px] font-medium ${accent.text} ${accent.textDark} w-7 text-right`}>
                  {Math.round(state.volume * 100)}%
                </span>
              </div>

              {/* Speed presets */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {PLAYBACK_RATE_PRESETS.map((rate) => {
                  const isActive = state.playbackRate === rate;
                  return (
                    <button
                      key={rate}
                      onClick={() => onSetPlaybackRate(id, rate)}
                      className={`px-1.5 h-6 rounded text-[10px] font-medium transition-all ${
                        isActive
                          ? `${accent.solidBg} text-white shadow-sm`
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={`Velocidade ${rate}x`}
                    >
                      {rate}x
                    </button>
                  );
                })}
              </div>

              {/* File controls (hidden in remote/mobile mode) */}
              {!readOnlyFiles && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <input
                    ref={(el) => { fileInputRefs.current[id] = el; }}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(id, e)}
                  />
                  <button
                    onClick={() => fileInputRefs.current[id]?.click()}
                    className="w-6 h-6 rounded flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    title={hasFile ? 'Trocar arquivo' : 'Carregar arquivo'}
                  >
                    <i className={`fas ${hasFile ? 'fa-sync-alt' : 'fa-upload'} text-[10px]`}></i>
                  </button>
                  {hasFile && (
                    <button
                      onClick={() => onClearFile(id)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Remover arquivo"
                    >
                      <i className="fas fa-times text-[10px]"></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmbientSoundsPanel;
