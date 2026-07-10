import { create } from "zustand";
import { fetchCurrentUserRequest, loginRequest, logoutRequest, registerRequest } from "../features/auth/api/authApi";

const AUTH_STORAGE_KEY = "focus-ai-auth";

const readPersistedAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const persisted = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return persisted ? JSON.parse(persisted) : null;
  } catch {
    return null;
  }
};

const persistAuth = (authState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
};

const clearPersistedAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const persistedAuth = readPersistedAuth();

const applyAuthenticatedState = (set, authState) => {
  persistAuth(authState);
  set({
    user: authState.user,
    token: authState.token,
    isLoading: false,
    isInitializing: false,
    error: null
  });
};

const clearAuthState = (set) => {
  clearPersistedAuth();
  set({
    user: null,
    token: null,
    isLoading: false,
    isInitializing: false,
    error: null
  });
};

export const useAuthStore = create((set, get) => ({
  user: persistedAuth?.user || null,
  token: persistedAuth?.token || null,
  isLoading: false,
  isInitializing: false,
  error: null,
  async initialize() {
    const token = get().token;

    if (!token) {
      clearAuthState(set);
      return null;
    }

    set({ isInitializing: true, error: null });

    try {
      const result = await fetchCurrentUserRequest(token);
      applyAuthenticatedState(set, { token, user: result.user });
      return result.user;
    } catch (error) {
      clearAuthState(set);
      set({ error: error.message });
      throw error;
    }
  },
  async register(payload) {
    set({ isLoading: true, error: null });

    try {
      const result = await registerRequest(payload);
      applyAuthenticatedState(set, { token: result.token, user: result.user });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  async login(payload) {
    set({ isLoading: true, error: null });

    try {
      const result = await loginRequest(payload);
      applyAuthenticatedState(set, { token: result.token, user: result.user });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  clearError() {
    set({ error: null });
  },
  async logout() {
    const token = get().token;

    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch {
      
    } finally {
      clearAuthState(set);
    }
  }
}));

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthIsInitializing = () => useAuthStore((state) => state.isInitializing);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useAuthRegister = () => useAuthStore((state) => state.register);
export const useAuthLogin = () => useAuthStore((state) => state.login);
export const useAuthInitialize = () => useAuthStore((state) => state.initialize);
export const useAuthClearError = () => useAuthStore((state) => state.clearError);
export const useAuthLogout = () => useAuthStore((state) => state.logout);
