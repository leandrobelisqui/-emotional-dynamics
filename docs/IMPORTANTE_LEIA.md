# ⚠️ IMPORTANTE: Sobre os Caminhos dos Arquivos

## A Situação Atual

**Navegadores web NÃO permitem acesso ao caminho completo dos arquivos por segurança.**

Isso significa que quando você seleciona um arquivo, o sistema só consegue salvar o **nome do arquivo**, não o caminho completo como `C:\Users\Leandro\Music\arquivo.mp3`.

## O que você verá agora:

### ✅ Ao Salvar:
```json
{
  "audioFilePath": "01 - PULA-PULA.mp3",  // Apenas o nome
  "audioFileName": "01 - PULA-PULA.mp3"
}
```

### ✅ Ao Carregar:
```
Script carregado com sucesso!

📁 3 bloco(s) de áudio encontrado(s)

📝 Arquivos de áudio esperados:
1. 00 - ENTRADA_J OUEST.mp3
2. 01 - PULA-PULA.mp3
3. 02 - JEAN ROCK.mp3

💡 Dica: Procure esses arquivos no seu computador
```

## Como Usar o Sistema

### 1️⃣ Criar uma Dinâmica
1. Adicione blocos de texto e áudio
2. Configure volume e crossfade
3. Clique em **"Salvar"**
4. O JSON será baixado

### 2️⃣ Carregar uma Dinâmica
1. Clique em **"Carregar"**
2. Selecione o arquivo JSON
3. Veja a lista de arquivos de áudio necessários
4. Vá para a **Aba de Edição**

### 3️⃣ Recarregar os Áudios
1. Na aba de Edição, veja os **avisos amarelos** 🟨
2. Clique no botão **"Recarregar"** (pulsante)
3. Selecione o arquivo de áudio correspondente
4. Repita para cada bloco de áudio

## 💡 Dicas para Facilitar

### Organize seus Arquivos
```
📁 Minhas Dinâmicas/
  📁 Dinâmica 1/
    📄 script.json
    🎵 00 - ENTRADA.mp3
    🎵 01 - PULA-PULA.mp3
    🎵 02 - JEAN ROCK.mp3
  📁 Dinâmica 2/
    📄 script.json
    🎵 musica1.mp3
    🎵 musica2.mp3
```

### Use Nomes Descritivos
- ✅ `01 - Relaxamento Inicial.mp3`
- ✅ `02 - Atividade Principal.mp3`
- ❌ `audio1.mp3`
- ❌ `track2.mp3`

## 🚀 Quer Caminhos Completos? Use Electron!

Se você realmente precisa que os caminhos completos funcionem, siga estes passos:

### Passo 1: Instalar Dependências
```bash
npm install --save-dev concurrently wait-on electron-builder
```

### Passo 2: Rodar como App Desktop
```bash
npm run electron:dev
```

### Passo 3: Build para Distribuição
```bash
npm run electron:build
```

Com Electron, os caminhos completos funcionarão perfeitamente!

## 📊 Comparação

| Recurso | Navegador Web | Electron App |
|---------|---------------|--------------|
| Funciona online | ✅ Sim | ❌ Não |
| Caminho completo | ❌ Não | ✅ Sim |
| Instalação necessária | ❌ Não | ✅ Sim |
| Recarregar áudios | ✅ Manual | ✅ Automático |
| Portabilidade | ✅ Alta | ⚠️ Média |

## 🎯 Recomendação

### Para Uso Casual:
✅ **Use no navegador** - Funciona perfeitamente, apenas recarregue os áudios manualmente

### Para Uso Profissional:
✅ **Use Electron** - Instale as dependências e rode como app desktop

## ❓ FAQ

**P: Por que não mostra o caminho completo?**  
R: Segurança do navegador. É uma limitação de todos os navegadores modernos.

**P: Posso fazer funcionar no navegador?**  
R: Não. É impossível por design de segurança dos navegadores.

**P: É difícil instalar o Electron?**  
R: Não! Basta rodar os comandos acima.

**P: Preciso recarregar os áudios toda vez?**  
R: No navegador: Sim. No Electron: Não.

## 📞 Próximos Passos

1. **Agora**: Use no navegador, recarregue áudios manualmente
2. **Depois**: Se precisar, migre para Electron
3. **Sempre**: Mantenha seus arquivos organizados

---

**Resumo**: O sistema está funcionando corretamente! Os navegadores não permitem caminhos completos por segurança. Use nomes de arquivo descritivos e mantenha seus arquivos organizados. Se precisar de caminhos completos, use Electron.
