import type { Metadata } from "next";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  getSelectionRequests,
  getContactRequests,
  getCommunitySupportRequests,
} from "@/lib/data/admin";

type StoredSelection = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type StoredRequest = {
  id: string;
  status: string;
  createdAt: string;
};

type StoredSelectionRequest = StoredRequest & {
  name: string;
  email: string;
  country: string;
  queryType: string;
  message: string;
  selections: StoredSelection[];
};

type StoredContactRequest = StoredRequest & {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type StoredCommunitySupportRequest = StoredRequest & {
  entityType: string;
  entityName: string;
  contactName: string;
  email: string;
  description: string;
  supportTypes: string[];
  details: string;
};

export const metadata: Metadata = {
  title: "Solicitudes",
  description: "Gestión de solicitudes de selección, contacto y Community Support.",
};

export default async function AdminRequestsPage() {
  const [selReqs, conReqs, csReqs] = await Promise.all([
    getSelectionRequests() as Promise<StoredSelectionRequest[]>,
    getContactRequests() as Promise<StoredContactRequest[]>,
    getCommunitySupportRequests() as Promise<StoredCommunitySupportRequest[]>,
  ]);

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

      {/* ── Selection Requests ────────────────── */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Solicitudes de selección
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            ({selReqs.length})
          </span>
        </h2>
        {selReqs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay solicitudes de selección.
          </p>
        ) : (
          <div className="space-y-3">
            {selReqs.map((req) => (
              <div
                key={req.id}
                className="rounded-sm border border-border bg-warden-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{req.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.email} · {req.country} · {req.queryType}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {req.message}
                </p>
                {req.selections.length > 0 && (
                  <div className="mt-3 border-t border-border pt-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Productos solicitados:
                    </p>
                    <div className="space-y-1">
                      {req.selections.map((sel, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs"
                        >
                          <span>{sel.productName}</span>
                          <span className="font-mono text-muted-foreground">
                            ×{sel.quantity} · {sel.unitPrice.toFixed(2)} USD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground/60">
                  Recibido:{" "}
                  {new Date(req.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
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
