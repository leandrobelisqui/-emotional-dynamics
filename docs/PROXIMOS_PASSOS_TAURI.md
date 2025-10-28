# 🚀 Próximos Passos para Completar a Migração para Tauri

## ✅ O Que Já Foi Feito

1. ✅ Dependências do Tauri instaladas (`@tauri-apps/cli` e `@tauri-apps/api`)
2. ✅ Scripts adicionados ao `package.json`
3. ✅ Utilitários criados:
   - `src/utils/tauriFilePicker.ts` - Seleção de arquivos
   - `src/utils/tauriAudioLoader.ts` - Carregamento de áudios
   - `src/utils/tauriScriptManager.ts` - Salvar/Carregar scripts
   - `src/utils/platform.ts` - Detecção de plataforma
4. ✅ Código adaptado:
   - `BlockItem.tsx` - Usa Tauri quando disponível
   - `App.tsx` - Save/Load com Tauri

## 🔧 O Que Falta Fazer

### 1️⃣ Instalar Rust (5 minutos)

**Opção 1: Download Manual (Recomendado)**
1. Acesse: https://rustup.rs/
2. Baixe `rustup-init.exe`
3. Execute o instalador
4. Siga as instruções (aceite os padrões)
5. **Reinicie o terminal/PowerShell**

**Opção 2: Via Winget**
```powershell
winget install --id Rustlang.Rustup
```

**Verificar instalação**:
```powershell
# Reinicie o terminal primeiro!
rustc --version
cargo --version
```

### 2️⃣ Inicializar Tauri (3 minutos)

Depois de instalar o Rust e reiniciar o terminal:

```bash
cd c:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics

npx tauri init
```

**Responda as perguntas**:
```
? What is your app name?
  → emotional-dynamics

? What should the window title be?
  → Dinâmicas de Inteligência Emocional

? Where are your web assets (HTML/CSS/JS) located, relative to the "<current dir>/src-tauri/tauri.conf.json" file that will be created?
  → ../dist

? What is the url of your dev server?
  → http://localhost:5173

? What is your frontend dev command?
  → npm run dev

? What is your frontend build command?
  → npm run build
```

### 3️⃣ Configurar Permissões (2 minutos)

Edite o arquivo `src-tauri/tauri.conf.json` que foi criado:

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Dinâmicas de Inteligência Emocional",
    "version": "0.1.0"
  },
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
    "bundle": {
      "active": true,
      "category": "DeveloperTool",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.emotional-dynamics.app",
      "longDescription": "",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 900,
        "resizable": true,
        "title": "Dinâmicas de Inteligência Emocional",
        "width": 1400
      }
    ]
  }
}
```

### 4️⃣ Rodar em Desenvolvimento (1 minuto)

```bash
npm run tauri:dev
```

**O que vai acontecer**:
1. Vite inicia o servidor de desenvolvimento
2. Tauri compila o backend Rust (primeira vez demora ~5 min)
3. App desktop abre! 🎉

### 5️⃣ Testar as Funcionalidades

No app desktop:

1. **Adicionar Áudio**:
   - Clique em "+ Áudio"
   - Diálogo nativo do Windows abre
   - Selecione um arquivo
   - ✅ Caminho completo é salvo!

2. **Salvar Script**:
   - Clique em "Salvar"
   - Diálogo nativo para escolher onde salvar
   - ✅ Script salvo com caminhos completos!

3. **Carregar Script**:
   - Clique em "Carregar"
   - Selecione o JSON
   - ✅ **Áudios carregam AUTOMATICAMENTE!** 🎉

### 6️⃣ Build para Produção (Quando estiver pronto)

```bash
npm run tauri:build
```

**Resultado**: Executável em `src-tauri/target/release/`
- Windows: `.exe` e `.msi`
- Tamanho: ~5-10 MB

---

## 🎯 Diferenças Visíveis

### No Navegador:
```
1. Clica em "Selecionar"
2. Navegador abre diálogo
3. Seleciona arquivo
4. Salva apenas nome: "musica.mp3"
5. Ao carregar: precisa recarregar manualmente
```

### No Tauri:
```
1. Clica em "Selecionar"
2. Diálogo NATIVO do Windows abre
3. Seleciona arquivo
4. Salva caminho completo: "C:\Users\...\musica.mp3"
5. Ao carregar: áudios carregam AUTOMATICAMENTE! ✅
```

---

## 📊 Checklist

- [ ] Instalar Rust
- [ ] Reiniciar terminal
- [ ] Verificar `rustc --version`
- [ ] Rodar `npx tauri init`
- [ ] Configurar permissões no `tauri.conf.json`
- [ ] Rodar `npm run tauri:dev`
- [ ] Testar adicionar áudio
- [ ] Testar salvar script
- [ ] Testar carregar script (áudios automáticos!)
- [ ] Build final (opcional)

---

## 🆘 Problemas Comuns

### "rustc não é reconhecido"
- **Solução**: Reinicie o terminal após instalar Rust

### "Erro ao compilar Rust"
- **Solução**: Certifique-se que tem Visual Studio Build Tools instalado
- Download: https://visualstudio.microsoft.com/downloads/
- Instale "Desktop development with C++"

### "Porta 5173 em uso"
- **Solução**: Feche outros processos Vite ou mude a porta no `vite.config.ts`

---

## 🎉 Resultado Final

Quando tudo estiver funcionando:

✅ App desktop nativo do Windows  
✅ Diálogos nativos para arquivos  
✅ Caminhos completos funcionando  
✅ **Áudios carregam automaticamente!**  
✅ Executável de ~5 MB  
✅ Sem limitações de navegador  
✅ Profissional e rápido  

---

## 📞 Próximo Passo

**Instale o Rust agora**:
1. Acesse: https://rustup.rs/
2. Baixe e instale
3. Reinicie o terminal
4. Rode: `npx tauri init`
5. Depois: `npm run tauri:dev`

**Está pronto para começar!** 🚀
