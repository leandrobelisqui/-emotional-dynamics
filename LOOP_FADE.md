# 🔄 Fade Suave no Loop

## Visão Geral

Quando a remoção de silêncio está ativada e o loop está habilitado, o sistema agora aplica um **fade-out suave** no final do áudio e um **fade-in suave** no início, criando uma transição perfeita sem cortes secos.

## Como Funciona

### 1. Fade-Out Progressivo

Nos últimos **500ms** antes do `endTime` (fim do áudio sem silêncio):
- O volume diminui gradualmente de 100% → 0%
- Usa o `timeupdate` para monitorar o progresso
- Cálculo: `volume = originalVolume * (1 - fadeProgress)`

### 2. Loop Instantâneo

Quando chega ao `endTime`:
- `currentTime` volta para `startTime` (início sem silêncio)
- Volume é zerado instantaneamente
- Nenhum som de "clique" ou corte

### 3. Fade-In Suave

Após voltar ao início:
- Volume aumenta gradualmente de 0% → 100%
- Usa `requestAnimationFrame` para transição suave (60fps)
- Duração: **500ms**
- Cálculo: `volume = originalVolume * fadeProgress`

## Fluxo Completo

```
Áudio tocando (volume 100%)
           ↓
Chega em endTime - 500ms
           ↓
Fade-out inicia (100% → 0%)
           ↓ 500ms depois
Chega em endTime (volume ~0%)
           ↓
Loop: currentTime = startTime
           ↓
Fade-in inicia (0% → 100%)
           ↓ 500ms depois
Volume restaurado (100%)
           ↓
Continua tocando normalmente
```

## Parâmetros Técnicos

### Duração do Fade
```typescript
const LOOP_FADE_DURATION = 500; // 500ms = 0.5 segundos
```

**Ajustar se necessário:**
- **Mais rápido** (300ms): Transição mais energética
- **Mais lento** (800ms): Transição mais suave e relaxante
- **Padrão** (500ms): Equilíbrio ideal para maioria dos casos

### Volume Original
O sistema salva o volume original em `activeAudio.dataset.originalVolume` para:
- Restaurar após o fade
- Respeitar ajustes do usuário
- Evitar acúmulo de fades

## Quando Aplica

| Condição | Fade no Loop |
|----------|--------------|
| **Trim ON + Loop ON** | ✅ Sim |
| **Trim ON + Loop OFF** | ❌ Não (apenas para) |
| **Trim OFF + Loop ON** | ❌ Não (loop normal) |
| **Trim OFF + Loop OFF** | ❌ Não |

**Resumo:** Só aplica fade quando **ambos** trim e loop estão ativados.

## Logs de Debug

```
⏱️ Chegou ao endTime em: 179.75s
🔁 Loop com fade - voltando para: 0.12s
```

## Benefícios

✅ **Sem Cortes Secos**: Transição suave e profissional  
✅ **Loop Perfeito**: Parece uma música contínua  
✅ **Performance**: Usa `requestAnimationFrame` (60fps)  
✅ **Cancelável**: Limpa animações ao trocar de áudio  
✅ **Respeita Volume**: Mantém configuração do usuário  

## Casos de Uso

### 1. Música de Fundo
Loops infinitos sem interrupções perceptíveis, ideal para ambientes ou meditação.

### 2. Apresentações
Música de fundo que não distrai com cortes abruptos.

### 3. Jogos/Apps
Trilhas sonoras que repetem naturalmente.

### 4. Podcasts/Rádio
Vinhetas que fazem loop suave entre segmentos.

## Comparação

### Antes (Sem Fade)
```
[Música tocando] → [CORTE SECO] → [Música recomeça]
                   ↑ Audível e desagradável
```

### Depois (Com Fade)
```
[Música tocando] → [Fade-out suave] → [Fade-in suave] → [Música continua]
                   ↑ Transição imperceptível
```

## Ajustes Avançados

### Mudar Duração do Fade

**Arquivo**: `src/hooks/useAudioTime.ts`

```typescript
// Fade mais rápido (300ms)
const LOOP_FADE_DURATION = 300;

// Fade mais lento (800ms)
const LOOP_FADE_DURATION = 800;

// Fade muito longo (1000ms = 1s)
const LOOP_FADE_DURATION = 1000;
```

### Curva de Fade Customizada

Atualmente usa curva **linear**. Para curvas diferentes:

```typescript
// Fade exponencial (mais suave no início)
activeAudio.volume = originalVolume * Math.pow(progress, 2);

// Fade logarítmico (mais suave no fim)
activeAudio.volume = originalVolume * Math.sqrt(progress);

// Fade S-curve (suave em ambos os lados)
const sCurve = progress < 0.5 
  ? 2 * progress * progress 
  : 1 - Math.pow(-2 * progress + 2, 2) / 2;
activeAudio.volume = originalVolume * sCurve;
```

## Compatibilidade

- ✅ **Navegadores Modernos**: Chrome, Firefox, Edge, Safari
- ✅ **requestAnimationFrame**: Suportado em todos os navegadores atuais
- ✅ **dataset API**: Suportada em todos os navegadores modernos
- ✅ **Performance**: ~60fps, sem impacto perceptível

## Limitações

- **Fade mínimo**: 100ms (menos que isso pode causar cliques)
- **Fade máximo**: 2000ms (mais que isso fica perceptível demais)
- **Trim necessário**: Só funciona com remoção de silêncio ativada
- **Loop necessário**: Só funciona com loop ativado

## Troubleshooting

### Fade não está funcionando
1. Verifique se "Remover Silêncio" está ativado (botão laranja)
2. Verifique se "Loop" está ativado (botão roxo)
3. Verifique logs no console (deve mostrar "Loop com fade")

### Fade muito rápido/lento
Ajuste `LOOP_FADE_DURATION` no arquivo `useAudioTime.ts`

### Volume não restaura corretamente
Verifique se `dataset.originalVolume` está sendo salvo corretamente no console

---

**Dica**: Para melhor experiência, use áudios de alta qualidade e ative tanto o trim quanto o loop para transições profissionais! 🎵✨
