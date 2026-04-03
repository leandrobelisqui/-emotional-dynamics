import React from 'react';
import { Block, LoadedScript } from '../types';
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
  trimSilence: boolean;
  loadedScripts: LoadedScript[];
  onPlayPause: () => void;
  onStop: () => void;
  onPlayBlockAudio: (index: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCrossfadeDurationChange: (duration: number) => void;
  onSeek: (time: number) => void;
  onLoopToggle: () => void;
  onTrimSilenceToggle: () => void;
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
  trimSilence,
  loadedScripts,
  onPlayPause,
  onStop,
  onPlayBlockAudio,
  onVolumeChange,
  onCrossfadeDurationChange,
  onSeek,
  onLoopToggle,
  onTrimSilenceToggle,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onResetFontSize,
}) => {
  // Determine script boundaries for visual separators
  const getScriptIndex = (block: Block): number => {
    if (!block.scriptId) return -1;
    return loadedScripts.findIndex(s => s.id === block.scriptId);
  };

  const isFirstBlockOfScript = (index: number): boolean => {
    if (index === 0) return !!blocks[0]?.scriptId;
    const current = blocks[index];
    const prev = blocks[index - 1];
    return !!current?.scriptId && current.scriptId !== prev?.scriptId;
  };

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
        trimSilence={trimSilence}
        onVolumeChange={onVolumeChange}
        onCrossfadeDurationChange={onCrossfadeDurationChange}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onSeek={onSeek}
        onLoopToggle={onLoopToggle}
        onTrimSilenceToggle={onTrimSilenceToggle}
        onIncreaseFontSize={onIncreaseFontSize}
        onDecreaseFontSize={onDecreaseFontSize}
        onResetFontSize={onResetFontSize}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Visualizacao</h2>
          {loadedScripts.length > 1 && (
            <span className="text-sm text-indigo-600 dark:text-indigo-400">
              <i className="fas fa-layer-group mr-1"></i>
              {loadedScripts.length} dinamicas em sequencia
            </span>
          )}
        </div>

      <div className="min-h-96 max-h-[600px] overflow-y-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 space-y-6">
        {blocks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Adicione blocos na aba de Edicao para comecar sua dinamica
          </p>
        ) : (
          blocks.map((block, index) => {
            const showSeparator = isFirstBlockOfScript(index) && loadedScripts.length > 1;
            const scriptIdx = getScriptIndex(block);

            // Script separator colors (cycle through palette)
            const separatorColors = [
              { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-400 dark:border-indigo-600', text: 'text-indigo-700 dark:text-indigo-300', icon: 'text-indigo-500' },
              { bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-400 dark:border-teal-600', text: 'text-teal-700 dark:text-teal-300', icon: 'text-teal-500' },
              { bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-400 dark:border-amber-600', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-500' },
              { bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-400 dark:border-rose-600', text: 'text-rose-700 dark:text-rose-300', icon: 'text-rose-500' },
              { bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-400 dark:border-cyan-600', text: 'text-cyan-700 dark:text-cyan-300', icon: 'text-cyan-500' },
            ];
            const colorSet = separatorColors[scriptIdx % separatorColors.length] || separatorColors[0];

            // Block styling
            const getBlockClasses = () => {
              const isActive = index === currentBlockIndex;

              if (block.type === 'audio') {
                return isActive
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 shadow-md'
                  : 'bg-green-50/50 dark:bg-green-900/10 border border-green-300 dark:border-green-800';
              } else {
                return isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-500 shadow-md'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600';
              }
            };

            return (
              <React.Fragment key={block.id}>
                {/* Script separator */}
                {showSeparator && (
                  <div className={`flex items-center gap-3 py-3 px-4 rounded-lg ${colorSet.bg} border-l-4 ${colorSet.border}`}>
                    <i className={`fas fa-bookmark ${colorSet.icon}`}></i>
                    <div className="flex-1">
                      <span className={`text-sm font-semibold ${colorSet.text}`}>
                        {block.scriptName || 'Dinamica'}
                      </span>
                      <span className={`text-xs ml-2 ${colorSet.text} opacity-70`}>
                        ({scriptIdx + 1}/{loadedScripts.length})
                      </span>
                    </div>
                  </div>
                )}

                {/* Block content */}
                <div
                  className={`p-4 rounded-lg transition-all duration-300 ${getBlockClasses()}`}
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
                              ? 'text-green-600 dark:text-green-400 animate-pulse'
                              : 'text-green-600 dark:text-green-400'
                          }`}></i>
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">Bloco de Audio</span>
                        </div>
                        {block.audioFile && (
                          <button
                            onClick={() => onPlayBlockAudio(index)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm rounded transition-colors shadow-sm"
                          >
                            <i className="fas fa-play mr-1"></i>
                            Tocar
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {block.audioFile?.name || <span className="text-gray-400 dark:text-gray-500 italic">Nenhum audio selecionado</span>}
                      </p>
                      {block.duration && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Duracao: {Math.floor(block.duration / 60)}:{String(Math.floor(block.duration % 60)).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
    </>
  );
};

export default ViewTab;
