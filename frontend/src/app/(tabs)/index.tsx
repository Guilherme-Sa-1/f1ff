import { View, Text, StyleSheet } from 'react-native';

export default function HomeDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao F1 Live</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Próxima Corrida</Text>
        <Text style={styles.cardInfo}>Carregando dados da temporada...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F', padding: 20, paddingTop: 60 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#1A1A24', padding: 20, borderRadius: 12, borderColor: '#2A2A38', borderWidth: 1 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardInfo: { color: '#888', fontSize: 14 }
});