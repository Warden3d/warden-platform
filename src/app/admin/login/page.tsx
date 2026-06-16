import { Shield } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warden-carbon p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Shield className="mx-auto mb-3 size-10 text-warden-blue" />
          <h1 className="text-lg font-semibold tracking-wide text-foreground">
            WARDEN Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Panel interno de administración
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
          Autenticación gestionada por Supabase Auth.
        </p>
      </div>
    </div>
  );
}
