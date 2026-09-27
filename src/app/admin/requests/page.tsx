import type { Metadata } from "next";
import { QuoteRequestCard } from "@/components/admin/quote-request-card";
import { isSupabaseConfigured } from "@/lib/data/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  getQuoteRequests,
  getContactRequests,
  getCommunitySupportRequests,
} from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Solicitudes",
  description: "Gestión de solicitudes de selección, contacto y Community Support.",
};

export default async function AdminRequestsPage() {
  const [selReqs, conReqs, csReqs] = await Promise.all([
    getQuoteRequests(),
    getContactRequests(),
    getCommunitySupportRequests(),
  ]);

  const demo = !isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-wide text-foreground">
          Solicitudes recibidas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de todas las solicitudes de selección, contacto y Community
          Support
        </p>
      </div>

      {demo && <p role="status" className="rounded-sm border border-warden-ochre/30 bg-warden-ochre/5 p-4 text-sm text-warden-ochre">Modo demostración: todas las solicitudes de este panel son ficticias. Supabase no está conectado y no se ha enviado ningún correo.</p>}

      {/* ── Selection Requests ────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Solicitudes de presupuesto
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ({selReqs.length})
          </span>
        </h2>
        {selReqs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay solicitudes de presupuesto.
          </p>
        ) : (
          <div className="space-y-3">
            {selReqs.map((req) => (
              <QuoteRequestCard key={req.id} request={req} demo={demo} />
            ))}
          </div>
        )}
      </section>

      {/* ── Contact Requests ──────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Solicitudes de contacto
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ({conReqs.length})
          </span>
        </h2>
        {conReqs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay solicitudes de contacto.
          </p>
        ) : (
          <div className="space-y-3">
            {conReqs.map((req) => (
              <div
                key={req.id}
                className="rounded-sm border border-border bg-warden-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{req.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.email} · {req.subject}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {req.message}
                </p>
                <p className="mt-3 text-xs text-muted-foreground/60">
                  Recibido:{" "}
                  {new Date(req.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Community Support Requests ────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Solicitudes de Community Support
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ({csReqs.length})
          </span>
        </h2>
        {csReqs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay solicitudes de Community Support.
          </p>
        ) : (
          <div className="space-y-3">
            {csReqs.map((req) => (
              <div
                key={req.id}
                className="rounded-sm border border-border bg-warden-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {req.entityName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.contactName} · {req.email} ·{" "}
                      {req.entityType === "asociacion"
                        ? "Asociación"
                        : req.entityType === "club"
                          ? "Club de juego"
                          : req.entityType}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {req.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {req.supportTypes.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {req.details}
                </p>
                <p className="mt-3 text-xs text-muted-foreground/60">
                  Recibido:{" "}
                  {new Date(req.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
