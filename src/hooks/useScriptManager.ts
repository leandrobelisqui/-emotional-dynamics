import { Block } from '../types';
import { isTauri, isElectron } from '../utils/platform';
import { getBasename, joinPath, deriveCommonBasePath } from '../utils/pathUtils';
import { v4 as uuidv4 } from 'uuid';

interface ScriptData {
  audioBasePath: string;
  blocks: any[];
  volume: number;
  crossfadeDuration: number;
}

interface LoadResult {
  data: ScriptData;
  fileName: string;
}

export function useScriptManager() {
  const saveScript = async (
    blocks: Block[],
    volume: number,
    crossfadeDuration: number,
    audioBasePath: string
  ) => {
    // Se audioBasePath não foi definido manualmente, derivar dos caminhos dos áudios.
    const audioPaths = blocks
      .filter(b => b.type === 'audio' && b.audioFilePath)
      .map(b => b.audioFilePath as string);
    const effectiveBasePath = audioBasePath || deriveCommonBasePath(audioPaths);

    const script = {
      // Pasta base dos áudios — altere isso se mover os arquivos para outro lugar.
      audioBasePath: effectiveBasePath,
      blocks: blocks.map(block => {
        // Nome do arquivo: preferir File.name, senão basename do path, senão audioFileName existente.
        const fileName =
          block.audioFile?.name ||
          (block.audioFilePath ? getBasename(block.audioFilePath) : null) ||
          block.audioFileName ||
          null;

        return {
          id: block.id,
          type: block.type,
          content: block.content,
          // Salvamos APENAS o nome do arquivo. O caminho completo é reconstruído
          // no load via `audioBasePath + audioFileName`.
          audioFileName: fileName,
          duration: block.duration,
        };
      }),
      volume,
      crossfadeDuration,
    };

    // Se está no Electron, usa API nativa
    if (isElectron()) {
      try {
        const { saveScriptToFile } = await import('../utils/electronScriptManager');
        const success = await saveScriptToFile(script);
        if (success) {
          alert('Script salvo com sucesso!');
        }
      } catch (error) {
        console.error('Error saving script in Electron:', error);
        alert('Erro ao salvar script.');
      }
      return;
    }

    // Se está no Tauri, usa API nativa
    if (isTauri()) {
      try {
        const { saveScriptToFile } = await import('../utils/tauriScriptManager');
        const success = await saveScriptToFile(script);
        if (success) {
          alert('Script salvo com sucesso!');
        }
      } catch (error) {
        console.error('Error saving script in Tauri:', error);
        alert('Erro ao salvar script.');
      }
      return;
    }

    // Código para navegador
    const dataStr = JSON.stringify(script, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportName = `emotional-dynamics-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();

    // Show info about saved paths
    if (audioBasePath) {
      console.log('Pasta base dos áudios:', audioBasePath);
    }
    const audioBlocks = blocks.filter(b => b.type === 'audio' && b.audioFilePath);
    if (audioBlocks.length > 0) {
      console.log('Arquivos de áudio:', audioBlocks.map(b => b.audioFilePath));
    }
  };

  const loadScriptTauri = async (): Promise<LoadResult | null> => {
    // Se está no Electron
    if (isElectron()) {
      try {
        const { loadScriptFromFile } = await import('../utils/electronScriptManager');
        const { loadAudioFile } = await import('../utils/electronAudioLoader');

        const result = await loadScriptFromFile();
        if (!result) return null;
        const { data, fileName } = result;
        const basePath = data.audioBasePath || '';

        // Carregar áudios automaticamente!
        const loadedBlocks = await Promise.all(
          data.blocks.map(async (block: any) => {
            if (block.type === 'audio') {
              // Novo formato: basePath + audioFileName. Legado: audioFilePath completo.
              const resolvedPath = block.audioFileName
                ? joinPath(basePath, block.audioFileName)
                : (block.audioFilePath || null);

              if (resolvedPath) {
                const audioFile = await loadAudioFile(resolvedPath);
                return {
                  ...block,
                  audioFile,
                  audioFilePath: resolvedPath,
                  audioFileName: block.audioFileName || (block.audioFilePath ? getBasename(block.audioFilePath) : null),
                  id: block.id || uuidv4(),
                };
              }
            }
            return {
              ...block,
              id: block.id || uuidv4()
            };
          })
        );

        const loadedAudios = loadedBlocks.filter((b: any) => b.type === 'audio' && b.audioFile).length;
        const totalAudios = loadedBlocks.filter((b: any) => b.type === 'audio').length;

        if (loadedAudios === totalAudios) {
          console.log(`✅ Script "${fileName}" carregado - todos os áudios OK`);
        } else {
          console.log(`⚠️ Script "${fileName}" carregado - ${loadedAudios}/${totalAudios} áudios`);
        }

        return {
          data: { ...data, blocks: loadedBlocks },
          fileName,
        };
      } catch (error) {
        console.error('Error loading script in Electron:', error);
        alert('Erro ao carregar script.');
        return null;
      }
    }

    // Se está no Tauri
    try {
      const { loadScriptFromFile } = await import('../utils/tauriScriptManager');
      const { loadAudioFile } = await import('../utils/tauriAudioLoader');

      const result = await loadScriptFromFile();
      if (!result) return null;
      const { data, fileName } = result;
      const basePath = data.audioBasePath || '';

      // Carregar áudios automaticamente!
      const loadedBlocks = await Promise.all(
        data.blocks.map(async (block: any) => {
          if (block.type === 'audio') {
            const resolvedPath = block.audioFileName
              ? joinPath(basePath, block.audioFileName)
              : (block.audioFilePath || null);

            if (resolvedPath) {
              const audioFile = await loadAudioFile(resolvedPath);
              return {
                ...block,
                audioFile,
                audioFilePath: resolvedPath,
                audioFileName: block.audioFileName || (block.audioFilePath ? getBasename(block.audioFilePath) : null),
                id: block.id || uuidv4(),
              };
            }
          }
          return {
            ...block,
            id: block.id || uuidv4()
          };
        })
      );

      const loadedAudios = loadedBlocks.filter((b: any) => b.type === 'audio' && b.audioFile).length;
      const totalAudios = loadedBlocks.filter((b: any) => b.type === 'audio').length;

      if (loadedAudios === totalAudios) {
        console.log(`✅ Script "${fileName}" carregado - todos os áudios OK`);
      } else {
        console.log(`⚠️ Script "${fileName}" carregado - ${loadedAudios}/${totalAudios} áudios`);
      }

      return {
        data: { ...data, blocks: loadedBlocks },
        fileName,
      };
    } catch (error) {
      console.error('Error loading script in Tauri:', error);
      alert('Erro ao carregar script.');
      return null;
    }
  };

  const loadScriptBrowser = (fileContent: string, fileName?: string): LoadResult | null => {
    try {
      const data = JSON.parse(fileContent);

      if (!data.blocks || !Array.isArray(data.blocks)) {
        throw new Error('Formato de arquivo inválido');
      }

      const basePath = data.audioBasePath || '';

      // Load blocks structure (audio files will need to be manually reloaded in browser)
      const loadedBlocks = data.blocks.map((block: any) => {
        // Novo formato: audioFileName. Legado: extrair basename de audioFilePath.
        const audioFileName =
          block.audioFileName ||
          (block.audioFilePath ? getBasename(block.audioFilePath) : null);
        const audioFilePath = audioFileName ? joinPath(basePath, audioFileName) : null;

        return {
          id: block.id || uuidv4(),
          type: block.type,
          content: block.content || null,
          audioFile: null, // Will be loaded manually by user
          audioFilePath,
          audioFileName,
          duration: block.duration,
        };
      });

      const audioBlocks = loadedBlocks.filter((b: any) => b.type === 'audio');
      if (audioBlocks.length > 0) {
        const pathsList = audioBlocks.map((b: any, i: number) => {
          const fullPath = b.audioFilePath || b.audioFileName || 'Sem informação';
          return `${i + 1}. ${fullPath}`;
        }).join('\n');

        console.log(`📁 Script carregado com ${audioBlocks.length} áudio(s):\n${pathsList}`);
      }

      const name = fileName || 'script';

      return {
        data: { ...data, blocks: loadedBlocks },
        fileName: name.replace(/\.json$/i, ''),
      };
    } catch (error) {
      console.error('Error loading script:', error);
      alert('Erro ao carregar o arquivo. Certifique-se de que é um arquivo de script válido.');
      return null;
    }
  };

  return {
    saveScript,
    loadScriptTauri,
    loadScriptBrowser,
  };
}
