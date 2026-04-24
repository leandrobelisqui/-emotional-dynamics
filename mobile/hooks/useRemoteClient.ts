import { useCallback, useEffect, useRef, useState } from 'react';
import { RemoteCommand, RemoteState } from '../../src/remote/types';

/**
 * Conecta no servidor WebSocket do desktop, mantém o RemoteState em memória
 * e expõe um `sendCommand` pro celular disparar ações.
 *
 * Reconecta com backoff exponencial se a conexão cair.
 */
export function useRemoteClient() {
  const [state, setState] = useState<RemoteState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectDelayRef = useRef<number>(1000); // 1s → 2s → 4s → 8s → cap 8s

  const connect = useCallback(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${proto}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectDelayRef.current = 1000; // resetar backoff ao reconectar
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'state' && msg.payload) {
            setState(msg.payload as RemoteState);
          }
        } catch (e) {
          console.error('Invalid remote message:', e);
        }
      };

      ws.onerror = () => {
        // onclose também vai disparar — deixa reconexão ali
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        // Reconectar com backoff
        const delay = Math.min(reconnectDelayRef.current, 8000);
        reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 8000);
        reconnectTimerRef.current = window.setTimeout(connect, delay);
      };
    } catch (e) {
      console.error('Failed to connect WS:', e);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null; // evita re-trigger de reconexão no unmount
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendCommand = useCallback((cmd: RemoteCommand) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('Remote: não conectado, comando descartado:', cmd);
      return;
    }
    try {
      ws.send(JSON.stringify({ type: 'command', payload: cmd }));
    } catch (e) {
      console.error('Failed to send command:', e);
    }
  }, []);

  return { state, isConnected, sendCommand };
}
