// Arquivo: frontend/src/features/track-map/TrackMap.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import { useTelemetryStore } from '../telemetry/telemetryStore';
import { DriverMarker } from './DriverMarker';

// Dicionário de cores para as equipes do seu projeto
const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'McLaren': '#FF8000',
  'Mercedes': '#27F4D2'
};

export function TrackMap() {
  const { drivers } = useTelemetryStore();

  // Dimensões relativas do nosso circuito simulado
  const mapWidth = 340;
  const mapHeight = 220;
  const centerX = mapWidth / 2;
  const centerY = mapHeight / 2;
  const radiusX = 140;
  const radiusY = 80;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Map</Text>
      <View style={styles.mapContainer}>
        <Svg width={mapWidth} height={mapHeight}>
          {/* Desenho da pista (Circuito Oval) */}
          <Ellipse
            cx={centerX}
            cy={centerY}
            rx={radiusX}
            ry={radiusY}
            stroke="#2A2A38"
            strokeWidth="12"
            fill="none"
          />
          
          {/* Renderiza um marcador animado para cada piloto */}
          {drivers.map((driver) => (
            <DriverMarker
              key={driver.id}
              driver={driver}
              centerX={centerX}
              centerY={centerY}
              radiusX={radiusX}
              radiusY={radiusY}
              teamColor={TEAM_COLORS[driver.team] || '#FFF'}
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mapContainer: {
    backgroundColor: '#1A1A24',
    borderRadius: 12,
    borderColor: '#2A2A38',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }
});