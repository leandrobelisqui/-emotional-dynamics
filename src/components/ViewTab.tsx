import React from 'react';
import { Block } from '../types';
import FloatingControls from './FloatingControls';

interface ViewTabProps {
  blocks: Block[];
  currentBlockIndex: number;
  currentAudioIndex: number;
  isPlaying: boolean;
  volume: number;
  crossfadeDuration: number;
  currentTime: number;
  duration: number;
  loop: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPlayBlockAudio: (index: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onSeek: (time: number) => void;
  onLoopToggle: () => void;
}

const ViewTab: React.FC<ViewTabProps> = ({
  blocks,
  currentBlockIndex,
  currentAudioIndex,
  isPlaying,
  volume,
  crossfadeDuration,
  currentTime,
  duration,
  loop,
  onPlayPause,
  onStop,
  onPrevious,
  onNext,
  onPlayBlockAudio,
  onVolumeChange,
  onCrossfadeDurationChange,
  onSeek,
  onLoopToggle,
}) => {
  return (
    <>
      {/* Floating Controls */}
      <FloatingControls
        volume={volume}
        crossfadeDuration={crossfadeDuration}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        loop={loop}
        onVolumeChange={onVolumeChange}
        onCrossfadeDurationChange={onCrossfadeDurationChange}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onSeek={onSeek}
        onLoopToggle={onLoopToggle}
      />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Visualização</h2>
        </div>
      
      <div className="min-h-96 max-h-[600px] overflow-y-auto border-2 border-gray-300 rounded-lg p-6 space-y-6">
        {blocks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Adicione blocos na aba de Edição para começar sua dinâmica
          </p>
        ) : (
          blocks.map((block, index) => (
            <div 
              key={block.id}
              className={`p-4 rounded-lg transition-all duration-300 ${
                index === currentBlockIndex 
                  ? 'bg-blue-50 border-2 border-blue-400 shadow-md' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {block.type === 'text' ? (
                <div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-font text-blue-500 mr-2"></i>
                    <span className="text-sm font-medium text-gray-600">Bloco de Texto</span>
                  </div>
                  <div 
                    className="prose max-w-none text-gray-800 whitespace-pre-wrap"
                    style={{ fontSize: '1rem', lineHeight: '1.6' }}
                  >
                    {block.content || <span className="text-gray-400 italic">Texto vazio</span>}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <i className={`fas fa-music mr-2 ${
                        index === currentAudioIndex && isPlaying 
                          ? 'text-green-500 animate-pulse' 
                          : 'text-blue-500'
                      }`}></i>
                      <span className="text-sm font-medium text-gray-600">Bloco de Áudio</span>
                    </div>
                    {block.audioFile && (
                      <button
                        onClick={() => onPlayBlockAudio(index)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        <i className="fas fa-play mr-1"></i>
                        Tocar
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {block.audioFile?.name || <span className="text-gray-400 italic">Nenhum áudio selecionado</span>}
                  </p>
                  {block.duration && (
                    <p className="text-sm text-gray-500 mt-1">
                      Duração: {Math.floor(block.duration / 60)}:{String(block.duration % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={onPrevious}
          disabled={currentBlockIndex <= 0}
          className="p-3 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Anterior"
        >
          <i className="fas fa-step-backward text-2xl"></i>
        </button>
        <button
          onClick={onNext}
          disabled={currentBlockIndex >= blocks.length - 1}
          className="p-3 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Próximo"
        >
          <i className="fas fa-step-forward text-2xl"></i>
        </button>
      </div>
    </div>
    </>
  );
};

export default ViewTab;
