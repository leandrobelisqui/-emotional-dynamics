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
import { useAmbientSounds } from './hooks/useAmbientSounds';
import { useRemoteSync } from './hooks/useRemoteSync';
import { useTheme } from './hooks/useTheme';
import RemoteControlModal from './components/RemoteControlModal';
import { LoadedScript, Block } from './types';
import { isTauri, isElectron } from './utils/platform';
import { joinPath } from './utils/pathUtils';

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
  const [remoteModalOpen, setRemoteModalOpen] = useState<boolean>(false);

  const { blocks, setBlocks, addBlock, updateBlock, removeBlock, moveBlockUp, moveBlockDown } = useBlockManager();

  const {
    currentBlockIndex,
    isPlaying,
    setIsPlaying,
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

  const {
    layers: ambientLayers,
    loadFile: ambientLoadFile,
    clearFile: ambientClearFile,
    togglePlay: ambientTogglePlay,
    setVolume: ambientSetVolume,
    setPlaybackRate: ambientSetPlaybackRate,
  } = useAmbientSounds();

  const playPause = () => {
    // Nada iniciado ainda → delega pro controle (que cuida de selecionar o 1º áudio e ligar o state)
    if (currentAudioIndex === -1) {
      playPauseControl(currentAudioIndex, setCurrentAudioIndex);
      return;
    }

    // Áudio em execução: pausar/retomar o elemento atualmente ativo (respeitando crossfade)
    const activeAudio = isAudio1Active ? audioRef.current : nextAudioRef.current;
    const otherAudio = isAudio1Active ? nextAudioRef.current : audioRef.current;

    if (isPlaying) {
      activeAudio?.pause();
      // Se estiver em meio a crossfade, o outro também pode estar tocando
      if (otherAudio && !otherAudio.paused) otherAudio.pause();
      setIsPlaying(false);
    } else {
      if (activeAudio) {
        activeAudio.play().catch(e => console.error('Error resuming audio:', e));
      }
      setIsPlaying(true);
    }
  };

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

  // Recarregar todos os áudios usando audioBasePath + audioFileName de cada bloco.
  // Útil quando o usuário move a pasta e atualiza o basePath.
  const reloadAllAudios = async () => {
    if (!audioBasePath) {
      alert('Informe primeiro a Pasta Base dos Arquivos de Audio.');
      return;
    }
    if (!isTauri() && !isElectron()) {
      alert('Recarga automática disponível apenas no aplicativo desktop. Use o botão "Recarregar" em cada bloco.');
      return;
    }

    const loader = isElectron()
      ? (await import('./utils/electronAudioLoader')).loadAudioFile
      : (await import('./utils/tauriAudioLoader')).loadAudioFile;

    const audioBlocks = blocks.filter(b => b.type === 'audio' && b.audioFileName);
    let loaded = 0;
    let failed = 0;

    for (const block of audioBlocks) {
      const fullPath = joinPath(audioBasePath, block.audioFileName as string);
      try {
        const file = await loader(fullPath);
        if (file) {
          updateBlock(block.id, {
            audioFile: file,
            audioFilePath: fullPath,
          });
          loaded++;
        } else {
          failed++;
          console.warn(`❌ Não encontrado: ${fullPath}`);
        }
      } catch (error) {
        failed++;
        console.error(`❌ Erro carregando ${fullPath}:`, error);
      }
    }

    if (failed === 0) {
      alert(`✅ ${loaded} áudio(s) recarregado(s) com sucesso.`);
    } else {
      alert(`⚠️ ${loaded} carregado(s), ${failed} falhou(aram). Verifique o console para detalhes.`);
    }
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

  // Now playing info for bottom bar (must be declared before useRemoteSync uses them)
  const nowPlayingLabel = currentBlock?.type === 'audio'
    ? (currentBlock.audioFile?.name || 'Audio')
    : currentBlock?.type === 'text'
      ? (currentBlock.content?.slice(0, 40) || 'Texto')
      : '';
  const nowPlayingType = currentBlock?.type || null;

  // Remote control (celular) — espelha state e dispacha comandos nos handlers já existentes
  const remoteInfo = useRemoteSync({
    blocks,
    loadedScripts,
    currentBlockIndex,
    currentAudioIndex,
    currentTime,
    duration,
    isPlaying,
    volume,
    loop,
    crossfadeDuration,
    trimSilence,
    fontSize,
    nowPlayingLabel,
    nowPlayingType,
    ambientLayers,
    onPlayPause: playPause,
    onStop: handleStop,
    onPlayBlockAudio: playBlockAudio,
    onSeek: seek,
    onSetVolume: setVolume,
    onSetLoop: setLoop,
    onSetCrossfade: setCrossfadeDuration,
    onSetTrimSilence: setTrimSilence,
    onIncreaseFontSize: increaseFontSize,
    onDecreaseFontSize: decreaseFontSize,
    onResetFontSize: resetFontSize,
    onAmbientTogglePlay: ambientTogglePlay,
    onAmbientSetVolume: ambientSetVolume,
    onAmbientSetPlaybackRate: ambientSetPlaybackRate,
  });

  const remoteAvailable = !!(window as any).electron?.remote;

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
            onReloadAllAudios={reloadAllAudios}
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
        ambientLayers={ambientLayers}
        onAmbientLoadFile={ambientLoadFile}
        onAmbientClearFile={ambientClearFile}
        onAmbientTogglePlay={ambientTogglePlay}
        onAmbientSetVolume={ambientSetVolume}
        onAmbientSetPlaybackRate={ambientSetPlaybackRate}
        remoteClientCount={remoteInfo.clientCount}
        onOpenRemote={remoteAvailable ? () => setRemoteModalOpen(true) : undefined}
      />

      {/* Remote Control Modal */}
      <RemoteControlModal
        open={remoteModalOpen}
        info={remoteInfo}
        onClose={() => setRemoteModalOpen(false)}
      />

      {/* Hidden audio elements */}
      <audio ref={audioRef} className="hidden" />
      <audio ref={nextAudioRef} className="hidden" />
    </div>
  );
}
