"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { loginAction } from "@/lib/actions/login";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAction(email, password);
    if (result) {
      setError(result);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="rounded-sm border border-border bg-warden-surface p-4">
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium text-muted-foreground"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@warden.dev"
              className="pl-8"
              autoFocus
              required
            />
          </div>
        </div>
        <div className="rounded-sm border border-border bg-warden-surface p-4">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-medium text-muted-foreground"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-8"
              required
            />
          </div>
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verificando..." : "Acceder"}
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        Acceso restringido al equipo de WARDEN.
      </p>
    </form>
  );
}
