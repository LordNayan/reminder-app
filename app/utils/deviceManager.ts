import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'device_id';
const TOKEN_KEY = 'auth_token';
const PAIRED_WITH_KEY = 'paired_with';

export async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export async function storeAuth(token: string, pairedWith?: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  if (pairedWith) await AsyncStorage.setItem(PAIRED_WITH_KEY, pairedWith);
}

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getPairedWith() {
  return AsyncStorage.getItem(PAIRED_WITH_KEY);
}
