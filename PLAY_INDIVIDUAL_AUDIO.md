# ▶️ Reprodução Individual de Áudios

## Visão Geral

Agora você pode iniciar a reprodução de **qualquer áudio** diretamente clicando no botão **"Tocar"** ao lado dele, sem precisar usar os controles flutuantes. Isso permite pular para qualquer parte do roteiro instantaneamente.

## Como Funciona

### Antes
- Só era possível iniciar do primeiro áudio
- Ou usar Play/Pause nos controles flutuantes
- Clicar em "Tocar" apenas selecionava o áudio, mas não iniciava

### Agora
- Clique em **"Tocar"** em qualquer bloco de áudio
- O áudio começa a tocar **imediatamente**
- Não importa se já tinha outro áudio tocando
- Não importa a posição do áudio na lista

## Fluxo de Funcionamento

```
Usuário clica em "Tocar" no Áudio #5
           ↓
playBlockAudio(5) é chamado
           ↓
setCurrentAudioIndex(5)  ← Define qual áudio tocar
           ↓
setCurrentBlockIndex(5)  ← Marca bloco como ativo
           ↓
setIsPlaying(true)       ← Inicia reprodução
           ↓
useAudioPlayer detecta mudança
           ↓
Carrega e toca o Áudio #5 ✅
```

## Interface Visual

### Botão "Tocar"
Cada bloco de áudio tem um botão verde:

```
┌─────────────────────────────────────────┐
│ 🎵 Bloco de Áudio          [▶️ Tocar]  │
│ musica-ambiente.mp3                     │
│ Duração: 3:45                           │
└─────────────────────────────────────────┘
```

**Características:**
- Cor verde para combinar com blocos de áudio
- Ícone de play (▶️)
- Hover effect
- Só aparece se houver arquivo de áudio

### Feedback Visual

**Áudio Ativo:**
- Borda verde mais forte
- Fundo verde claro
- Ícone de música pulsando (se estiver tocando)

**Áudio Inativo:**
- Borda verde suave
- Fundo verde muito claro

## Casos de Uso

### 1. Testar Áudio Específico
Você está editando e quer ouvir apenas um áudio específico:
- Clique em "Tocar" naquele áudio
- Ele toca imediatamente
- Não precisa tocar todos os anteriores

### 2. Pular Partes do Roteiro
Durante apresentação, quer pular para outra seção:
- Clique em "Tocar" no áudio da nova seção
- Transição instantânea
- Continua de onde clicou

### 3. Revisão de Áudios
Quer revisar vários áudios rapidamente:
- Clique em "Tocar" no primeiro
- Ouça um pouco
- Clique em "Tocar" no próximo
- E assim por diante

### 4. Apresentação Não-Linear
Roteiro com múltiplos caminhos:
- Escolha qual caminho seguir
- Clique no áudio correspondente
- Apresentação se adapta dinamicamente

## Comportamento Detalhado

### Se Nenhum Áudio Está Tocando
```
Estado: Parado
Ação: Clica em "Tocar" no Áudio #3
Resultado: Áudio #3 começa a tocar
```

### Se Outro Áudio Está Tocando
```
Estado: Áudio #1 tocando
Ação: Clica em "Tocar" no Áudio #5
Resultado: Áudio #1 para, Áudio #5 começa
```

### Com Crossfade Ativado
```
Estado: Áudio #2 tocando com crossfade
Ação: Clica em "Tocar" no Áudio #7
Resultado: Crossfade suave do #2 para #7
```

### Com Loop Ativado
```
Estado: Áudio #4 em loop
Ação: Clica em "Tocar" no Áudio #6
Resultado: Loop do #4 para, #6 começa (com loop se ativado)
```

### Com Trim de Silêncio
```
Estado: Trim ativado
Ação: Clica em "Tocar" em qualquer áudio
Resultado: Áudio inicia no startTime (sem silêncio)
```

## Logs de Debug

Quando você clica em "Tocar", o console mostra:

```
▶️ Iniciando reprodução do áudio: musica-ambiente.mp3 no índice: 5
🔍 Analisando silêncio para: musica-ambiente.mp3
✅ Trim salvo no cache: block-abc123
✂️ Aplicando trim no play - startTime: 0.15s
```

## Integração com Controles Flutuantes

Os controles flutuantes continuam funcionando normalmente:

| Controle | Comportamento |
|----------|---------------|
| **Play/Pause** | Pausa/retoma o áudio atual |
| **Stop** | Para completamente |
| **Volume** | Ajusta volume do áudio tocando |
| **Crossfade** | Aplica na transição entre áudios |
| **Loop** | Faz loop do áudio atual |
| **Trim** | Remove silêncio de todos os áudios |

## Diferença Entre Botões

### Botão "Tocar" (no bloco)
- **Função**: Iniciar áudio específico
- **Localização**: Ao lado de cada bloco de áudio
- **Comportamento**: Sempre inicia o áudio daquele bloco

### Botão Play/Pause (controles flutuantes)
- **Função**: Controlar reprodução atual
- **Localização**: Painel flutuante à direita
- **Comportamento**: 
  - Se nada tocando → Inicia do primeiro áudio
  - Se tocando → Pausa
  - Se pausado → Retoma

## Código Implementado

**Arquivo**: `src/hooks/usePlaybackControls.ts`

```typescript
const playBlockAudio = (blockIndex: number, setCurrentAudioIndex: (index: number) => void) => {
  const block = blocks[blockIndex];
  if (block.type === 'audio' && block.audioFile) {
    // Definir o índice do áudio
    setCurrentAudioIndex(blockIndex);
    // Definir o bloco atual
    setCurrentBlockIndex(blockIndex);
    // Iniciar reprodução
    setIsPlaying(true);
    console.log('▶️ Iniciando reprodução do áudio:', block.audioFile.name, 'no índice:', blockIndex);
  }
};
```

## Benefícios

✅ **Navegação Rápida** - Pule para qualquer áudio instantaneamente  
✅ **Teste Individual** - Ouça áudios específicos sem tocar todos  
✅ **Apresentação Flexível** - Adapte o roteiro em tempo real  
✅ **Workflow Eficiente** - Menos cliques para testar áudios  
✅ **Intuitivo** - Botão "Tocar" faz exatamente o que diz  

## Compatibilidade

- ✅ Funciona com crossfade
- ✅ Funciona com loop
- ✅ Funciona com trim de silêncio
- ✅ Funciona com fade no loop
- ✅ Funciona em modo claro e escuro
- ✅ Funciona com todos os formatos de áudio

## Troubleshooting

### Botão não aparece
- Verifique se o bloco tem um arquivo de áudio carregado
- Só blocos de áudio têm o botão "Tocar"

### Clica mas não toca
- Verifique o console para erros
- Verifique se o arquivo de áudio é válido
- Tente recarregar o arquivo

### Toca áudio errado
- Verifique os logs no console
- Deve mostrar o índice correto
- Reporte se houver inconsistência

---

**Dica**: Use esta funcionalidade para criar apresentações dinâmicas onde você pode pular entre seções conforme necessário! 🎵✨
