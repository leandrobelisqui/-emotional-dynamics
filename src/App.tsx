import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditTab from './components/EditTab';
import ViewTab from './components/ViewTab';
import BottomPlayerBar from './components/BottomPlayerBar';
import ThemeToggle from './components/ThemeToggle';
import { useBlockManager } from './hooks/useBlockManager';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { usePlaybackControls } from './hooks/usePlaybackControls';
import { useScriptManager } from './hooks/useScriptManager';
import { useAudioTime } from './hooks/useAudioTime';
import { useTheme } from './hooks/useTheme';
import { LoadedScript, Block } from './types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [volume, setVolume] = useState<number>(0.8);
  const [activeTab, setActiveTab] = useState<'edit' | 'view'>('edit');
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(2000);
  const [audioBasePath, setAudioBasePath] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(16);
  const [trimSilence, setTrimSilence] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(true);
  const [loadedScripts, setLoadedScripts] = useState<LoadedScript[]>([]);

  const { blocks, setBlocks, addBlock, updateBlock, removeBlock, moveBlockUp, moveBlockDown } = useBlockManager();

  const {
    currentBlockIndex,
    isPlaying,
    audioRef: playbackAudioRef,
    nextAudioRef: playbackNextAudioRef,
    playPause: playPauseControl,
    stop,
    playBlockAudio: playBlockAudioControl,
  } = usePlaybackControls(blocks);

  const {
    audioRef,
    nextAudioRef,
    currentAudioIndex,
    setCurrentAudioIndex,
    isAudio1Active,
    trimTimesRef,
    volumeRef,
  } = useAudioPlayer({ blocks, volume, crossfadeDuration, isPlaying, trimSilence, loop });

  const currentBlock = currentAudioIndex >= 0 ? blocks[currentAudioIndex] : null;

  const {
    currentTime,
    duration,
    seek,
  } = useAudioTime({
    audioRef,
    nextAudioRef,
    isAudio1Active,
    isPlaying,
    trimSilence,
    trimTimes: trimTimesRef?.current,
    currentBlockId: currentBlock?.id,
    loop,
    volumeRef,
  });

  const { saveScript: saveScriptFn, loadScriptTauri, loadScriptBrowser } = useScriptManager();

  // Sync audio refs from playback controls to audio player
  React.useEffect(() => {
    if (playbackAudioRef.current) audioRef.current = playbackAudioRef.current;
    if (playbackNextAudioRef.current) nextAudioRef.current = playbackNextAudioRef.current;
  }, [playbackAudioRef, playbackNextAudioRef, audioRef, nextAudioRef]);

  const playPause = () => playPauseControl(currentAudioIndex, setCurrentAudioIndex);
  const playBlockAudio = (blockIndex: number) => playBlockAudioControl(blockIndex, setCurrentAudioIndex);

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    if (nextAudioRef.current) {
      nextAudioRef.current.pause();
      nextAudioRef.current.currentTime = 0;
      nextAudioRef.current.src = '';
    }
    stop();
    setCurrentAudioIndex(-1);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const resetFontSize = () => setFontSize(16);
  const toggleTrimSilence = () => setTrimSilence(prev => !prev);
  const toggleLoop = () => setLoop(prev => !prev);

  const saveScript = async () => {
    await saveScriptFn(blocks, volume, crossfadeDuration, audioBasePath);
  };

  // Helper: tag blocks with script metadata and append
  const appendScript = (scriptBlocks: Block[], fileName: string, settings?: { volume?: number; crossfadeDuration?: number; audioBasePath?: string }) => {
    const scriptId = uuidv4();
    const taggedBlocks = scriptBlocks.map(block => ({
      ...block,
      scriptId,
      scriptName: fileName,
    }));

    setBlocks(prev => [...prev, ...taggedBlocks]);
    setLoadedScripts(prev => [...prev, { id: scriptId, name: fileName, blockCount: taggedBlocks.length }]);

    if (loadedScripts.length === 0 && settings) {
      if (settings.volume !== undefined) setVolume(settings.volume);
      if (settings.crossfadeDuration !== undefined) setCrossfadeDuration(settings.crossfadeDuration);
      if (settings.audioBasePath !== undefined) setAudioBasePath(settings.audioBasePath);
    }
  };

  const loadScriptNative = async () => {
    const result = await loadScriptTauri();
    if (result) {
      appendScript(result.data.blocks, result.fileName, {
        volume: result.data.volume,
        crossfadeDuration: result.data.crossfadeDuration,
        audioBasePath: result.data.audioBasePath,
      });
    }
  };

  const loadScript = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = loadScriptBrowser(event.target?.result as string, file.name);
      if (result) {
        appendScript(result.data.blocks, result.fileName, {
          volume: result.data.volume,
          crossfadeDuration: result.data.crossfadeDuration,
          audioBasePath: result.data.audioBasePath,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Script list management
  const removeScript = (scriptId: string) => {
    setBlocks(prev => prev.filter(b => b.scriptId !== scriptId));
    setLoadedScripts(prev => prev.filter(s => s.id !== scriptId));
  };

  const clearAllScripts = () => {
    handleStop();
    setBlocks([]);
    setLoadedScripts([]);
  };

  const moveScriptUp = (scriptId: string) => {
    const index = loadedScripts.findIndex(s => s.id === scriptId);
    if (index <= 0) return;
    const newScripts = [...loadedScripts];
    [newScripts[index - 1], newScripts[index]] = [newScripts[index], newScripts[index - 1]];
    setLoadedScripts(newScripts);
    rebuildBlocksFromScriptOrder(newScripts);
  };

  const moveScriptDown = (scriptId: string) => {
    const index = loadedScripts.findIndex(s => s.id === scriptId);
    if (index < 0 || index >= loadedScripts.length - 1) return;
    const newScripts = [...loadedScripts];
    [newScripts[index], newScripts[index + 1]] = [newScripts[index + 1], newScripts[index]];
    setLoadedScripts(newScripts);
    rebuildBlocksFromScriptOrder(newScripts);
  };

  const rebuildBlocksFromScriptOrder = (orderedScripts: LoadedScript[]) => {
    setBlocks(prev => {
      const blocksByScript = new Map<string, Block[]>();
      const untaggedBlocks: Block[] = [];
      for (const block of prev) {
        if (block.scriptId) {
          const list = blocksByScript.get(block.scriptId) || [];
          list.push(block);
          blocksByScript.set(block.scriptId, list);
        } else {
          untaggedBlocks.push(block);
        }
      }
      const reordered: Block[] = [];
      for (const script of orderedScripts) {
        reordered.push(...(blocksByScript.get(script.id) || []));
      }
      reordered.push(...untaggedBlocks);
      return reordered;
    });
  };

  // Now playing info for bottom bar
  const nowPlayingLabel = currentBlock?.type === 'audio'
    ? (currentBlock.audioFile?.name || 'Audio')
    : currentBlock?.type === 'text'
      ? (currentBlock.content?.slice(0, 40) || 'Texto')
      : '';
  const nowPlayingType = currentBlock?.type || null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
              Dinamicas de Inteligencia Emocional
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Crie e execute dinamicas com blocos de texto e audio
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="-mb-px flex space-x-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-2.5 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === 'edit'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <i className="fas fa-edit mr-2"></i>
                Edicao
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-2.5 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === 'view'
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <i className="fas fa-eye mr-2"></i>
                Visualizacao
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'edit' ? (
          <EditTab
            blocks={blocks}
            currentBlockIndex={currentBlockIndex}
            audioBasePath={audioBasePath}
            loadedScripts={loadedScripts}
            onAddBlock={addBlock}
            onUpdateBlock={updateBlock}
            onRemoveBlock={removeBlock}
            onMoveBlockUp={moveBlockUp}
            onMoveBlockDown={moveBlockDown}
            onAudioBasePathChange={setAudioBasePath}
            onSaveScript={saveScript}
            onLoadScript={loadScript}
            onLoadScriptNative={loadScriptNative}
            onRemoveScript={removeScript}
            onMoveScriptUp={moveScriptUp}
            onMoveScriptDown={moveScriptDown}
            onClearAllScripts={clearAllScripts}
          />
        ) : (
          <ViewTab
            blocks={blocks}
            currentBlockIndex={currentBlockIndex}
            currentAudioIndex={currentAudioIndex}
            isPlaying={isPlaying}
            fontSize={fontSize}
            loadedScripts={loadedScripts}
            onPlayBlockAudio={playBlockAudio}
          />
        )}
      </div>

      {/* Bottom Player Bar - always visible */}
      <BottomPlayerBar
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        loop={loop}
        crossfadeDuration={crossfadeDuration}
        trimSilence={trimSilence}
        fontSize={fontSize}
        nowPlayingLabel={nowPlayingLabel}
        nowPlayingType={nowPlayingType}
        onPlayPause={playPause}
        onStop={handleStop}
        onSeek={seek}
        onVolumeChange={handleVolumeChange}
        onLoopToggle={toggleLoop}
        onCrossfadeDurationChange={setCrossfadeDuration}
        onTrimSilenceToggle={toggleTrimSilence}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onResetFontSize={resetFontSize}
      />

      {/* Hidden audio elements */}
      <audio ref={audioRef} className="hidden" />
      <audio ref={nextAudioRef} className="hidden" />
    </div>
  );
}
