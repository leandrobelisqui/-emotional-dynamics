import React, { useState, useRef, useCallback } from 'react';

interface BottomPlayerBarProps {
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
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoopToggle: () => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onTrimSilenceToggle: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
}

const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({
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
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      const syntheticEvent = { target: { value: String(prevVolume) } } as React.ChangeEvent<HTMLInputElement>;
      onVolumeChange(syntheticEvent);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      const syntheticEvent = { target: { value: '0' } } as React.ChangeEvent<HTMLInputElement>;
      onVolumeChange(syntheticEvent);
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return 'fa-volume-mute';
    if (volume < 0.3) return 'fa-volume-off';
    if (volume < 0.7) return 'fa-volume-down';
    return 'fa-volume-up';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Thin progress bar at top edge */}
      <div
        ref={progressBarRef}
        className="progress-bar-track group cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main bar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-700/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

        {/* Row 1: Now Playing + Transport + Seek */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* Now Playing Info */}
          <div className="flex items-center gap-2.5 min-w-0 w-40 sm:w-52 flex-shrink-0">
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
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                    {nowPlayingLabel}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <i className="fas fa-headphones text-gray-300 dark:text-gray-600 text-sm"></i>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Nenhum audio</p>
              </div>
            )}
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={onStop}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Parar"
            >
              <i className="fas fa-stop text-xs"></i>
            </button>
            <button
              onClick={onPlayPause}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-sky-500 hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30 transition-all hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm ${isPlaying ? '' : 'ml-0.5'}`}></i>
            </button>
            <button
              onClick={onLoopToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                loop
                  ? 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={loop ? 'Loop Ativado' : 'Loop Desativado'}
            >
              <i className="fas fa-redo text-xs"></i>
            </button>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-8 text-right flex-shrink-0 hidden sm:block">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, var(--slider-track, #e5e7eb) ${progress}%, var(--slider-track, #e5e7eb) 100%)`
              }}
            />
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono w-8 flex-shrink-0 hidden sm:block">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Row 2: Volume + Crossfade + Trim + Font */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-4 border-t border-gray-100 dark:border-gray-800/50">

          {/* Volume */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleMuteToggle}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              title={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              <i className={`fas ${getVolumeIcon()} text-xs`}></i>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                if (isMuted) setIsMuted(false);
                onVolumeChange(e);
              }}
              className="w-20 h-1 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(isMuted ? 0 : volume) * 100}%, var(--slider-track, #e5e7eb) ${(isMuted ? 0 : volume) * 100}%, var(--slider-track, #e5e7eb) 100%)`
              }}
            />
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

          {/* Crossfade */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <i className="fas fa-exchange-alt text-[10px] text-gray-400 dark:text-gray-500"></i>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline">Crossfade</span>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={crossfadeDuration}
              onChange={(e) => onCrossfadeDurationChange(parseInt(e.target.value))}
              className="w-16 sm:w-20 h-1 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((crossfadeDuration - 500) / 4500) * 100}%, var(--slider-track, #e5e7eb) ${((crossfadeDuration - 500) / 4500) * 100}%, var(--slider-track, #e5e7eb) 100%)`
              }}
            />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium w-7">
              {(crossfadeDuration / 1000).toFixed(1)}s
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

          {/* Trim Silence */}
          <button
            onClick={onTrimSilenceToggle}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all flex-shrink-0 ${
              trimSilence
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
            }`}
            title={trimSilence ? 'Remover Silencio: Ativado' : 'Remover Silencio: Desativado'}
          >
            <i className="fas fa-cut"></i>
            <span className="hidden sm:inline">Trim</span>
            <div className={`w-6 h-3.5 rounded-full relative transition-colors ${
              trimSilence ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className={`absolute top-[2px] w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-transform ${
                trimSilence ? 'translate-x-[10px]' : 'translate-x-[2px]'
              }`} />
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

          {/* Font Size */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <i className="fas fa-text-height text-[10px] text-gray-400 dark:text-gray-500"></i>
            <button
              onClick={onDecreaseFontSize}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Diminuir fonte"
            >
              <i className="fas fa-minus text-[9px]"></i>
            </button>
            <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium w-7 text-center">
              {fontSize}px
            </span>
            <button
              onClick={onIncreaseFontSize}
              className="w-6 h-6 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Aumentar fonte"
            >
              <i className="fas fa-plus text-[9px]"></i>
            </button>
            <button
              onClick={onResetFontSize}
              className="px-1.5 h-6 rounded text-[9px] text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Resetar fonte"
            >
              reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPlayerBar;
