// Arquivo: frontend/src/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useTelemetryWebSocket } from '../hooks/useTelemetryWebSocket'; // <-- Adicione aqui

export default function RootLayout() {
  useTelemetryWebSocket(); 

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}