import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTelemetryStore } from '../../features/telemetry/telemetryStore';

export default function DriverDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { drivers } = useTelemetryStore();
  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Localizando piloto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Detalhes</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.mainCard}>
        <Text style={styles.driverNumber}>{driver.driverNumber}</Text>
        <View>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.teamName}>{driver.team}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Posição</Text>
          <Text style={styles.statValue}>P{driver.position}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Volta Atual</Text>
          <Text style={styles.statValue}>{driver.lap}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Gap p/ Líder</Text>
          <Text style={[styles.statValue, { color: '#FFD600' }]}>{driver.gapToLeader}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tempos de Setor (Última Volta)</Text>
      <View style={styles.sectorContainer}>
        <View style={styles.sectorBox}>
          <Text style={styles.sectorLabel}>S1</Text>
          <Text style={styles.sectorTime}>{driver.sector1}</Text>
        </View>
        <View style={styles.sectorBox}>
          <Text style={styles.sectorLabel}>S2</Text>
          <Text style={styles.sectorTime}>{driver.sector2}</Text>
        </View>
        <View style={styles.sectorBox}>
          <Text style={styles.sectorLabel}>S3</Text>
          <Text style={[styles.sectorTime, { color: '#D500F9' }]}>{driver.sector3}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 20, paddingTop: 60 },
  loading: { color: '#FFF', fontSize: 18, textAlign: 'center', marginTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backButton: { padding: 10, backgroundColor: '#1A1A24', borderRadius: 8, borderColor: '#2A2A38', borderWidth: 1 },
  backText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  mainCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A24', padding: 20, borderRadius: 12, borderColor: '#2A2A38', borderWidth: 1, marginBottom: 20 },
  driverNumber: { color: '#FFF', fontSize: 40, fontWeight: '900', marginRight: 20, fontStyle: 'italic' },
  driverName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  teamName: { color: '#888', fontSize: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#1A1A24', padding: 15, borderRadius: 12, borderColor: '#2A2A38', borderWidth: 1, marginHorizontal: 4, alignItems: 'center' },
  statLabel: { color: '#888', fontSize: 12, marginBottom: 5 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 15 },
  sectorContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  sectorBox: { flex: 1, backgroundColor: '#1A1A24', padding: 15, borderRadius: 12, borderColor: '#2A2A38', borderWidth: 1, marginHorizontal: 4, alignItems: 'center' },
  sectorLabel: { color: '#888', fontSize: 14, marginBottom: 5 },
  sectorTime: { color: '#FFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' }
});