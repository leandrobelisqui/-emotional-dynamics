import React from 'react';
import { PlayerControlsProps } from '../types';

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onStop,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button
        onClick={onStop}
        className="p-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Parar"
      >
        <i className="fas fa-stop text-xl"></i>
      </button>
      
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`p-2 text-gray-700 hover:text-gray-900 ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Anterior"
      >
        <i className="fas fa-step-backward text-xl"></i>
      </button>
      
      <button
        onClick={onPlayPause}
        className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        title={isPlaying ? 'Pausar' : 'Reproduzir'}
      >
        {isPlaying ? (
          <i className="fas fa-pause text-xl"></i>
        ) : (
          <i className="fas fa-play text-xl"></i>
        )}
      </button>
      
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={`p-2 text-gray-700 hover:text-gray-900 ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Próximo"
      >
        <i className="fas fa-step-forward text-xl"></i>
      </button>
      
      <div className="text-sm text-gray-500 ml-4">
        {isPlaying ? 'Reproduzindo...' : 'Pausado'}
      </div>
    </div>
  );
};

export default PlayerControls;
