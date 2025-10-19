import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
  subscribe,
  initBleLoop,
  isBleAvailable,
  getBleInitError,
} from "../services/bleService";
import { getAuthToken, getPairedWith } from '../utils/deviceManager';
import { sendDetection } from '../services/apiService';

export default function ProximityDetector() {
  const [lastEvent, setLastEvent] = useState<string>('Waiting for detection...');
  const bleReady = isBleAvailable();
  const bleError = getBleInitError();

  useEffect(() => {
    initBleLoop();
    const unsub = subscribe(async (deviceId, rssi) => {
      const pairedWith = await getPairedWith();
      if (!pairedWith || pairedWith !== deviceId) return; // only react to paired device
      const token = await getAuthToken();
      if (!token) return;
      const resp = await sendDetection(token, { nearbyDeviceId: deviceId, rssi });
      if (resp.sent) setLastEvent(`Sent reminder: ${resp.reminder}`);
      else if (resp.skipped) setLastEvent(`Skipped: ${resp.reason}`);
      else setLastEvent('No reminder available');
    });
    return () => unsub();
  }, []);

  return (
    <View>
      <Text style={{ marginBottom: 8 }}>
        Proximity detector active. BLE available: {bleReady ? "yes" : "no"}
      </Text>
      {!bleReady && bleError && (
        <Text style={{ color: "red", marginBottom: 8 }}>
          BLE error: {bleError}
        </Text>
      )}
      <Text>{lastEvent}</Text>
    </View>
  );
}
