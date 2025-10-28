# 📂 Como Usar a Pasta Base dos Áudios

## 🎯 O Que É?

A **Pasta Base** é o diretório onde você mantém todos os arquivos de áudio da sua dinâmica. Ao configurar isso, o sistema pode mostrar os caminhos completos dos arquivos ao carregar um script.

## ✨ Como Funciona

### 1️⃣ Configurar a Pasta Base

Na **Aba de Edição**, você verá um campo azul no topo:

```
📂 Pasta Base dos Arquivos de Áudio
┌─────────────────────────────────────────────────┐
│ C:\Users\Leandro\Music\Dinamicas               │
└─────────────────────────────────────────────────┘
💡 Informe a pasta onde estão seus arquivos de áudio
```

**Digite o caminho completo da pasta**, por exemplo:
- `C:\Users\Leandro\Music\Dinamicas`
- `D:\Trabalho\Dinâmicas Emocionais`
- `C:\Projetos\Audio`

### 2️⃣ Adicionar Arquivos de Áudio

Depois de configurar a pasta base:
1. Clique em **"+ Áudio"**
2. Clique em **"Selecionar"**
3. Escolha o arquivo de áudio

O sistema salva apenas o **nome do arquivo**, não o caminho completo.

### 3️⃣ Salvar o Script

Clique em **"Salvar"**. O JSON conterá:

```json
{
  "audioBasePath": "C:\\Users\\Leandro\\Music\\Dinamicas",
  "blocks": [
    {
      "type": "audio",
      "audioFilePath": "01 - PULA-PULA.mp3",
      "audioFileName": "01 - PULA-PULA.mp3"
    },
    {
      "type": "audio",
      "audioFilePath": "02 - JEAN ROCK.mp3",
      "audioFileName": "02 - JEAN ROCK.mp3"
    }
  ]
}
```

### 4️⃣ Carregar o Script

Ao clicar em **"Carregar"** e selecionar o JSON, você verá:

```
Script carregado com sucesso!

📂 Pasta base configurada: C:\Users\Leandro\Music\Dinamicas

📁 2 bloco(s) de áudio encontrado(s)

⚠️ Os arquivos de áudio precisam ser recarregados:
Vá para a aba de Edição e clique em "Recarregar" nos blocos com aviso amarelo.

📝 Caminhos completos esperados:
1. C:\Users\Leandro\Music\Dinamicas\01 - PULA-PULA.mp3
2. C:\Users\Leandro\Music\Dinamicas\02 - JEAN ROCK.mp3

💡 Dica: Os arquivos devem estar na pasta configurada.
```

### 5️⃣ Recarregar os Áudios

Na **Aba de Edição**:
1. Veja os **avisos amarelos** nos blocos de áudio
2. O aviso mostra o caminho completo esperado
3. Clique em **"Recarregar"**
4. Navegue até a pasta e selecione o arquivo

## 📊 Exemplo Prático

### Estrutura de Pastas Recomendada

```
📁 C:\Users\Leandro\Music\Dinamicas\
  📁 Dinâmica 1 - Relaxamento\
    📄 script.json
    🎵 01 - Entrada.mp3
    🎵 02 - Relaxamento.mp3
    🎵 03 - Atividade.mp3
  📁 Dinâmica 2 - Energia\
    📄 script.json
    🎵 01 - Aquecimento.mp3
    🎵 02 - Pula-Pula.mp3
```

### Passo a Passo Completo

1. **Criar Dinâmica**:
   ```
   - Configure pasta base: C:\Users\Leandro\Music\Dinamicas\Dinâmica 1 - Relaxamento
   - Adicione blocos de texto e áudio
   - Salve o script
   ```

2. **Usar em Outra Sessão**:
   ```
   - Carregue o script
   - Veja os caminhos completos
   - Recarregue os áudios da pasta indicada
   - Pronto!
   ```

## 💡 Dicas Importantes

### ✅ Boas Práticas

1. **Use caminhos absolutos**:
   - ✅ `C:\Users\Leandro\Music\Dinamicas`
   - ❌ `Music\Dinamicas` (relativo)

2. **Mantenha organizado**:
   - Uma pasta por dinâmica
   - Nomes descritivos nos arquivos
   - Script JSON na mesma pasta

3. **Nomes de arquivo claros**:
   - ✅ `01 - Entrada Relaxamento.mp3`
   - ✅ `02 - Atividade Principal.mp3`
   - ❌ `audio1.mp3`
   - ❌ `track.mp3`

### ⚠️ Evite

1. **Não mova os arquivos** depois de criar o script
2. **Não renomeie** os arquivos de áudio
3. **Não use caracteres especiais** nos nomes (evite: `?`, `*`, `<`, `>`)

## 🔄 Fluxo de Trabalho Recomendado

### Para Criar Nova Dinâmica:

```
1. Crie uma pasta para a dinâmica
2. Coloque todos os áudios nessa pasta
3. Abra a aplicação
4. Configure a pasta base (cole o caminho)
5. Adicione os blocos
6. Salve o script na mesma pasta
```

### Para Usar Dinâmica Existente:

```
1. Abra a aplicação
2. Carregue o script JSON
3. Veja os caminhos completos na mensagem
4. Vá para Aba de Edição
5. Recarregue cada áudio (estão na pasta indicada)
6. Execute a dinâmica
```

## 🎯 Vantagens Deste Sistema

| Vantagem | Descrição |
|----------|-----------|
| 📁 **Organização** | Sabe exatamente onde estão os arquivos |
| 🔍 **Fácil Localização** | Caminhos completos mostrados ao carregar |
| 💾 **JSON Pequeno** | Salva apenas nomes, não arquivos inteiros |
| 🚀 **Rápido** | Não precisa procurar arquivos |
| 📝 **Documentado** | Pasta base fica registrada no script |

## ❓ FAQ

**P: Preciso configurar a pasta base toda vez?**  
R: Não! Ela é salva no script JSON e carregada automaticamente.

**P: Posso mudar a pasta base depois?**  
R: Sim! Basta editar o campo na Aba de Edição.

**P: E se eu mover os arquivos para outra pasta?**  
R: Atualize a pasta base e recarregue os áudios.

**P: Funciona com pastas em rede?**  
R: Sim! Use o caminho UNC: `\\servidor\pasta\dinamicas`

**P: Posso ter áudios em pastas diferentes?**  
R: Tecnicamente sim, mas recomendamos manter todos na mesma pasta base para facilitar.

## 🎉 Resultado Final

Com este sistema:
- ✅ Você configura a pasta **uma vez**
- ✅ O sistema **lembra** onde estão os arquivos
- ✅ Ao carregar, mostra **caminhos completos**
- ✅ Você sabe **exatamente** onde procurar
- ✅ Processo **rápido e organizado**

---

**Resumo**: Configure a pasta base, adicione seus áudios, salve o script. Ao carregar, você verá exatamente onde estão os arquivos! 🎯
