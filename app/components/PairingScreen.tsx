import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { getOrCreateDeviceId, storeAuth } from '../utils/deviceManager';
import { pairDevice } from '../services/apiService';

interface Props { onPaired: () => void }

export default function PairingScreen({ onPaired }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [targetDeviceId, setTargetDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePair() {
    setLoading(true);
    setError(null);
    try {
      const deviceId = await getOrCreateDeviceId();
      const resp = await pairDevice({ deviceId, phoneNumber, targetDeviceId: targetDeviceId || undefined });
      await storeAuth(resp.token, resp.pairedWith);
      onPaired();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={{ marginBottom: 8 }}>Your Phone Number (WhatsApp enabled):</Text>
      <TextInput value={phoneNumber} onChangeText={setPhoneNumber} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} placeholder="+15551234567" />
      <Text style={{ marginBottom: 8 }}>Target Device ID (optional to pair now):</Text>
      <TextInput value={targetDeviceId} onChangeText={setTargetDeviceId} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} placeholder="device-uuid" />
      {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
      <Button title={loading ? 'Pairing...' : 'Pair'} onPress={handlePair} disabled={loading || !phoneNumber} />
    </View>
  );
}
