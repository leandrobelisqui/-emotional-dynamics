import { useRef, useCallback } from 'react';

interface SilenceDetectionResult {
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Hook para analisar áudio e detectar silêncio no início e fim
 * Usa Web Audio API para processar a forma de onda
 */
export function useAudioAnalyzer() {
  const audioContextRef = useRef<AudioContext | null>(null);

  /**
   * Detecta silêncio no início e fim de um arquivo de áudio
   * @param audioFile - Arquivo de áudio a ser analisado
   * @param threshold - Threshold de volume (0-1) para considerar como silêncio (padrão: 0.01)
   * @returns Objeto com tempos de início e fim do áudio real (sem silêncio)
   */
  const detectSilence = useCallback(
    async (
      audioFile: File,
      threshold: number = 0.01
    ): Promise<SilenceDetectionResult> => {
      try {
        // Criar ou reutilizar AudioContext
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioContext = audioContextRef.current;

        // Ler arquivo como ArrayBuffer
        const arrayBuffer = await audioFile.arrayBuffer();
        
        // Decodificar áudio
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Obter dados do canal (mono ou primeiro canal se stereo)
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        const totalSamples = channelData.length;
        const duration = audioBuffer.duration;

        // Calcular RMS (Root Mean Square) para cada janela de tempo
        const windowSize = Math.floor(sampleRate * 0.01); // Janela de 10ms

        // Encontrar início do áudio (primeiro ponto acima do threshold)
        let startSample = 0;
        for (let i = 0; i < totalSamples; i += windowSize) {
          const end = Math.min(i + windowSize, totalSamples);
          let rms = 0;
          
          // Calcular RMS para esta janela
          for (let j = i; j < end; j++) {
            rms += channelData[j] * channelData[j];
          }
          rms = Math.sqrt(rms / (end - i));

          // Se encontrou som acima do threshold
          if (rms > threshold) {
            startSample = Math.max(0, i - windowSize); // Voltar uma janela para não cortar
            break;
          }
        }

        // Encontrar fim do áudio (último ponto acima do threshold)
        let endSample = totalSamples;
        for (let i = totalSamples - windowSize; i >= 0; i -= windowSize) {
          const start = Math.max(0, i);
          let rms = 0;
          
          // Calcular RMS para esta janela
          for (let j = start; j < start + windowSize; j++) {
            rms += channelData[j] * channelData[j];
          }
          rms = Math.sqrt(rms / windowSize);

          // Se encontrou som acima do threshold
          if (rms > threshold) {
            endSample = Math.min(totalSamples, i + windowSize * 2); // Adicionar uma janela para não cortar
            break;
          }
        }

        // Converter samples para tempo
        const startTime = startSample / sampleRate;
        const endTime = endSample / sampleRate;

        // Garantir que temos pelo menos algum áudio
        const trimmedDuration = endTime - startTime;
        if (trimmedDuration < 0.1) {
          // Se o áudio trimado é muito curto, retornar áudio completo
          return {
            startTime: 0,
            endTime: duration,
            duration: duration,
          };
        }

        console.log(`🎵 Silêncio detectado:`, {
          original: `0s - ${duration.toFixed(2)}s (${duration.toFixed(2)}s)`,
          trimmed: `${startTime.toFixed(2)}s - ${endTime.toFixed(2)}s (${trimmedDuration.toFixed(2)}s)`,
          removed: {
            start: `${startTime.toFixed(2)}s`,
            end: `${(duration - endTime).toFixed(2)}s`,
          },
        });

        return {
          startTime,
          endTime,
          duration: trimmedDuration,
        };
      } catch (error) {
        console.error('Erro ao detectar silêncio:', error);
        // Relançar: chamador decide como proceder (normalmente, não cachear e tocar sem trim).
        throw error;
      }
    },
    []
  );

  /**
   * Limpar recursos do AudioContext
   */
  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return {
    detectSilence,
    cleanup,
  };
}
