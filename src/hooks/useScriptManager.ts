import { Block } from '../types';
import { isTauri, isElectron } from '../utils/platform';
import { v4 as uuidv4 } from 'uuid';

interface ScriptData {
  audioBasePath: string;
  blocks: any[];
  volume: number;
  crossfadeDuration: number;
}

export function useScriptManager() {
  const saveScript = async (
    blocks: Block[],
    volume: number,
    crossfadeDuration: number,
    audioBasePath: string
  ) => {
    const script = {
      audioBasePath: audioBasePath || '',
      blocks: blocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content,
        audioFilePath: block.audioFilePath || null,
        audioFileName: block.audioFile?.name || null,
        duration: block.duration,
      })),
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

  const loadScriptTauri = async (): Promise<ScriptData | null> => {
    // Se está no Electron
    if (isElectron()) {
      try {
        const { loadScriptFromFile } = await import('../utils/electronScriptManager');
        const { loadAudioFile } = await import('../utils/electronAudioLoader');
        
        const data = await loadScriptFromFile();
        if (!data) return null;
        
        // Carregar áudios automaticamente!
        const loadedBlocks = await Promise.all(
          data.blocks.map(async (block: any) => {
            if (block.type === 'audio' && block.audioFilePath) {
              const audioFile = await loadAudioFile(block.audioFilePath);
              return {
                ...block,
                audioFile,
                id: block.id || uuidv4()
              };
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
          alert('✅ Script carregado com sucesso!\n\nTodos os áudios foram carregados automaticamente!');
        } else {
          alert(`Script carregado!\n\n${loadedAudios}/${totalAudios} áudios carregados automaticamente.\nAlguns arquivos não foram encontrados.`);
        }
        
        return {
          ...data,
          blocks: loadedBlocks
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
      
      const data = await loadScriptFromFile();
      if (!data) return null;
      
      // Carregar áudios automaticamente!
      const loadedBlocks = await Promise.all(
        data.blocks.map(async (block: any) => {
          if (block.type === 'audio' && block.audioFilePath) {
            const audioFile = await loadAudioFile(block.audioFilePath);
            return {
              ...block,
              audioFile,
              id: block.id || uuidv4()
            };
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
        alert('✅ Script carregado com sucesso!\n\nTodos os áudios foram carregados automaticamente!');
      } else {
        alert(`Script carregado!\n\n${loadedAudios}/${totalAudios} áudios carregados automaticamente.\nAlguns arquivos não foram encontrados.`);
      }
      
      return {
        ...data,
        blocks: loadedBlocks
      };
    } catch (error) {
      console.error('Error loading script in Tauri:', error);
      alert('Erro ao carregar script.');
      return null;
    }
  };

  const loadScriptBrowser = (fileContent: string): ScriptData | null => {
    try {
      const data = JSON.parse(fileContent);
      
      if (!data.blocks || !Array.isArray(data.blocks)) {
        throw new Error('Formato de arquivo inválido');
      }
      
      // Load blocks structure (audio files will need to be manually reloaded)
      const loadedBlocks = data.blocks.map((block: any) => ({
        id: block.id || uuidv4(),
        type: block.type,
        content: block.content || null,
        audioFile: null, // Will be loaded manually by user
        audioFilePath: block.audioFilePath || null,
        duration: block.duration,
      }));
      
      const audioBlocks = loadedBlocks.filter((b: any) => b.type === 'audio');
      if (audioBlocks.length > 0) {
        // Prepare message with full paths
        const basePath = data.audioBasePath || '';
        const pathsList = audioBlocks.map((b: any, i: number) => {
          let fileName = b.audioFilePath || 'Sem informação';
          // Remove fakepath if present
          fileName = fileName.replace(/^C:\\fakepath\\/i, '');
          
          // Construct full path if base path exists
          const fullPath = basePath 
            ? `${basePath}${basePath.endsWith('\\') ? '' : '\\'}${fileName}`
            : fileName;
          
          return `${i + 1}. ${fullPath}`;
        }).join('\n');
        
        const basePathInfo = basePath 
          ? `📂 Pasta base configurada: ${basePath}\n\n`
          : `⚠️ Pasta base não configurada. Configure na aba de Edição.\n\n`;
        
        alert(
          `Script carregado com sucesso!\n\n` +
          basePathInfo +
          `📁 ${audioBlocks.length} bloco(s) de áudio encontrado(s)\n\n` +
          `⚠️ Os arquivos de áudio precisam ser recarregados:\n` +
          `Vá para a aba de Edição e clique em "Recarregar" nos blocos com aviso amarelo.\n\n` +
          `📝 Caminhos completos esperados:\n` +
          pathsList +
          `\n\n💡 Dica: Os arquivos devem estar na pasta configurada.`
        );
      } else {
        alert('Script carregado com sucesso!');
      }
      
      return {
        ...data,
        blocks: loadedBlocks
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
