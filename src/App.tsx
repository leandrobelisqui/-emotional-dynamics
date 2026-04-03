import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditTab from './components/EditTab';
import ViewTab from './components/ViewTab';
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
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  const toggleTrimSilence = () => {
    setTrimSilence(prev => !prev);
  };

  const toggleLoop = () => {
    setLoop(prev => !prev);
  };

  const saveScript = async () => {
    await saveScriptFn(blocks, volume, crossfadeDuration, audioBasePath);
  };

  // Helper: tag blocks with script metadata and append to existing blocks
  const appendScript = (scriptBlocks: Block[], fileName: string, settings?: { volume?: number; crossfadeDuration?: number; audioBasePath?: string }) => {
    const scriptId = uuidv4();
    const taggedBlocks = scriptBlocks.map(block => ({
      ...block,
      scriptId,
      scriptName: fileName,
    }));

    setBlocks(prev => [...prev, ...taggedBlocks]);
    setLoadedScripts(prev => [...prev, { id: scriptId, name: fileName, blockCount: taggedBlocks.length }]);

    // Apply settings from the first loaded script only
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

    // Reset file input so same file can be loaded again
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

    // Reorder loadedScripts
    const newScripts = [...loadedScripts];
    [newScripts[index - 1], newScripts[index]] = [newScripts[index], newScripts[index - 1]];
    setLoadedScripts(newScripts);

    // Rebuild blocks array in new script order
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
      // Also collect blocks without scriptId (manually added blocks)
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
        const scriptBlocks = blocksByScript.get(script.id) || [];
        reordered.push(...scriptBlocks);
      }
      // Append untagged blocks at the end
      reordered.push(...untaggedBlocks);

      return reordered;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Dinâmicas de Inteligência Emocional
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crie e execute dinâmicas com blocos de texto e áudio
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'edit'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <i className="fas fa-edit mr-2"></i>
                Edição
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'view'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <i className="fas fa-eye mr-2"></i>
                Visualização
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {activeTab === 'edit' ? (
            <div className="w-full">
              <EditTab
                blocks={blocks}
                currentBlockIndex={currentBlockIndex}
                volume={volume}
                audioBasePath={audioBasePath}
                loadedScripts={loadedScripts}
                onAddBlock={addBlock}
                onUpdateBlock={updateBlock}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={moveBlockUp}
                onMoveBlockDown={moveBlockDown}
                onVolumeChange={handleVolumeChange}
                onAudioBasePathChange={setAudioBasePath}
                onSaveScript={saveScript}
                onLoadScript={loadScript}
                onLoadScriptNative={loadScriptNative}
                onRemoveScript={removeScript}
                onMoveScriptUp={moveScriptUp}
                onMoveScriptDown={moveScriptDown}
                onClearAllScripts={clearAllScripts}
              />
            </div>
          ) : (
            <div className="w-full">
              <ViewTab
                blocks={blocks}
                currentBlockIndex={currentBlockIndex}
                currentAudioIndex={currentAudioIndex}
                isPlaying={isPlaying}
                volume={volume}
                crossfadeDuration={crossfadeDuration}
                currentTime={currentTime}
                duration={duration}
                loop={loop}
                fontSize={fontSize}
                trimSilence={trimSilence}
                loadedScripts={loadedScripts}
                onPlayPause={playPause}
                onStop={handleStop}
                onPlayBlockAudio={playBlockAudio}
                onVolumeChange={handleVolumeChange}
                onCrossfadeDurationChange={setCrossfadeDuration}
                onSeek={seek}
                onLoopToggle={toggleLoop}
                onTrimSilenceToggle={toggleTrimSilence}
                onIncreaseFontSize={increaseFontSize}
                onDecreaseFontSize={decreaseFontSize}
                onResetFontSize={resetFontSize}
              />
            </div>
          )}
        </div>

        {/* Hidden audio elements */}
        <audio ref={audioRef} className="hidden" />
        <audio ref={nextAudioRef} className="hidden" />
      </div>
    </div>
  );
}
