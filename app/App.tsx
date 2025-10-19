import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import PairingScreen from './components/PairingScreen';
import ProximityDetector from './components/ProximityDetector';
import { useState } from 'react';

export default function App() {
  const [paired, setPaired] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Proximity Reminder</Text>
      {paired ? <ProximityDetector /> : <PairingScreen onPaired={() => setPaired(true)} />}
    </SafeAreaView>
  );
}
