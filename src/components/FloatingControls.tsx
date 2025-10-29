import React from 'react';

interface FloatingControlsProps {
  volume: number;
  crossfadeDuration: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  fontSize: number;
  trimSilence: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onLoopToggle: () => void;
  onTrimSilenceToggle: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  volume,
  crossfadeDuration,
  isPlaying,
  currentTime,
  duration,
  loop,
  fontSize,
  trimSilence,
  onVolumeChange,
  onCrossfadeDurationChange,
  onPlayPause,
  onStop,
  onSeek,
  onLoopToggle,
  onTrimSilenceToggle,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-200 dark:border-gray-700 z-50 w-64">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <i className="fas fa-sliders-h mr-2 text-blue-500 dark:text-blue-400"></i>
        Controles
      </h3>
      
      {/* Play/Pause/Stop/Loop Controls */}
      <div className="mb-4 flex items-center justify-center space-x-2">
        <button
          onClick={onPlayPause}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors shadow-lg"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
        </button>
        <button
          onClick={onStop}
          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
          title="Parar"
        >
          <i className="fas fa-stop text-lg"></i>
        </button>
        <button
          onClick={onLoopToggle}
          className={`p-3 rounded-full transition-colors shadow-lg ${
            loop 
              ? 'bg-purple-500 hover:bg-purple-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
          }`}
          title={loop ? 'Loop Ativado' : 'Loop Desativado'}
        >
          <i className="fas fa-redo text-lg"></i>
        </button>
      </div>
      
      {/* Trim Silence Toggle */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onTrimSilenceToggle}
          className={`w-full p-3 rounded-lg transition-colors shadow-md flex items-center justify-between ${
            trimSilence
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
          }`}
          title={trimSilence ? 'Remover Silêncio Ativado' : 'Remover Silêncio Desativado'}
        >
          <span className="flex items-center">
            <i className="fas fa-cut mr-2"></i>
            <span className="text-sm font-medium">Remover Silêncio</span>
          </span>
          <i className={`fas ${trimSilence ? 'fa-toggle-on' : 'fa-toggle-off'} text-xl`}></i>
        </button>
        {trimSilence && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
            <i className="fas fa-info-circle mr-1"></i>
            Remove silêncio no início e fim dos áudios
          </p>
        )}
      </div>
      
      {/* Time Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Início</span>
          <span>Fim</span>
        </div>
      </div>
      
      {/* Volume Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <i className="fas fa-volume-up mr-2 text-gray-600 dark:text-gray-400"></i>
            Volume
          </label>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(volume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Crossfade Duration Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <i className="fas fa-exchange-alt mr-2 text-gray-600 dark:text-gray-400"></i>
            Crossfade
          </label>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {(crossfadeDuration / 1000).toFixed(1)}s
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={crossfadeDuration}
          onChange={(e) => onCrossfadeDurationChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((crossfadeDuration - 500) / 4500) * 100}%, #e5e7eb ${((crossfadeDuration - 500) / 4500) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0.5s</span>
          <span>5.0s</span>
        </div>
      </div>
      
      {/* Font Size Control */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <i className="fas fa-text-height mr-2 text-gray-600 dark:text-gray-400"></i>
            Fonte
          </label>
          <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            {fontSize}px
          </span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={onDecreaseFontSize}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
            title="Diminuir fonte"
          >
            <i className="fas fa-minus text-sm"></i>
          </button>
          <button
            onClick={onResetFontSize}
            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors text-xs"
            title="Resetar fonte"
          >
            Padrão
          </button>
          <button
            onClick={onIncreaseFontSize}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
            title="Aumentar fonte"
          >
            <i className="fas fa-plus text-sm"></i>
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          Ajuste em tempo real
        </p>
      </div>
    </div>
  );
};

export default FloatingControls;
