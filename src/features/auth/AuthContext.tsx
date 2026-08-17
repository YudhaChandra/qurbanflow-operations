import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useNavigate,
} from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useQurban } from "@/features/qurban/store";
import type { SystemUser } from "@/features/qurban/types";

const AUTH_STORAGE_KEY = "qurbanops_auth_user_email";

type AuthContextValue = {
  currentUser: SystemUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<void>;
  simulateGoogleLogin: (email: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users, usersLoaded, activateUser } = useQurban();
  const navigate = useNavigate();

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    }
    return null;
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAuthEmail, setPendingAuthEmail] = useState<string | null>(null);

  const currentUser = useMemo<SystemUser | null>(() => {
    if (!currentUserEmail) return null;

    const matched = users.find(
      (u) =>
        u.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase(),
    );

    if (!matched || matched.status === "NONAKTIF") return null;

    return matched;
  }, [users, currentUserEmail]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Core business logic after a Google identity is resolved.
   * Returns true when the user may proceed into the app.
   */
  const handleAuthenticateEmail = useCallback(
    (email: string): boolean => {
      setAuthError(null);

      const normalized = email.trim().toLowerCase();

      const matchedUser = users.find(
        (u) => u.email.trim().toLowerCase() === normalized,
      );

      if (!matchedUser) {
        setAuthError(
          "Akun Anda belum terdaftar. Silakan hubungi Administrator.",
        );

        setCurrentUserEmail(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setIsLoading(false);

        return false;
      }

      if (matchedUser.status === "NONAKTIF") {
        setAuthError(
          "Akun Anda telah dinonaktifkan. Silakan hubungi Supervisor.",
        );

        setCurrentUserEmail(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setIsLoading(false);

        return false;
      }

      if (matchedUser.status === "PENDING") {
        // First successful login → automatically activate (Pending → Aktif)
        activateUser(matchedUser.id);
      }

      setCurrentUserEmail(matchedUser.email);
      localStorage.setItem(AUTH_STORAGE_KEY, matchedUser.email);
      setIsLoading(false);

      // Login berhasil → masuk ke dashboard utama
      navigate({ to: "/" });

      return true;
    },
    [users, activateUser, navigate],
  );

  /**
   * Process a Google identity only after the Supabase-backed
   * user list is ready.
   */
  useEffect(() => {
    if (!usersLoaded || !pendingAuthEmail) return;

    const email = pendingAuthEmail;

    setPendingAuthEmail(null);

    handleAuthenticateEmail(email);
  }, [usersLoaded, pendingAuthEmail, handleAuthenticateEmail]);

  /**
   * Listen for Supabase OAuth callback and existing sessions
   * after page reload.
   */
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email) {
          setPendingAuthEmail(session.user.email);
          return;
        }

        setCurrentUserEmail(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);

        if (usersLoaded) {
          setIsLoading(false);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [usersLoaded]);

  /**
   * If users have finished loading and there is no authenticated
   * session, stop the loading state.
   */
  useEffect(() => {
    if (usersLoaded && !pendingAuthEmail && !currentUserEmail) {
      setIsLoading(false);
    }
  }, [usersLoaded, pendingAuthEmail, currentUserEmail]);

  const loginWithGoogle = useCallback(async () => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        console.warn(
          "Supabase Google OAuth not available:",
          error.message,
        );

        setAuthError(
          "Layanan autentikasi tidak tersedia. Pastikan konfigurasi Supabase sudah terpasang.",
        );

        setIsLoading(false);
      }
    } catch {
      setAuthError(
        "Gagal terhubung ke layanan autentikasi. Periksa koneksi internet dan coba lagi.",
      );

      setIsLoading(false);
    }
  }, []);

  /**
   * simulateGoogleLogin — dev/demo helper only.
   * Simulates a resolved Google identity without going through
   * Supabase OAuth.
   */
  const simulateGoogleLogin = useCallback(
    (email: string) => {
      setIsLoading(true);
      setAuthError(null);

      setTimeout(() => {
        if (usersLoaded) {
          handleAuthenticateEmail(email);
        } else {
          setPendingAuthEmail(email);
        }

        setIsLoading(false);
      }, 500);
    },
    [handleAuthenticateEmail, usersLoaded],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }

    setPendingAuthEmail(null);
    setCurrentUserEmail(null);
    setAuthError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      authError,
      clearAuthError,
      loginWithGoogle,
      simulateGoogleLogin,
      logout,
    }),
    [
      currentUser,
      isLoading,
      authError,
      clearAuthError,
      loginWithGoogle,
      simulateGoogleLogin,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}