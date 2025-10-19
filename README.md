# Proximity-Based Habit Reminder App

A minimal React Native + Node.js application that sends WhatsApp habit reminders when two paired phones detect each other via Bluetooth Low Energy (BLE).

## Stack

- Mobile: Expo (React Native, TypeScript)
- Backend: Node.js + Express + TypeScript
- Database: MongoDB (Mongoose)
- BLE: `react-native-ble-plx`
- WhatsApp: Cloud API (Facebook Graph)

## Features

- Intermittent BLE scanning (5s every 30s) using RSSI threshold (-70) for proximity
- Device pairing via JWT-authenticated endpoint
- Cooldown (default 30 minutes) between reminders per device pair
- Random reminder selection from stored messages
- Sends WhatsApp message to both paired devices: `💫 Reminder: <text>`

## Backend Setup

1. Copy `.env.example` to `.env` and fill values:
```
MONGODB_URI=...
WHATSAPP_TOKEN=...
PHONE_NUMBER_ID=...
JWT_SECRET=...
COOLDOWN_MINUTES=30
```
2. Install dependencies:
```
cd server
npm install
```
3. Run dev server:
```
npm run dev
```

## Mobile App Setup

1. Install dependencies:
```
cd app
npm install
```
2. Start Expo:
```
npm start
```
3. Provide env var `EXPO_PUBLIC_API_BASE` if backend not on default.

### Using a Development Client (BLE support)
Expo Go does not include the native BLE module. Build a development client:

Local (Android/iOS):
```
cd app
npm run android    # or npm run ios
```
Cloud (EAS dev build):
```
cd app
eas build --profile dev --platform android
eas build --profile dev --platform ios
```
After installation, open the client and run `npm start` (or use QR) to load JS with BLE available.

If you see `react-native-ble-plx not available`, ensure you are in dev client (not Expo Go) and permissions are in `app.json`.

## API Endpoints

- `POST /api/pair` Body: `{ deviceId, phoneNumber, targetDeviceId? }` -> `{ token, deviceId, pairedWith }`
- `POST /api/detection` Auth: Bearer token Body: `{ nearbyDeviceId, rssi }`
- `GET /api/reminders` -> `[ { id, text } ]`
- `POST /api/reminders` Auth: Bearer token Body: `{ text }`

## Cooldown Logic
Each device pair has a record in `Detection` storing last detection timestamp. If new detection within `COOLDOWN_MINUTES`, notification skipped.

## BLE Considerations
- Scans for 5 seconds then pauses 25 seconds.
- Uses RSSI >= -70 as threshold.
- Only triggers detection when scanned device matches stored `pairedWith` device ID.

## WhatsApp Cloud API
Ensure you have a Meta app configured and phone number ID + permanent token with messages permission.

## Future Improvements
- Proper permission management for BLE (Android 12+, iOS)
- Persist paired device ID list rather than single value
- Add retry/backoff on WhatsApp failures
- Add Jest tests and E2E pairing flow test
- Secure rate limiting & audit logging

## License
MIT
