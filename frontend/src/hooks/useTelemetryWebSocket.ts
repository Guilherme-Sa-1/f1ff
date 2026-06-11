import { useEffect, useRef } from 'react';
import { useTelemetryStore } from '../features/telemetry/telemetryStore';
import { TelemetryUpdate } from '../types/telemetry';
import { WS_URL } from '../config/api';

export const useTelemetryWebSocket = () => {
  const { setDrivers, setConnected } = useTelemetryStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(2000); // Inicia com 2s

  useEffect(() => {
    const connect = () => {
      // Evita múltiplas conexões simultâneas
      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
        return;
      }

      console.log(`[WebSocket] Connecting to ${WS_URL}...`);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setConnected(true);
        backoffRef.current = 2000; // Reseta o backoff após sucesso
      };

      ws.onmessage = (event) => {
        try {
          const message: TelemetryUpdate = JSON.parse(event.data);
          if (message.event === 'telemetry_update') {
            setDrivers(message.data);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setConnected(false);
        scheduleReconnect();
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error encountered');
        ws.close(); // Força o onclose para iniciar a reconexão
      };
    };

    const scheduleReconnect = () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      
      console.log(`[WebSocket] Reconnecting in ${backoffRef.current / 1000}s...`);
      reconnectTimeoutRef.current = setTimeout(() => {
        backoffRef.current = Math.min(backoffRef.current * 2, 30000); // Exponential backoff (max 30s)
        connect();
      }, backoffRef.current);
    };

    // Inicia a primeira conexão
    connect();

    // Cleanup imaculado ao desmontar o app (evita memory leaks)
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Previne loop de reconexão na desmontagem
        wsRef.current.close();
      }
    };
  }, []);
};