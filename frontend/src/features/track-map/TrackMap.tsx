// Arquivo: frontend/src/features/track-map/TrackMap.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Polyline, Line, Circle } from 'react-native-svg';
import { useTelemetryStore } from '../telemetry/telemetryStore';
import { DriverMarker } from './DriverMarker';
import { API_URL } from '../../config/api';

const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'McLaren': '#FF8000',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971'
};

export function TrackMap() {
  // Seleção direta do estado garante re-render imediato quando a referência do array muda no Zustand
  const drivers = useTelemetryStore((state) => state.drivers);
  const [trackPoints, setTrackPoints] = useState<string>("");
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    console.log('[TrackMap] Fetching track layout from:', `${API_URL}/api/track`);
    
    fetch(`${API_URL}/api/track`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.points) {
          setTrackPoints(data.points);
          
          // O primeiro ponto do traçado enviado pelo FastF1 corresponde à Linha de Largada/Chegada
          const pointsArray = data.points.split(' ');
          if (pointsArray.length > 0) {
            const firstPoint = pointsArray[0].split(',');
            if (firstPoint.length === 2) {
              setStartPoint({
                x: parseFloat(firstPoint[0]),
                y: parseFloat(firstPoint[1]),
              });
            }
          }
        }
      })
      .catch((err) => console.error('[TrackMap] Error fetching track layout:', err));
  }, []);

  const mapWidth = 340;
  const mapHeight = 220;

  console.log('[TrackMap] Rendering track with drivers count:', drivers.length);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interlagos (Autódromo José Carlos Pace)</Text>
      <View style={styles.mapContainer}>
        <Svg width={mapWidth} height={mapHeight}>
          
          {/* Desenha a silhueta real da pista via Polyline SVG */}
          {trackPoints ? (
            <Polyline
              points={trackPoints}
              stroke="#2A2A38"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Marcador Visual de Onde Fica a Linha de Chegada / Volta */}
          {startPoint != null && (
            <>
              <Line
                x1={startPoint.x - 12}
                y1={startPoint.y - 12}
                x2={startPoint.x + 12}
                y2={startPoint.y + 12}
                stroke="#FFD600"
                strokeWidth="4"
              />
              <Circle cx={startPoint.x} cy={startPoint.y} r="4" fill="#FFF" />
            </>
          )}
          
          {/* Renderização Dinâmica dos Carros */}
          {drivers.map((driver) => {
            // Garantia absoluta de que se a coordenada for zero (0), ela ainda será renderizada
            if (driver.x == null || driver.y == null) {
              return null;
            }

            return (
              <DriverMarker
                key={driver.id}
                driver={driver}
                teamColor={TEAM_COLORS[driver.team] || '#FFF'}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  mapContainer: { 
    backgroundColor: '#1A1A24', 
    borderRadius: 12, 
    borderColor: '#2A2A38', 
    borderWidth: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 10 
  }
});