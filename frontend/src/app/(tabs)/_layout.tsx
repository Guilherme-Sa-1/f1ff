import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A24',
          borderTopColor: '#2A2A38',
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#00E676',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live Timing',
        }}
      />
    </Tabs>
  );
}