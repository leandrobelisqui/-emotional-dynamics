import React from 'react';
import { Block } from '../types';
import FloatingControls from './FloatingControls';
import MarkdownText from './MarkdownText';

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
  fontSize: number;
  onPlayPause: () => void;
  onStop: () => void;
  onPlayBlockAudio: (index: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onSeek: (time: number) => void;
  onLoopToggle: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
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
  fontSize,
  onPlayPause,
  onStop,
  onPlayBlockAudio,
  onVolumeChange,
  onCrossfadeDurationChange,
  onSeek,
  onLoopToggle,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
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
        fontSize={fontSize}
        onVolumeChange={onVolumeChange}
        onCrossfadeDurationChange={onCrossfadeDurationChange}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onSeek={onSeek}
        onLoopToggle={onLoopToggle}
        onIncreaseFontSize={onIncreaseFontSize}
        onDecreaseFontSize={onDecreaseFontSize}
        onResetFontSize={onResetFontSize}
      />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Visualização</h2>
        </div>
      
      <div className="min-h-96 max-h-[600px] overflow-y-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-6">
        {blocks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Adicione blocos na aba de Edição para começar sua dinâmica
          </p>
        ) : (
          blocks.map((block, index) => (
            <div 
              key={block.id}
              className={`p-4 rounded-lg transition-all duration-300 ${
                index === currentBlockIndex 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-500 shadow-md' 
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {block.type === 'text' ? (
                <div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-font text-blue-500 dark:text-blue-400 mr-2"></i>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bloco de Texto</span>
                  </div>
                  {block.content ? (
                    <MarkdownText content={block.content} fontSize={fontSize} />
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 italic">Texto vazio</span>
                  )}
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
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bloco de Áudio</span>
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
                  <p className="text-gray-700 dark:text-gray-300">
                    {block.audioFile?.name || <span className="text-gray-400 dark:text-gray-500 italic">Nenhum áudio selecionado</span>}
                  </p>
                  {block.duration && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Duração: {Math.floor(block.duration / 60)}:{String(block.duration % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default ViewTab;
