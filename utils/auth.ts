import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import axios from "axios";

const getApiBaseUrl = () => {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  // Quick toggle: "192.168.1.105" or "b-linked.jervi.dev"
  const host: string = "192.168.1.105"; 

  if (host === "b-linked.jervi.dev") {
    return `https://${host}/api`;
  }

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
  profile_complete: boolean;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  patient?: PatientProfile | null;
  doctor?: DoctorProfile | null;
  center?: Record<string, unknown> | null;
};

export type PatientProfile = {
  id: number;
  user_id: number;
  date_of_birth: string | null;
  gender: "male" | "female" | null;
  address: string | null;
  city: string | null;
  medical_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DoctorQualification = {
  id: number;
  doctor_id: number;
  title: string;
  institution: string | null;
  year: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DoctorSchedule = {
  id: number;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
};

export type DoctorTimeSlot = {
  id: number;
  doctor_id: number;
  slot_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type DoctorProfile = {
  id: number;
  user_id: number;
  specialty_id: number | null;
  moderation_status: string;
  license_number: string | null;
  years_experience: string | null;
  phone_public: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  rating: string | number;
  reviews_count: number;
  is_available: boolean;
  created_at: string | null;
  updated_at: string | null;
  qualifications?: DoctorQualification[] | null;
  schedules?: DoctorSchedule[] | null;
  time_slots?: DoctorTimeSlot[] | null;
  speciality?: Record<string, unknown> | null;
};

export type AuthResponse = {
  token: string;
  token_type: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};
