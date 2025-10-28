# 🚀 Emotional Dynamics - Versão Electron

## ✅ Problema Resolvido!

Convertemos o projeto de **Tauri** para **Electron** para resolver os problemas de:
- ❌ Complexidade do Tauri no Windows (Rust, Visual Studio, Windows SDK)
- ❌ Impossibilidade de salvar caminhos de áudio no navegador

## 🎯 O Que Você Ganha com Electron

### 1. **Instalação Simples**
```powershell
npm install
```
Pronto! Sem Rust, sem Visual Studio, sem dor de cabeça.

### 2. **Salvar Caminhos de Áudio**
Quando você salva um script, os caminhos completos dos arquivos de áudio são salvos:
```json
{
  "audioBasePath": "C:\\Music\\Dinamicas",
  "blocks": [
    {
      "audioFilePath": "C:\\Music\\Dinamicas\\relaxamento.mp3"
    }
  ]
}
```

### 3. **Carregamento Automático**
Quando você abre um script salvo:
- ✅ Os áudios são **carregados automaticamente**
- ✅ Você não precisa reselecionar os arquivos
- ✅ Tudo funciona como esperado!

## 🚀 Como Usar

### Primeira Vez

1. **Instalar dependências** (se ainda não instalou):
```powershell
npm install
```

2. **Rodar o app**:
```powershell
npm run electron:dev
```

### Uso Diário

```powershell
npm run electron:dev
```

### Gerar Executável

```powershell
npm run electron:build
```

O arquivo `.exe` estará em `dist-electron/`

## 📁 Arquivos Criados

```
electron/
├── main.js          # Processo principal do Electron
└── preload.js       # Ponte segura entre Electron e React

src/utils/
├── electronFilePicker.ts      # Seleção de arquivos
├── electronScriptManager.ts   # Salvar/carregar scripts
└── electronAudioLoader.ts     # Carregar áudios
```

## 🎓 Fluxo de Trabalho

### Criar uma Dinâmica

1. Abra o app: `npm run electron:dev`
2. Adicione blocos de texto e áudio
3. Configure a pasta base dos áudios (recomendado)
4. Salve o script → **Caminhos salvos automaticamente!**

### Usar uma Dinâmica Salva

1. Abra o app: `npm run electron:dev`
2. Carregue o script
3. **Áudios carregados automaticamente!** ✅
4. Execute na aba "Visualização"

## 💡 Dica de Organização

Mantenha seus arquivos organizados:

```
C:\Users\Leandro\Documents\Dinamicas\
├── audios\
│   ├── relaxamento.mp3
│   ├── respiracao.mp3
│   └── meditacao.mp3
└── scripts\
    ├── dinamica-1.json
    └── dinamica-2.json
```

Configure "Pasta base dos áudios" como: `C:\Users\Leandro\Documents\Dinamicas\audios`

## 🔄 Migração do Tauri

Se você tinha scripts salvos do Tauri, eles funcionarão no Electron! Basta carregar o arquivo JSON.

## ❓ FAQ

**P: Preciso instalar algo além do Node.js?**  
R: Não! Apenas `npm install` e pronto.

**P: Funciona no Mac/Linux?**  
R: Sim! Electron é multiplataforma.

**P: O executável é grande?**  
R: Sim (~150MB), mas funciona offline e sem dependências.

**P: Posso voltar para Tauri depois?**  
R: Sim, os arquivos do Tauri ainda estão no projeto. Mas por quê? 😄

## 🎉 Pronto!

Agora você tem um aplicativo desktop completo que:
- ✅ Funciona imediatamente
- ✅ Salva caminhos de áudio
- ✅ Carrega áudios automaticamente
- ✅ Não precisa de configuração complexa

**Próximo passo:** `npm run electron:dev` 🚀
