import { useEffect, useRef } from 'react';
import { useTelemetryStore } from '../features/telemetry/telemetryStore';
import { TelemetryUpdate } from '../types/telemetry';

// ⚠️ ATENÇÃO AO IP:
// Se for rodar no navegador, use 'localhost'.
// Se for rodar no Emulador Android, mude para '10.0.2.2'.
// Se for rodar no seu celular físico (Expo Go), coloque o seu IP local (ex: '192.168.1.15').
const WS_URL = 'ws://localhost:8000/ws/race'; 

export const useTelemetryWebSocket = () => {
  const { setDrivers, setConnected } = useTelemetryStore();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('🏁 Conectado ao WebSocket da F1');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: TelemetryUpdate = JSON.parse(event.data);
        if (message.event === 'telemetry_update') {
          setDrivers(message.data);
        }
      } catch (error) {
        console.error('Erro ao processar pacote de telemetria:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('🔴 Desconectado do WebSocket');
      setConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, []);
};