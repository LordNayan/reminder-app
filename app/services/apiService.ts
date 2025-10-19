const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000/api';

export async function pairDevice(payload: { deviceId: string; phoneNumber: string; targetDeviceId?: string }) {
  const resp = await fetch(`${API_BASE}/pair`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw new Error('Pairing failed');
  return resp.json();
}

export async function sendDetection(token: string, payload: { nearbyDeviceId: string; rssi: number }) {
  const resp = await fetch(`${API_BASE}/detection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  return resp.json();
}

export async function listReminders() {
  const resp = await fetch(`${API_BASE}/reminders`);
  return resp.json();
}
