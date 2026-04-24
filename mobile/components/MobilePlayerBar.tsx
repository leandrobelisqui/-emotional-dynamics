import React, { useRef, useState, useCallback } from 'react';
import AmbientSoundsPanel from '../../src/components/AmbientSoundsPanel';
import { AmbientId, AmbientLayerState } from '../../src/hooks/useAmbientSounds';

interface MobilePlayerBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loop: boolean;
  crossfadeDuration: number;
  trimSilence: boolean;
  fontSize: number;
  nowPlayingLabel: string;
  nowPlayingType: 'audio' | 'text' | null;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onLoopToggle: () => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onTrimSilenceToggle: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
  ambientLayers: Record<AmbientId, AmbientLayerState>;
  onAmbientTogglePlay: (id: AmbientId) => void;
  onAmbientSetVolume: (id: AmbientId, volume: number) => void;
  onAmbientSetPlaybackRate: (id: AmbientId, rate: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

type PanelKind = null | 'ambient' | 'more';

const MobilePlayerBar: React.FC<MobilePlayerBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  loop,
  crossfadeDuration,
  trimSilence,
  fontSize,
  nowPlayingLabel,
  nowPlayingType,
  onPlayPause,
  onStop,
  onSeek,
  onVolumeChange,
  onLoopToggle,
  onCrossfadeDurationChange,
  onTrimSilenceToggle,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
  ambientLayers,
  onAmbientTogglePlay,
  onAmbientSetVolume,
  onAmbientSetPlaybackRate,
}) => {
  const [openPanel, setOpenPanel] = useState<PanelKind>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const togglePanel = (kind: PanelKind) => {
    setOpenPanel(curr => (curr === kind ? null : kind));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(percent * duration);
  }, [duration, onSeek]);

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return 'fa-volume-mute';
    if (volume < 0.3) return 'fa-volume-off';
    if (volume < 0.7) return 'fa-volume-down';
    return 'fa-volume-up';
  };

  const ambientActiveCount = Object.values(ambientLayers).filter(l => l.isPlaying).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Thin progress bar edge */}
      <div
        ref={progressBarRef}
        className="progress-bar-track group cursor-pointer"
        onClick={handleProgressClick}
      >
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-700/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

        {/* Expandable panels render ABOVE the main bar */}
        {openPanel === 'ambient' && (
          <AmbientSoundsPanel
            layers={ambientLayers}
            onLoadFile={() => {}}
            onClearFile={() => {}}
            onTogglePlay={onAmbientTogglePlay}
            onSetVolume={onAmbientSetVolume}
            onSetPlaybackRate={onAmbientSetPlaybackRate}
            readOnlyFiles={true}
          />
        )}

        {openPanel === 'more' && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/30 space-y-3">
            {/* Crossfade */}
            <div className="flex items-center gap-2">
              <i className="fas fa-exchange-alt text-xs text-gray-400 dark:text-gray-500 w-5"></i>
              <span className="text-xs text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">Crossfade</span>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={crossfadeDuration}
                onChange={(e) => onCrossfadeDurationChange(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((crossfadeDuration - 500) / 4500) * 100}%, var(--slider-track, #e5e7eb) ${((crossfadeDuration - 500) / 4500) * 100}%, var(--slider-track, #e5e7eb) 100%)`,
                }}
              />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium w-10 text-right">
                {(crossfadeDuration / 1000).toFixed(1)}s
              </span>
            </div>

            {/* Trim + Font in a row */}
            <div className="flex items-center gap-3">
              <button
                onClick={onTrimSilenceToggle}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
                  trimSilence
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-transparent'
                }`}
              >
                <i className="fas fa-cut"></i>
                Trim silêncio
                <div className={`w-8 h-4 rounded-full relative transition-colors ${
                  trimSilence ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`absolute top-[2px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                    trimSilence ? 'translate-x-[18px]' : 'translate-x-[2px]'
                  }`} />
                </div>
              </button>
            </div>

            {/* Font size */}
            <div className="flex items-center gap-2">
              <i className="fas fa-text-height text-xs text-gray-400 dark:text-gray-500 w-5"></i>
              <span className="text-xs text-gray-600 dark:text-gray-300 w-16 flex-shrink-0">Fonte</span>
              <button
                onClick={onDecreaseFontSize}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              <span className="flex-1 text-center text-sm text-violet-600 dark:text-violet-400 font-semibold">
                {fontSize}px
              </span>
              <button
                onClick={onIncreaseFontSize}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
              <button
                onClick={onResetFontSize}
                className="px-2.5 h-9 rounded-lg text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
              >
                reset
              </button>
            </div>
          </div>
        )}

        {/* Main bar content — vertical stack */}
        <div className="px-4 pt-2 pb-3 space-y-2.5">

          {/* Row 1: Now playing info */}
          <div className="flex items-center gap-2.5">
            {nowPlayingType ? (
              <>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  nowPlayingType === 'audio'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40'
                    : 'bg-sky-100 dark:bg-sky-900/40'
                }`}>
                  <i className={`fas ${
                    nowPlayingType === 'audio' ? 'fa-music' : 'fa-font'
                  } text-sm ${
                    nowPlayingType === 'audio'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-sky-600 dark:text-sky-400'
                  } ${isPlaying && nowPlayingType === 'audio' ? 'animate-pulse' : ''}`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {nowPlayingLabel}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <i className="fas fa-headphones text-gray-300 dark:text-gray-600 text-sm"></i>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Nenhum áudio</p>
              </div>
            )}
          </div>

          {/* Row 2: Seek bar full width */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-8 text-right flex-shrink-0">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, var(--slider-track, #e5e7eb) ${progress}%, var(--slider-track, #e5e7eb) 100%)`,
              }}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-8 flex-shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Row 3: Transport centered, large touch targets */}
          <div className="flex items-center justify-center gap-4 py-1">
            <button
              onClick={onStop}
              className="w-11 h-11 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-all"
              title="Parar"
            >
              <i className="fas fa-stop text-sm"></i>
            </button>
            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-sky-500 active:bg-sky-600 dark:bg-sky-600 dark:active:bg-sky-700 text-white shadow-lg shadow-sky-500/30 transition-all active:scale-95"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg ${isPlaying ? '' : 'ml-0.5'}`}></i>
            </button>
            <button
              onClick={onLoopToggle}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                loop
                  ? 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                  : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
              }`}
              title={loop ? 'Loop ativado' : 'Loop desativado'}
            >
              <i className="fas fa-redo text-sm"></i>
            </button>
          </div>

          {/* Row 4: Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-all flex-shrink-0"
            >
              <i className={`fas ${getVolumeIcon()} text-sm`}></i>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                if (isMuted) setIsMuted(false);
                onVolumeChange(parseFloat(e.target.value));
              }}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(isMuted ? 0 : volume) * 100}%, var(--slider-track, #e5e7eb) ${(isMuted ? 0 : volume) * 100}%, var(--slider-track, #e5e7eb) 100%)`,
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium w-10 text-right flex-shrink-0">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Row 5: Panel toggles */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => togglePanel('ambient')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                openPanel === 'ambient'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-transparent'
              }`}
            >
              <i className="fas fa-wave-square"></i>
              Ambiente
              {ambientActiveCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold animate-pulse">
                  {ambientActiveCount}
                </span>
              )}
              <i className={`fas fa-chevron-${openPanel === 'ambient' ? 'down' : 'up'} text-[9px] opacity-60`}></i>
            </button>
            <button
              onClick={() => togglePanel('more')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                openPanel === 'more'
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-transparent'
              }`}
            >
              <i className="fas fa-sliders-h"></i>
              Mais
              <i className={`fas fa-chevron-${openPanel === 'more' ? 'down' : 'up'} text-[9px] opacity-60`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerBar;
