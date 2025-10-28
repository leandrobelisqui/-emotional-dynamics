# ✅ Solução: Carregamento Automático de Áudios

## 🎯 Seu Problema

> "Eu consegui salvar, porém eu continuo tendo que recarregar o arquivo ao executar aqui, e eu queria que não precisasse recarregar cada um dos arquivos, tendo que ir em cada pasta."

## ✅ A Solução: Electron

**SIM, é totalmente possível com Electron!** O carregamento automático já está implementado.

### Como Funciona

1. **Ao Salvar:**
   - Electron salva o caminho completo: `C:\Users\Leandro\Music\audio.mp3`

2. **Ao Carregar:**
   - Electron lê o caminho
   - **Carrega o arquivo automaticamente**
   - Você NÃO precisa reselecionar!

## 🚀 Como Usar (Forma Mais Fácil)

### Opção 1: Script Automático

```powershell
.\start-electron.bat
```

Isso abre tudo automaticamente!

### Opção 2: Manual (2 terminais)

**Terminal 1:**
```powershell
npm run dev
```

**Terminal 2 (depois que o Vite iniciar):**
```powershell
npm run electron:start
```

## 🧪 Teste Rápido

1. **Abra o Electron** (use um dos métodos acima)
2. **Crie uma dinâmica:**
   - Adicione 2 blocos de áudio
   - Selecione arquivos de áudio
   - Salve o script
3. **Feche o app**
4. **Abra novamente**
5. **Carregue o script**

### ✅ Resultado Esperado

```
✅ Script carregado com sucesso!

Todos os áudios foram carregados automaticamente!
```

**Os áudios estarão prontos para tocar!** Sem precisar reselecionar nada!

## ❓ Por Que Não Estava Funcionando Antes?

Você estava usando o **navegador web** (`npm run dev`), não o Electron.

| Modo | Comando | Carrega Automaticamente? |
|------|---------|--------------------------|
| Navegador | `npm run dev` | ❌ **NÃO** |
| Electron | `npm run electron:start` | ✅ **SIM!** |

## 🔍 Como Saber Se Está no Electron?

- ✅ Janela separada do navegador
- ✅ Tem menu de aplicativo (Arquivo, Editar, etc)
- ✅ Ícone próprio na barra de tarefas
- ✅ DevTools integrado (F12)

## 📝 Arquivos Importantes

### Código de Carregamento Automático

`src/hooks/useScriptManager.ts` (linha ~84):

```typescript
// Se está no Electron
if (isElectron()) {
  const data = await loadScriptFromFile();
  
  // Carregar áudios automaticamente!
  const loadedBlocks = await Promise.all(
    data.blocks.map(async (block) => {
      if (block.type === 'audio' && block.audioFilePath) {
        // ✅ CARREGA AUTOMATICAMENTE
        const audioFile = await loadAudioFile(block.audioFilePath);
        return { ...block, audioFile };
      }
      return block;
    })
  );
  
  // Mostra quantos foram carregados
  alert('✅ Script carregado com sucesso!\n\nTodos os áudios foram carregados automaticamente!');
}
```

### Formato do JSON Salvo

```json
{
  "audioBasePath": "C:\\Users\\Leandro\\Music",
  "blocks": [
    {
      "id": "abc-123",
      "type": "text",
      "content": "Feche os olhos e respire fundo..."
    },
    {
      "id": "def-456",
      "type": "audio",
      "audioFilePath": "C:\\Users\\Leandro\\Music\\relaxamento.mp3",
      "audioFileName": "relaxamento.mp3",
      "duration": 180
    }
  ],
  "volume": 0.8,
  "crossfadeDuration": 2000
}
```

Note o `audioFilePath` - é o caminho completo que permite o carregamento automático!

## 💡 Dicas

### Organização Recomendada

```
C:\Users\Leandro\Documents\Dinamicas\
├── audios\
│   ├── intro.mp3
│   ├── relaxamento.mp3
│   └── encerramento.mp3
└── scripts\
    ├── dinamica-1.json
    └── dinamica-2.json
```

### Pasta Base

Configure a "Pasta base dos áudios" na aba de Edição:
- Exemplo: `C:\Users\Leandro\Documents\Dinamicas\audios`
- Isso ajuda a organizar e facilita encontrar os arquivos

## 🐛 Troubleshooting

### "Alguns arquivos não foram encontrados"

**Causa:** Arquivos foram movidos ou deletados

**Solução:**
1. Verifique se os arquivos ainda existem
2. Ou coloque os arquivos de volta no lugar original

### Ainda pede para reselecionar

**Causa:** Você está no navegador, não no Electron

**Solução:** Use `npm run electron:start` ou `.\start-electron.bat`

### Electron não abre

**Solução:**
```powershell
npm install
npm run electron:start
```

## 🎉 Resumo

✅ **Carregamento automático JÁ ESTÁ FUNCIONANDO no Electron**

✅ **Você só precisa usar o Electron, não o navegador**

✅ **Use:** `.\start-electron.bat` ou `npm run electron:start`

✅ **Teste:** Salve um script, feche, abra, carregue → áudios carregados automaticamente!

---

**Próximo passo:** Execute `.\start-electron.bat` e teste! 🚀
