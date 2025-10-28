# 🧪 Teste: Carregamento Automático de Áudios

## 🎯 O Que Você Quer

Quando você **carrega um script salvo**, os áudios devem ser **carregados automaticamente** sem precisar reselecionar cada arquivo.

## ✅ Como Funciona no Electron

### 1. Ao Salvar o Script

O Electron salva o **caminho completo** de cada arquivo de áudio:

```json
{
  "audioBasePath": "C:\\Users\\Leandro\\Music",
  "blocks": [
    {
      "id": "abc123",
      "type": "audio",
      "audioFilePath": "C:\\Users\\Leandro\\Music\\relaxamento.mp3",
      "duration": 180
    }
  ]
}
```

### 2. Ao Carregar o Script

O Electron:
1. ✅ Lê o JSON
2. ✅ Encontra os caminhos dos áudios
3. ✅ **Carrega automaticamente cada arquivo**
4. ✅ Mostra mensagem de sucesso

**Você NÃO precisa reselecionar os arquivos!**

## 🧪 Como Testar

### Passo 1: Abrir em 2 Terminais

**Terminal 1 - Vite:**
```powershell
cd C:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics
npm run dev
```

Aguarde aparecer: `➜  Local:   http://localhost:5173/`

**Terminal 2 - Electron:**
```powershell
cd C:\Users\Leandro\AppData\Roaming\Claude\CascadeProjects\windsurf-project\emotional-dynamics
npm run electron:start
```

### Passo 2: Criar uma Dinâmica de Teste

1. No app Electron que abriu:
2. Adicione 2-3 blocos de áudio
3. Selecione arquivos de áudio
4. **Salve o script** (dê um nome como `teste-auto-load.json`)

### Passo 3: Fechar e Reabrir

1. Feche o Electron (X na janela)
2. Abra novamente: `npm run electron:start`
3. **Carregue o script** que você salvou

### ✅ Resultado Esperado

Você deve ver uma mensagem assim:

```
✅ Script carregado com sucesso!

Todos os áudios foram carregados automaticamente!
```

E os blocos de áudio devem estar **prontos para tocar** sem você precisar reselecionar nada!

## ❌ Se Não Funcionar

### Problema: "Alguns arquivos não foram encontrados"

**Causa:** Os arquivos de áudio foram movidos ou não existem mais

**Solução:**
- Verifique se os arquivos ainda estão no mesmo lugar
- Ou mova os arquivos de volta para onde estavam quando salvou

### Problema: Ainda pede para reselecionar

**Causa:** Você está usando o navegador web, não o Electron

**Solução:**
- Certifique-se de estar usando `npm run electron:start`
- Não use `npm run dev` sozinho (isso abre só o navegador)

## 📝 Código Responsável

O carregamento automático está em:
- `src/hooks/useScriptManager.ts` - Função `loadScriptTauri()`
- `src/utils/electronAudioLoader.ts` - Função `loadAudioFile()`

Quando você carrega um script no Electron:

```typescript
// Para cada bloco de áudio no script
if (block.type === 'audio' && block.audioFilePath) {
  // Carrega automaticamente usando o caminho salvo
  const audioFile = await loadAudioFile(block.audioFilePath);
  block.audioFile = audioFile; // ✅ Arquivo carregado!
}
```

## 🎯 Resumo

| Ambiente | Salva Caminhos | Carrega Automaticamente |
|----------|----------------|-------------------------|
| **Navegador Web** | ❌ Não | ❌ Não |
| **Electron** | ✅ Sim | ✅ **SIM!** |
| **Tauri** | ✅ Sim | ✅ Sim (mas difícil de configurar) |

**Use o Electron para ter carregamento automático!** 🚀

## 🐛 Debug

Se quiser ver o que está acontecendo, abra o DevTools no Electron (F12) e veja o console. Você verá mensagens como:

```
Loading audio file: C:\Users\Leandro\Music\relaxamento.mp3
✅ Audio file loaded successfully
```

---

**Próximo passo:** Execute os comandos acima e teste! 🎉
