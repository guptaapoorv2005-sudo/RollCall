import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/auth.service";
import {
  clearAuthSession,
  getStoredSession,
  persistAuthSession,
} from "../utils/storage";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [{ token, user }, setSession] = useState(() => getStoredSession());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthSession();
    setSession({ token: null, user: null });
  }, []);

  useEffect(() => {
    const syncUnauthorizedState = () => {
      clearSession();
    };

    window.addEventListener("attendify:unauthorized", syncUnauthorizedState);
    return () => {
      window.removeEventListener("attendify:unauthorized", syncUnauthorizedState);
    };
  }, [clearSession]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      if (user) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        persistAuthSession({
          token,
          user: currentUser,
        });

        setSession({ token, user: currentUser });
      } catch {
        clearSession();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [clearSession, token, user]);

  const login = useCallback(async (credentials) => {
    const session = await authService.login(credentials);
    persistAuthSession(session);
    setSession(session);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Network failures should not block local logout.
    }

    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      clearSession,
    }),
    [clearSession, isBootstrapping, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
