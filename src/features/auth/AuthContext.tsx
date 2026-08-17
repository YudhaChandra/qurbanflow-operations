import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  const { users, activateUser } = useQurban();

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    }
    return null;
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useMemo<SystemUser | null>(() => {
    if (!currentUserEmail) {
      // Default to Super Admin while no session is active (pre-auth sprint)
      return users.find((u) => u.role === "SUPER_ADMIN") ?? users[0] ?? null;
    }
    const matched = users.find(
      (u) => u.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase(),
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
        return false;
      }

      if (matchedUser.status === "NONAKTIF") {
        setAuthError(
          "Akun Anda telah dinonaktifkan. Silakan hubungi Supervisor.",
        );
        setCurrentUserEmail(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return false;
      }

      if (matchedUser.status === "PENDING") {
        // First successful login → automatically activate (Pending → Aktif)
        activateUser(matchedUser.id);
      }

      setCurrentUserEmail(matchedUser.email);
      localStorage.setItem(AUTH_STORAGE_KEY, matchedUser.email);
      return true;
    },
    [users, activateUser],
  );

  // Listen for Supabase OAuth callback (real Google sign-in flow)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.email) {
          handleAuthenticateEmail(session.user.email);
        }
        setIsLoading(false);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [handleAuthenticateEmail]);

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
        // Supabase not configured yet (dev/staging without real credentials)
        console.warn("Supabase Google OAuth not available:", error.message);
        setAuthError(
          "Layanan autentikasi tidak tersedia. Pastikan konfigurasi Supabase sudah terpasang.",
        );
        setIsLoading(false);
      }
      // If successful, the page will redirect — isLoading stays true intentionally
    } catch {
      setAuthError(
        "Gagal terhubung ke layanan autentikasi. Periksa koneksi internet dan coba lagi.",
      );
      setIsLoading(false);
    }
  }, []);

  /**
   * simulateGoogleLogin — dev/demo helper only.
   * Simulates a resolved Google identity without going through Supabase OAuth.
   */
  const simulateGoogleLogin = useCallback(
    (email: string) => {
      setIsLoading(true);
      setAuthError(null);
      // Small delay to surface the loading state visually
      setTimeout(() => {
        handleAuthenticateEmail(email);
        setIsLoading(false);
      }, 500);
    },
    [handleAuthenticateEmail],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
