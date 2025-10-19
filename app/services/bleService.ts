import { Platform } from "react-native";

// Lazy import ble-plx to avoid crashing in Expo Go if native module unavailable
let BleManager: any; // type fallback
let bleModuleLoaded = false;
let bleInitError: string | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("react-native-ble-plx");
  BleManager = mod.BleManager;
  bleModuleLoaded = !!BleManager;
} catch (e) {
  console.warn(
    "[BLE] react-native-ble-plx not available in this runtime:",
    (e as Error).message
  );
}

const SCAN_INTERVAL_MS = 30000; // every 30s
const SCAN_DURATION_MS = 5000; // scan for 5s
const RSSI_THRESHOLD = -70;

let manager: any = null;
if (bleModuleLoaded) {
  try {
    manager = new BleManager();
  } catch (e: any) {
    bleInitError = e?.message || "Unknown BLE init error";
    console.warn("[BLE] Failed to construct BleManager:", bleInitError);
    manager = null;
    bleModuleLoaded = false;
  }
}

let scanning = false;
let listeners: ((deviceId: string, rssi: number) => void)[] = [];

export function subscribe(callback: (deviceId: string, rssi: number) => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function notify(deviceId: string, rssi: number) {
  listeners.forEach((cb) => cb(deviceId, rssi));
}

function startCycle() {
  if (scanning) return;
  scanning = true;
  if (!manager) {
    console.warn("[BLE] Manager not initialized; skipping scan cycle");
    return;
  }
  manager.startDeviceScan(
    null,
    { allowDuplicates: false },
    (error: any, device: any) => {
      if (error) {
        console.warn("BLE scan error", error.message);
        return;
      }
      if (
        device?.id &&
        typeof device.rssi === "number" &&
        device.rssi >= RSSI_THRESHOLD
      ) {
        notify(device.id, device.rssi);
      }
    }
  );
  setTimeout(() => {
    if (manager) manager.stopDeviceScan();
    scanning = false;
  }, SCAN_DURATION_MS);
}

export function initBleLoop() {
  if (Platform.OS === "android") {
    // Android specific permission requests could be added here
  }
  if (!manager) {
    console.warn("[BLE] BLE loop disabled (no native module)");
    return;
  }
  startCycle();
  setInterval(startCycle, SCAN_INTERVAL_MS);
}

export function isBleAvailable() {
  return bleModuleLoaded;
}
export function getBleInitError() {
  return bleInitError;
}
