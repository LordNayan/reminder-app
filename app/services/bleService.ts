import { BleManager, Device } from 'react-native-ble-plx';
import { Platform } from 'react-native';

const SCAN_INTERVAL_MS = 30000; // every 30s
const SCAN_DURATION_MS = 5000; // scan for 5s
const RSSI_THRESHOLD = -70;

const manager = new BleManager();

let scanning = false;
let listeners: ((deviceId: string, rssi: number) => void)[] = [];

export function subscribe(callback: (deviceId: string, rssi: number) => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

function notify(deviceId: string, rssi: number) {
  listeners.forEach(cb => cb(deviceId, rssi));
}

function startCycle() {
  if (scanning) return;
  scanning = true;
  manager.startDeviceScan(null, { allowDuplicates: false }, (error, device: Device | null) => {
    if (error) {
      console.warn('BLE scan error', error.message);
      return;
    }
    if (device?.id && typeof device.rssi === 'number' && device.rssi >= RSSI_THRESHOLD) {
      notify(device.id, device.rssi);
    }
  });
  setTimeout(() => {
    manager.stopDeviceScan();
    scanning = false;
  }, SCAN_DURATION_MS);
}

export function initBleLoop() {
  if (Platform.OS === 'android') {
    // Android specific permission requests could be added here
  }
  startCycle();
  setInterval(startCycle, SCAN_INTERVAL_MS);
}
