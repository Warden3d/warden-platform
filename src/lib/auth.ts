/**
 * WARDEN Auth — Supabase-based authentication helpers.
 *
 * Session is managed by Supabase Auth via @supabase/ssr cookies.
 * Admin authorization is checked against the user_roles table.
 */

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

/**
 * Returns the current authenticated user, or null if not logged in.
 * Cached per-request to avoid multiple DB calls.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

/**
 * Returns true if the current user has the "admin" role.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  return data !== null;
}

/**
 * Requires admin role. Throws if user is not an admin.
 * Use in server components / actions that need admin access.
 */
export async function requireAdmin(): Promise<void> {
  const ok = await isAdmin();
  if (!ok) {
    throw new Error("Acceso denegado: se requiere rol de administrador.");
  }
}
