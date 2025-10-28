# Gerenciamento de Caminhos de Áudio

## Problema de Segurança dos Navegadores

Os navegadores modernos **não permitem** acesso ao caminho completo de arquivos por questões de segurança. Quando você seleciona um arquivo via `<input type="file">`, o navegador:

1. ❌ **Não expõe** o caminho completo do arquivo (`C:\Users\...`)
2. ✅ **Apenas fornece** o nome do arquivo e o conteúdo
3. 🔒 Isso é uma **medida de segurança** para proteger a privacidade do usuário

## Soluções Implementadas

### 1. Tentativa de Captura de Caminho (Atual)
```typescript
const filePath = (file as any).path || (e.target as any).value || file.name;
```

**Funciona em**:
- ✅ Electron (desktop apps)
- ✅ Tauri (desktop apps)
- ❌ Navegadores web normais (Chrome, Firefox, Edge)

### 2. Alternativas Disponíveis

#### Opção A: File System Access API (Moderna)
```javascript
// Requer permissão do usuário
const handle = await window.showOpenFilePicker();
const file = await handle.getFile();
// Pode salvar o handle para reutilização
```

**Vantagens**:
- Acesso persistente ao arquivo
- Funciona em navegadores modernos
- Não precisa recarregar o arquivo

**Desvantagens**:
- Requer Chrome 86+ ou Edge 86+
- Não funciona no Firefox
- Requer permissões do usuário

#### Opção B: Converter para Electron/Tauri
Migrar a aplicação para desktop usando:
- **Electron**: Framework completo, mais pesado
- **Tauri**: Mais leve, usa Rust

**Vantagens**:
- Acesso completo ao sistema de arquivos
- Caminhos absolutos funcionam
- Melhor integração com o sistema

**Desvantagens**:
- Requer empacotamento
- Não funciona como web app

#### Opção C: Armazenar Arquivos em Base64 (Atual Fallback)
Salvar o conteúdo do arquivo em Base64 no JSON.

**Vantagens**:
- Funciona em qualquer navegador
- Script totalmente portável

**Desvantagens**:
- Arquivos JSON muito grandes
- Lento para muitos áudios
- Consome muita memória

## Solução Recomendada

### Para Uso Web (Atual)
1. Salvar apenas metadados (nome, duração)
2. Usuário recarrega áudios manualmente
3. Usar localStorage para cache temporário

### Para Uso Desktop (Futuro)
1. Migrar para **Tauri** (recomendado)
2. Acesso completo ao sistema de arquivos
3. Caminhos absolutos funcionam perfeitamente

## Como Verificar os Caminhos Salvos

Após salvar um script, abra o console do navegador (F12) e veja:
```
Caminhos salvos: ["C:\Users\...\audio1.mp3", "audio2.mp3", ...]
```

- Se mostrar caminho completo: ✅ Funcionou
- Se mostrar apenas nome: ⚠️ Navegador bloqueou

## Implementação Atual

O sistema tenta capturar o caminho e:
1. Salva `audioFilePath` no JSON
2. Tenta carregar do caminho ao abrir
3. Se falhar, pede para recarregar manualmente

## Próximos Passos

Se precisar de acesso total aos caminhos:
1. Considere migrar para Tauri
2. Ou use File System Access API (Chrome/Edge apenas)
3. Ou mantenha o sistema atual (mais compatível)
