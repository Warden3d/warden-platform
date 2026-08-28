import type { Drop } from "@/types/warden";

/**
 * Estado efectivo de presentación de un Drop (R053A).
 *
 * Un Drop solo se presenta como "live" (activo) si TODAS las condiciones
 * se cumplen:
 *   - status === "live";
 *   - starts_at <= now < ends_at;
 *   - precio válido (price > 0).
 *
 * La derivación se hace en la capa de aplicación: no se modifica la DB
 * al cargar una página. Un Drop caducado se presenta como ended aunque su
 * campo status siga en "live" hasta que alguien lo actualice.
 */
export type EffectiveDropStatus = "upcoming" | "live" | "ended";

export function resolveDropStatus(
  drop: Pick<Drop, "status" | "startsAt" | "endsAt" | "price">,
  now: Date = new Date()
): EffectiveDropStatus {
  const start = drop.startsAt ? new Date(drop.startsAt).getTime() : null;
  const end = drop.endsAt ? new Date(drop.endsAt).getTime() : null;
  const t = now.getTime();

  // Fecha final superada → ended (aunque el campo siga en "live").
  if (end !== null && end <= t) return "ended";
  // Status explícito finalizado → ended.
  if (drop.status === "ended") return "ended";
  // Fecha de inicio futura → upcoming (aunque el status diga "live").
  if (start !== null && start > t) return "upcoming";
  // Status "upcoming" sin fecha futura → upcoming.
  if (drop.status === "upcoming") return "upcoming";

  if (drop.status === "live") {
    // Sin precio válido → no puede ser funcionalmente activo. Se presenta
    // como upcoming (sin CTA) en lugar de mostrar 0,00 € en Mi Selección.
    if (drop.price !== null && drop.price > 0) return "live";
    return "upcoming";
  }

  return "upcoming";
}

export function isDropEffectivelyLive(drop: Drop, now?: Date): boolean {
  return resolveDropStatus(drop, now) === "live";
}
