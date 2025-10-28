# 🚀 Guia Rápido: Converter para Tauri

## ⚡ Por Que Tauri?

- ✅ **App final: ~5 MB** (vs 150 MB do Electron)
- ✅ **Acesso total** ao sistema de arquivos
- ✅ **Carrega áudios automaticamente** dos caminhos salvos
- ✅ **Sem limitações** de navegador
- ✅ **Rápido e seguro** (Rust)

## 📋 Passo a Passo

### 1️⃣ Instalar Rust (5 minutos)

**Windows**:
```bash
# Opção 1: Via winget
winget install --id Rustlang.Rustup

# Opção 2: Download manual
# Acesse: https://rustup.rs/
# Baixe e execute rustup-init.exe
```

**Após instalar, reinicie o terminal e verifique**:
```bash
rustc --version
cargo --version
```

### 2️⃣ Adicionar Tauri ao Projeto (2 minutos)

```bash
cd emotional-dynamics

# Instalar dependências
npm install --save-dev @tauri-apps/cli
npm install @tauri-apps/api
```

### 3️⃣ Inicializar Tauri (3 minutos)

```bash
npx tauri init
```

**Responda**:
- `What is your app name?` → `emotional-dynamics`
- `What should the window title be?` → `Dinâmicas de Inteligência Emocional`
- `Where are your web assets?` → `../dist`
- `What is the url of your dev server?` → `http://localhost:5173`
- `What is your frontend dev command?` → `npm run dev`
- `What is your frontend build command?` → `npm run build`

### 4️⃣ Configurar Permissões (2 minutos)

Edite `src-tauri/tauri.conf.json`:

```json
{
  "tauri": {
    "allowlist": {
      "all": false,
      "fs": {
        "all": true,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "exists": true,
        "scope": ["**"]
      },
      "dialog": {
        "all": true,
        "open": true,
        "save": true
      },
      "path": {
        "all": true
      }
    },
    "windows": [
      {
        "title": "Dinâmicas de Inteligência Emocional",
        "width": 1400,
        "height": 900,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

### 5️⃣ Adicionar Scripts (1 minuto)

Edite `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

### 6️⃣ Testar (1 minuto)

```bash
npm run tauri:dev
```

**Resultado**: App desktop abre! 🎉

---

## 🔧 Adaptar o Código

### Criar Utilitários Tauri

#### 1. Seletor de Arquivo (`src/utils/tauriFilePicker.ts`)

```typescript
import { open } from '@tauri-apps/api/dialog';

export async function selectAudioFile(): Promise<string | null> {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Audio Files',
        extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac']
      }]
    });
    
    return selected as string | null;
  } catch (error) {
    console.error('Error selecting file:', error);
    return null;
  }
}

export async function selectJsonFile(): Promise<string | null> {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'JSON Files',
        extensions: ['json']
      }]
    });
    
    return selected as string | null;
  } catch (error) {
    console.error('Error selecting file:', error);
    return null;
  }
}

export async function saveJsonFile(): Promise<string | null> {
  try {
    const path = await save({
      filters: [{
        name: 'JSON Files',
        extensions: ['json']
      }],
      defaultPath: `emotional-dynamics-${new Date().toISOString().slice(0, 10)}.json`
    });
    
    return path as string | null;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
}
```

#### 2. Carregador de Áudio (`src/utils/tauriAudioLoader.ts`)

```typescript
import { readBinaryFile } from '@tauri-apps/api/fs';
import { basename } from '@tauri-apps/api/path';

export async function loadAudioFile(path: string): Promise<File | null> {
  try {
    const data = await readBinaryFile(path);
    const fileName = await basename(path);
    const blob = new Blob([data], { type: 'audio/mpeg' });
    return new File([blob], fileName, { type: 'audio/mpeg' });
  } catch (error) {
    console.error('Error loading audio:', error);
    return null;
  }
}

export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(Math.ceil(audio.duration));
    };
    audio.onerror = () => {
      resolve(0);
    };
    audio.src = URL.createObjectURL(file);
  });
}
```

