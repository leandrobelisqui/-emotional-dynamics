import React from 'react';
import { Block, LoadedScript } from '../types';
import MarkdownText from './MarkdownText';

interface ViewTabProps {
  blocks: Block[];
  currentBlockIndex: number;
  currentAudioIndex: number;
  isPlaying: boolean;
  fontSize: number;
  loadedScripts: LoadedScript[];
  onPlayBlockAudio: (index: number) => void;
}

const ViewTab: React.FC<ViewTabProps> = ({
  blocks,
  currentBlockIndex,
  currentAudioIndex,
  isPlaying,
  fontSize,
  loadedScripts,
  onPlayBlockAudio,
}) => {
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

  const separatorColors = [
    { bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-400 dark:border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' },
    { bg: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-400 dark:border-teal-500', text: 'text-teal-700 dark:text-teal-300', badge: 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-400 dark:border-amber-500', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-400 dark:border-rose-500', text: 'text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' },
    { bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-400 dark:border-cyan-500', text: 'text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Visualizacao</h2>
        {loadedScripts.length > 1 && (
          <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full font-medium">
            <i className="fas fa-layer-group mr-1"></i>
            {loadedScripts.length} dinamicas
          </span>
        )}
      </div>

      {/* Content - responsive height */}
      <div className="overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
        {blocks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-music text-2xl text-gray-300 dark:text-gray-600"></i>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Adicione blocos na aba de Edicao para comecar
            </p>
          </div>
        ) : (
          blocks.map((block, index) => {
            const showSeparator = isFirstBlockOfScript(index) && loadedScripts.length > 1;
            const scriptIdx = getScriptIndex(block);
            const colorSet = separatorColors[scriptIdx % separatorColors.length] || separatorColors[0];
            const isActive = index === currentBlockIndex;
            const isPlayingAudio = index === currentAudioIndex && isPlaying;

            return (
              <React.Fragment key={block.id}>
                {/* Script separator */}
                {showSeparator && (
                  <div className={`flex items-center gap-3 py-2.5 px-4 rounded-lg ${colorSet.bg} border-l-4 ${colorSet.border}`}>
                    <i className={`fas fa-bookmark ${colorSet.text} text-sm`}></i>
                    <span className={`text-sm font-semibold ${colorSet.text}`}>
                      {block.scriptName || 'Dinamica'}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorSet.badge}`}>
                      {scriptIdx + 1} de {loadedScripts.length}
                    </span>
                  </div>
                )}

                {/* Block content */}
                <div
                  className={`rounded-lg transition-all duration-200 ${
                    block.type === 'audio'
                      ? isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500 border border-emerald-200 dark:border-emerald-800 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-800'
                      : isActive
                        ? 'bg-sky-50 dark:bg-sky-950/30 border-l-4 border-l-sky-500 border border-sky-200 dark:border-sky-800 shadow-sm'
                        : 'bg-white dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800'
                  } p-4`}
                >
                  {block.type === 'text' ? (
                    <div>
                      {block.content ? (
                        <MarkdownText content={block.content} fontSize={fontSize} />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-sm">Texto vazio</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isPlayingAudio
                            ? 'bg-emerald-500 dark:bg-emerald-600'
                            : 'bg-emerald-100 dark:bg-emerald-900/40'
                        }`}>
                          <i className={`fas ${isPlayingAudio ? 'fa-volume-up' : 'fa-music'} text-sm ${
                            isPlayingAudio
                              ? 'text-white animate-pulse'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {block.audioFile?.name || <span className="text-gray-400 italic">Nenhum audio</span>}
                          </p>
                          {block.duration ? (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {Math.floor(block.duration / 60)}:{String(Math.floor(block.duration % 60)).padStart(2, '0')}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {block.audioFile && (
                        <button
                          onClick={() => onPlayBlockAudio(index)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex-shrink-0 ${
                            isPlayingAudio
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <i className={`fas ${isPlayingAudio ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                          {isPlayingAudio ? 'Tocando' : 'Tocar'}
                        </button>
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
  );
};

export default ViewTab;
