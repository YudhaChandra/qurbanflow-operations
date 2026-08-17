import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Masuk — QurbanOps" },
      {
        name: "description",
        content:
          "Masuk ke QurbanOps untuk mengelola operasional kurban: hewan, tim, dan alur pelaksanaan dalam satu tempat.",
      },
    ],
  }),
});

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginPage() {
  const { loginWithGoogle, simulateGoogleLogin, isLoading, authError, clearAuthError } =
    useAuth();

  // Dev-only simulation panel
  const [devEmail, setDevEmail] = useState("");
  const [showDevPanel, setShowDevPanel] = useState(false);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleDevLogin = () => {
    if (!devEmail.trim()) return;
    simulateGoogleLogin(devEmail.trim());
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo & branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold tracking-tight text-primary-foreground shadow-sm">
            QO
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              QurbanOps
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Sistem Manajemen Operasional Kurban
            </p>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            Kelola data hewan, tim operasional, dan alur pelaksanaan kurban dalam satu
            tempat.
          </p>
        </div>

        {/* Error alert */}
        {authError ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              {authError.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}

        {/* Primary login action */}
        <Button
          id="btn-login-google"
          className="w-full gap-2.5"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <GoogleIcon />
          )}
          {isLoading ? "Menghubungkan..." : "Masuk dengan Google"}
        </Button>

        <p className="mt-4 text-center text-[12px] text-muted-foreground">
          Hanya akun yang telah terdaftar oleh Administrator yang dapat masuk.
        </p>

        {/* Dev simulation panel — hidden by default */}
        <div className="mt-8 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => {
              setShowDevPanel((p) => !p);
              clearAuthError();
            }}
            className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {showDevPanel ? "Sembunyikan" : "Mode pengembang (simulasi login)"}
          </button>

          {showDevPanel ? (
            <div className="mt-3 space-y-2">
              <Label htmlFor="dev-email" className="text-xs text-muted-foreground">
                Email akun (dari User Management)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="dev-email"
                  type="email"
                  placeholder="pengguna@gmail.com"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDevLogin()}
                  className="h-8 text-xs"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDevLogin}
                  disabled={isLoading || !devEmail.trim()}
                  className="h-8 shrink-0 text-xs"
                >
                  {isLoading ? <Loader2 className="size-3 animate-spin" /> : "Login"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Simulasi resolusi identitas Google tanpa OAuth. Hanya untuk pengembangan.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
