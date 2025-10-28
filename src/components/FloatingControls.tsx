import React from 'react';

interface FloatingControlsProps {
  volume: number;
  crossfadeDuration: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onLoopToggle: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  volume,
  crossfadeDuration,
  isPlaying,
  currentTime,
  duration,
  loop,
  onVolumeChange,
  onCrossfadeDurationChange,
  onPlayPause,
  onStop,
  onSeek,
  onLoopToggle,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-2xl p-4 border border-gray-200 z-50 w-64">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-sliders-h mr-2 text-blue-500"></i>
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
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          title={loop ? 'Loop Ativado' : 'Loop Desativado'}
        >
          <i className="fas fa-redo text-lg"></i>
        </button>
      </div>
      
      {/* Time Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {formatTime(currentTime)}
          </span>
          <span className="text-xs font-medium text-gray-600">
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Início</span>
          <span>Fim</span>
        </div>
      </div>
      
      {/* Volume Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <i className="fas fa-volume-up mr-2 text-gray-600"></i>
            Volume
          </label>
          <span className="text-sm font-semibold text-blue-600">
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Crossfade Duration Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <i className="fas fa-exchange-alt mr-2 text-gray-600"></i>
            Crossfade
          </label>
          <span className="text-sm font-semibold text-green-600">
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((crossfadeDuration - 500) / 4500) * 100}%, #e5e7eb ${((crossfadeDuration - 500) / 4500) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5s</span>
          <span>5.0s</span>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          Ajuste em tempo real
        </p>
      </div>
    </div>
  );
};

export default FloatingControls;
