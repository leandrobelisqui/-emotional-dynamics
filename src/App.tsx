import React, { useState } from 'react';
import EditTab from './components/EditTab';
import ViewTab from './components/ViewTab';
import ThemeToggle from './components/ThemeToggle';
import { useBlockManager } from './hooks/useBlockManager';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { usePlaybackControls } from './hooks/usePlaybackControls';
import { useScriptManager } from './hooks/useScriptManager';
import { useAudioTime } from './hooks/useAudioTime';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [volume, setVolume] = useState<number>(0.8);
  const [activeTab, setActiveTab] = useState<'edit' | 'view'>('edit');
  const [crossfadeDuration, setCrossfadeDuration] = useState<number>(2000);
  const [audioBasePath, setAudioBasePath] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(16); // Tamanho da fonte em pixels

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
  } = useAudioPlayer({ blocks, volume, crossfadeDuration, isPlaying });

  const {
    currentTime,
    duration,
    loop,
    seek,
    toggleLoop,
  } = useAudioTime({ audioRef, nextAudioRef, isAudio1Active, isPlaying });

  const { saveScript: saveScriptFn, loadScriptTauri, loadScriptBrowser } = useScriptManager();

  // Sync audio refs from playback controls to audio player
  React.useEffect(() => {
    if (playbackAudioRef.current) audioRef.current = playbackAudioRef.current;
    if (playbackNextAudioRef.current) nextAudioRef.current = playbackNextAudioRef.current;
  }, [playbackAudioRef, playbackNextAudioRef, audioRef, nextAudioRef]);

  const playPause = () => playPauseControl(currentAudioIndex, setCurrentAudioIndex);
  const playBlockAudio = (blockIndex: number) => playBlockAudioControl(blockIndex, setCurrentAudioIndex);
  
  const handleStop = () => {
    // Para os áudios reais do useAudioPlayer
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
    
    // Chama o stop do usePlaybackControls para resetar estados
    stop();
    
    // Reseta o índice de áudio
    setCurrentAudioIndex(-1);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 32)); // Máximo 32px
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12)); // Mínimo 12px
  };

  const resetFontSize = () => {
    setFontSize(16); // Tamanho padrão
  };

  const saveScript = async () => {
    await saveScriptFn(blocks, volume, crossfadeDuration, audioBasePath);
  };

  const loadScriptNative = async () => {
    const data = await loadScriptTauri();
    if (data) {
      setBlocks(data.blocks);
      setVolume(data.volume || 0.8);
      setCrossfadeDuration(data.crossfadeDuration || 2000);
      setAudioBasePath(data.audioBasePath || '');
    }
  };

  const loadScript = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = loadScriptBrowser(event.target?.result as string);
      if (data) {
        setBlocks(data.blocks);
        setVolume(data.volume || 0.8);
        setCrossfadeDuration(data.crossfadeDuration || 2000);
        setAudioBasePath(data.audioBasePath || '');
      }
    };
    reader.readAsText(file);
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
                onPlayPause={playPause}
                onStop={handleStop}
                onPlayBlockAudio={playBlockAudio}
                onVolumeChange={handleVolumeChange}
                onCrossfadeDurationChange={setCrossfadeDuration}
                onSeek={seek}
                onLoopToggle={toggleLoop}
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
