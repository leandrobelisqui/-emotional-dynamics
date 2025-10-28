# 🎉 Guia do Electron - Emotional Dynamics

## ✅ O Que Foi Feito

Convertemos seu aplicativo de Tauri para **Electron**! Agora você tem:

### Vantagens do Electron
- ✅ **Acesso completo ao sistema de arquivos** - Salva caminhos dos áudios
- ✅ **Carregamento automático** - Ao abrir um script, os áudios são carregados automaticamente
- ✅ **Sem dependências complexas** - Não precisa de Rust, Visual Studio, ou Windows SDK
- ✅ **Funciona em qualquer SO** - Windows, Mac, Linux
- ✅ **Fácil de desenvolver** - Hot reload automático

## 🚀 Como Usar

### Modo Desenvolvimento

```powershell
npm run electron:dev
```

Isso vai:
1. Iniciar o Vite (servidor de desenvolvimento)
2. Abrir a janela do Electron automaticamente
3. Ativar hot reload (mudanças aparecem instantaneamente)

### Gerar Executável (.exe)

```powershell
npm run electron:build
```

O executável estará em: `dist-electron/`

## 📁 Funcionalidades Principais

### 1. Salvar Script com Caminhos de Áudio

Quando você salva um script:
- ✅ Os **caminhos completos** dos arquivos de áudio são salvos
- ✅ O arquivo JSON fica assim:

```json
{
  "audioBasePath": "C:\\Users\\Leandro\\Music\\Audios",
  "blocks": [
    {
      "type": "audio",
      "audioFilePath": "C:\\Users\\Leandro\\Music\\Audios\\relaxamento.mp3",
      "duration": 180
    }
  ],
  "volume": 0.8,
  "crossfadeDuration": 2000
}
```

### 2. Carregar Script Automaticamente

Quando você abre um script salvo:
- ✅ O Electron **lê os caminhos** dos arquivos
- ✅ **Carrega os áudios automaticamente**
- ✅ Mostra quantos áudios foram carregados

**Exemplo de mensagem:**
```
✅ Script carregado com sucesso!

Todos os áudios foram carregados automaticamente!
```

ou

```
Script carregado!

3/4 áudios carregados automaticamente.
Alguns arquivos não foram encontrados.
```

### 3. Seleção de Arquivos Nativa

- ✅ Janelas de diálogo nativas do Windows
- ✅ Filtros automáticos (só mostra arquivos de áudio/JSON)
- ✅ Navegação completa no sistema de arquivos

## 🔧 Estrutura do Projeto

```
emotional-dynamics/
├── electron/
│   ├── main.js       # Processo principal do Electron
│   └── preload.js    # Ponte segura entre Electron e React
├── src/
│   ├── utils/
│   │   ├── electronFilePicker.ts      # Seleção de arquivos
│   │   ├── electronScriptManager.ts   # Salvar/carregar scripts
│   │   └── electronAudioLoader.ts     # Carregar áudios
│   └── ...
└── package.json
```

## 🎯 Fluxo de Trabalho Recomendado

### Criando uma Dinâmica

1. **Abra o app**: `npm run electron:dev`
2. **Adicione blocos** de texto e áudio
3. **Configure a pasta base** dos áudios (opcional, mas recomendado)
4. **Salve o script** - Os caminhos dos áudios são salvos automaticamente
5. **Feche o app**

### Usando uma Dinâmica Salva

1. **Abra o app**: `npm run electron:dev`
2. **Carregue o script** - Clique em "Carregar Script"
3. **Pronto!** - Todos os áudios são carregados automaticamente
4. **Execute a dinâmica** - Vá para a aba "Visualização"

## 💡 Dicas

### Organização de Arquivos

Recomendamos manter seus áudios em uma pasta específica:

```
C:\Users\Leandro\Documents\Dinamicas\
├── audios/
│   ├── relaxamento.mp3
│   ├── respiracao.mp3
│   └── meditacao.mp3
└── scripts/
    ├── dinamica-1.json
    └── dinamica-2.json
```

Configure a "Pasta base dos áudios" como: `C:\Users\Leandro\Documents\Dinamicas\audios`

### Backup

Os scripts são arquivos JSON simples. Você pode:
- ✅ Fazer backup no Google Drive / OneDrive
- ✅ Versionar no Git
- ✅ Compartilhar por email
- ✅ Editar manualmente (se necessário)

## 🐛 Troubleshooting

### "Alguns arquivos não foram encontrados"

**Causa:** Os arquivos de áudio foram movidos ou renomeados

**Solução:**
1. Verifique se os arquivos ainda existem nos caminhos salvos
2. Se moveu os arquivos, atualize a "Pasta base" e recarregue os áudios manualmente

### App não abre

**Solução:**
```powershell
# Limpar e reinstalar
rm -r node_modules
npm install
npm run electron:dev
```

## 📊 Comparação: Electron vs Tauri vs Web

| Recurso | Electron | Tauri | Web |
|---------|----------|-------|-----|
| Salvar caminhos de áudio | ✅ Sim | ✅ Sim | ❌ Não |
| Carregar áudios automaticamente | ✅ Sim | ✅ Sim | ❌ Não |
| Instalação simples | ✅ Sim | ❌ Complexo | ✅ Sim |
| Tamanho do executável | ~150MB | ~5MB | N/A |
| Velocidade | Rápido | Muito rápido | Rápido |
| Multiplataforma | ✅ Sim | ✅ Sim | ✅ Sim |

## 🎓 Próximos Passos

1. **Teste o app**: `npm run electron:dev`
2. **Crie uma dinâmica de teste**
3. **Salve e recarregue** para testar o carregamento automático
4. **Quando estiver satisfeito**: `npm run electron:build` para gerar o executável

---

**Pronto!** Agora você tem um aplicativo desktop completo, sem as complicações do Tauri no Windows! 🎉
