import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_PORT = 5000;

// Manual override for cases auto-detection can't handle (e.g. tunnel mode,
// a backend deployed elsewhere, or a device on a different subnet).
// Set this to something like 'http://192.168.1.23:5000/api' to force it.
const MANUAL_API_URL = null;

const getBaseUrl = () => {
  if (MANUAL_API_URL) return MANUAL_API_URL;

  // When running via `expo start`, Expo Go connects to the dev server over
  // your machine's LAN IP. Constants exposes that same host at runtime, so
  // we reuse it to reach the backend on the same machine — this is what
  // makes the API reachable from a *physical* iOS/Android device running
  // Expo Go, not just the Android emulator (which needs 10.0.2.2).
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:${API_PORT}/api`;
  }

  // Fallbacks: Android emulator uses 10.0.2.2 to reach the host machine's
  // localhost; iOS simulator can reach localhost directly.
  return `http://10.0.2.2:${API_PORT}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
