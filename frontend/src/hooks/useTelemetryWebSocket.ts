import { useEffect } from 'react';
import { useTelemetryStore } from '../features/telemetry/telemetryStore';
import { TelemetryUpdate } from '../types/telemetry';

const WS_URL = 'ws://localhost:8000/ws/race'; 

export const useTelemetryWebSocket = () => {
  const { setDrivers, setConnected } = useTelemetryStore();

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('🏁 Conectado ao WebSocket da F1');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: TelemetryUpdate = JSON.parse(event.data);
          if (message.event === 'telemetry_update') {
            setDrivers(message.data);
          }
        } catch (error) {
          console.error('Erro ao processar pacote:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔴 Desconectado. Reconectando em 2s...');
        setConnected(false);
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []); 
};