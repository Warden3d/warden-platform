"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function loginAction(
  email: string,
  password: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return "Supabase no está configurado. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en las variables de entorno.";
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error.message === "Invalid login credentials"
      ? "Email o contraseña incorrectos"
      : error.message;
  }

  redirect("/admin");
}
