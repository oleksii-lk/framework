/**
 * useAuth hook — manages authentication state.
 *
 * Responsibilities:
 * - Store/retrieve the JWT from sessionStorage
 * - Expose login / logout actions
 * - Track loading and error states
 *
 * Using sessionStorage (not localStorage) means the token is cleared
 * when the browser tab is closed
 */

import { useState, useCallback } from "react";
import { login as apiLogin, ApiError } from "../api/auth";

const TOKEN_KEY = "auth_token";

export interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiLogin(username, password);
      sessionStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setError(null);
  }, []);

  return {
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: token !== null,
  };
}
