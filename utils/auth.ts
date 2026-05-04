import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

const getApiBaseUrl = () => {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const hostUri = "192.168.1.105"; // (Constants.expoConfig as { hostUri?: string } | null | undefined)?.hostUri;
  const host = hostUri?.split(":")[0];

  if (host) {
    return `http://${host}:8000/api`;
  }

  return "http://127.0.0.1:8000/api";
};

export const AUTH_TOKEN_STORAGE_KEY = "linked.auth.token";
export const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const authHeader = config.headers?.Authorization;

  if (authHeader) {
    return config;
  }

  const token = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setApiToken(null);
    }

    return Promise.reject(error);
  },
);

export const setApiToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export type AuthUser = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: "patient" | "doctor" | "center";
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  patient?: Record<string, unknown> | null;
  doctor?: Record<string, unknown> | null;
  center?: Record<string, unknown> | null;
};

export type AuthResponse = {
  token: string;
  token_type: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};
