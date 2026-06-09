import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTelemetryStore } from '../telemetry/telemetryStore';
import { DriverMarker } from './DriverMarker';

const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'McLaren': '#FF8000',
  'Mercedes': '#27F4D2',
  'Aston Martin': '#229971'
};

export function TrackMap() {
  const { drivers } = useTelemetryStore();
  const [trackPoints, setTrackPoints] = useState("");

  useEffect(() => {
    // Pede o formato da pista gerado pela telemetria do backend
    fetch('http://localhost:8000/api/track')
      .then(res => res.json())
      .then(data => setTrackPoints(data.points))
      .catch(err => console.log(err));
  }, []);

  const mapWidth = 340;
  const mapHeight = 220;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interlagos (Autódromo José Carlos Pace)</Text>
      <View style={styles.mapContainer}>
        <Svg width={mapWidth} height={mapHeight}>
          
          {/* Desenha o traçado real da pista em SVG */}
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
          
          {drivers.map((driver) => (
            <DriverMarker
              key={driver.id}
              driver={driver}
              teamColor={TEAM_COLORS[driver.team] || '#FFF'}
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  mapContainer: { backgroundColor: '#1A1A24', borderRadius: 12, borderColor: '#2A2A38', borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }
});