#### 3. Gerenciador de Scripts (`src/utils/tauriScriptManager.ts`)

```typescript
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { selectJsonFile, saveJsonFile } from './tauriFilePicker';

export async function saveScriptToFile(data: any): Promise<boolean> {
  try {
    const path = await saveJsonFile();
    if (!path) return false;
    
    await writeTextFile(path, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving script:', error);
    return false;
  }
}

export async function loadScriptFromFile(): Promise<any | null> {
  try {
    const path = await selectJsonFile();
    if (!path) return null;
    
    const content = await readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading script:', error);
    return null;
  }
}
```

### Atualizar BlockItem.tsx

```typescript
// No início do arquivo
const isTauri = '__TAURI__' in window;

// No handleFileChange
const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  if (isTauri) {
    // Usar Tauri API
    const { selectAudioFile } = await import('../utils/tauriFilePicker');
    const { loadAudioFile, getAudioDuration } = await import('../utils/tauriAudioLoader');
    
    const filePath = await selectAudioFile();
    if (!filePath) return;
    
    const file = await loadAudioFile(filePath);
    if (!file) return;
    
    const duration = await getAudioDuration(file);
    
    onUpdate({
      audioFile: file,
      audioFilePath: filePath, // Caminho completo!
      duration
    });
  } else {
    // Código atual do navegador
    const file = e.target.files?.[0];
    // ... resto do código
  }
};
```

### Atualizar App.tsx (Save/Load)

```typescript
// No início
const isTauri = '__TAURI__' in window;

// saveScript
const saveScript = async () => {
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
  
  if (isTauri) {
    const { saveScriptToFile } = await import('./utils/tauriScriptManager');
    const success = await saveScriptToFile(script);
    if (success) {
      alert('Script salvo com sucesso!');
    }
  } else {
    // Código atual do navegador
    const dataStr = JSON.stringify(script, null, 2);
    // ... resto do código
  }
};

// loadScript
const loadScript = async () => {
  if (isTauri) {
    const { loadScriptFromFile } = await import('./utils/tauriScriptManager');
    const { loadAudioFile } = await import('./utils/tauriAudioLoader');
    
    const data = await loadScriptFromFile();
    if (!data) return;
    
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
    
    setBlocks(loadedBlocks);
    setVolume(data.volume || 0.8);
    setCrossfadeDuration(data.crossfadeDuration || 2000);
    setAudioBasePath(data.audioBasePath || '');
    
    alert('Script carregado com sucesso! Áudios carregados automaticamente.');
  } else {
    // Código atual do navegador
    // ... resto do código
  }
};
```

---

## 🎯 Resultado Final

### No Navegador:
- ⚠️ Precisa recarregar áudios manualmente
- ⚠️ Limitações de segurança

### No Tauri:
- ✅ **Áudios carregam automaticamente!**
- ✅ **Caminhos completos funcionam!**
- ✅ **Sem limitações!**
- ✅ **App profissional!**

---

## 📦 Build Final

```bash
# Build para produção
npm run tauri:build

# Executável gerado em:
# src-tauri/target/release/emotional-dynamics.exe (~5 MB!)
```

---

## 🎉 Vantagens Conquistadas

| Recurso | Navegador | Tauri |
|---------|-----------|-------|
| Carregar áudios automaticamente | ❌ | ✅ |
| Caminhos completos | ❌ | ✅ |
| Tamanho do app | N/A | 5 MB |
| Velocidade | ⚡⚡ | ⚡⚡⚡ |
| Profissional | ⚠️ | ✅ |

---

## 💡 Dica

Você pode manter **ambas versões**:
- **Web**: Para demonstrações online
- **Desktop (Tauri)**: Para uso profissional

O código detecta automaticamente onde está rodando (`isTauri`) e usa a API apropriada!

---

**Tempo total**: ~15 minutos para configurar  
**Resultado**: App desktop profissional com todas as funcionalidades! 🚀
