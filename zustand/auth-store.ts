import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { AUTH_TOKEN_STORAGE_KEY, AuthResponse, AuthUser, MeResponse, api, setApiToken } from '@/utils/auth';

type RegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  address?: string;
  city?: string;
  medical_notes?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  role?: 'patient' | 'doctor' | 'center';
};

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  error: string | null;
  hydrate: () => Promise<AuthUser | null>;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  registerPatient: (payload: RegisterPayload) => Promise<AuthUser>;
  registerDoctor: (payload: RegisterPayload) => Promise<AuthUser>;
  registerCenter: (payload: RegisterPayload) => Promise<AuthUser>;
  fetchMe: () => Promise<AuthUser>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    const firstFieldError = responseData?.errors
      ? Object.values(responseData.errors)[0]?.[0]
      : undefined;

    return firstFieldError || responseData?.message || 'حدث خطأ أثناء المصادقة';
  }

  return 'حدث خطأ غير متوقع';
};

const persistSession = async (token: string, user: AuthUser) => {
  setApiToken(token);
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  return user;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isBootstrapping: true,
  error: null,

  clearError: () => set({ error: null }),

  setUser: user => set({ user }),

  hydrate: async () => {
    set({ isBootstrapping: true, error: null });

    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      if (!token) {
        setApiToken(null);
        set({ token: null, user: null, isBootstrapping: false });
        return null;
      }

      setApiToken(token);
      set({ token });

      const user = await get().fetchMe();
      set({ user, isBootstrapping: false });
      return user;
    } catch {
      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setApiToken(null);
      set({ token: null, user: null, isBootstrapping: false, error: null });
      return null;
    }
  },

  login: async ({ email, password, role }) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
        role,
        device_name: 'linked-app',
      });

      await persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  registerPatient: async payload => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        ...payload,
        device_name: 'linked-app',
      });

      await persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  registerDoctor: async payload => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        ...payload,
        role: 'doctor',
        device_name: 'linked-app',
      });

      await persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  registerCenter: async payload => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        ...payload,
        role: 'center',
        device_name: 'linked-app',
      });

      await persistSession(data.token, data.user);
      set({ user: data.user, token: data.token, isLoading: false });
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  fetchMe: async () => {
    const { data } = await api.get<MeResponse>('/auth/me');
    set({ user: data.user });
    return data.user;
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post('/auth/logout');
    } catch {
      // Clear the local session even if the token is no longer valid remotely.
    } finally {
      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setApiToken(null);
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
