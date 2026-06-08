import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router'; 
import { useTelemetryStore } from '../../features/telemetry/telemetryStore';
import { TrackMap } from '../../features/track-map/TrackMap';

export default function LiveTiming() {
  const { drivers, isConnected } = useTelemetryStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Timing</Text>
        <Text style={[styles.status, { color: isConnected ? '#00E676' : '#FF1744' }]}>
          {isConnected ? '● LIVE' : '● OFFLINE'}
        </Text>
      </View>

      <TrackMap />

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link 
            href={{
              pathname: '/driver/[id]',
              params: { id: item.id }
            }} 
            asChild
          >
            <Pressable 
              style={({ pressed }) => [
                styles.driverCard,
                pressed && { opacity: 0.7 } 
              ]}
            >
              <View style={styles.positionContainer}>
                <Text style={styles.position}>{item.position}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={styles.teamName}>{item.team}</Text>
              </View>
              <View style={styles.timingContainer}>
                <Text style={styles.gap}>{item.gapToLeader}</Text>
                <Text style={styles.tyre}>{item.tyreCompound}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  status: { fontSize: 14, fontWeight: 'bold' },
  driverCard: { 
    backgroundColor: '#1A1A24', 
    flexDirection: 'row', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 12, 
    borderColor: '#2A2A38', 
    borderWidth: 1 
  },
  positionContainer: { width: 40, justifyContent: 'center', alignItems: 'center' },
  position: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  driverName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  teamName: { color: '#888', fontSize: 12, marginTop: 2 },
  timingContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  gap: { color: '#FFF', fontSize: 16, fontFamily: 'monospace' },
  tyre: { color: '#FFD600', fontSize: 12, marginTop: 4, fontWeight: 'bold' }
});