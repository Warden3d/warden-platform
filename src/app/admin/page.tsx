import { Shield } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { getAllProducts } from "@/lib/data/admin";
import {
  getQuoteRequests,
  isSupabaseConfigured,
  getContactRequests,
  getCommunitySupportRequests,
} from "@/lib/data/admin";

export default async function AdminDashboard() {
  const products = await getAllProducts();
  const selReqs = await getQuoteRequests();
  const conReqs = await getContactRequests();
  const csReqs = await getCommunitySupportRequests();

  const active = products.filter((p) => p.status === "active").length;
  const hidden = products.filter((p) => p.status === "hidden").length;
  const retired = products.filter((p) => p.status === "retired").length;
  const newRequests = selReqs.filter((r) => r.status === "received").length +
    csReqs.filter((r) => r.status === "open" || r.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-wide text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen del catálogo y solicitudes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Productos activos" value={active} />
        <StatCard label="Ocultos" value={hidden} />
        <StatCard label="Retirados" value={retired} />
        <StatCard
          label="Solicitudes por revisar"
          value={newRequests}
          sub={
            newRequests > 0
              ? "Presupuesto y Community Support"
              : undefined
          }
        />
      </div>

      {/* Quick summary */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Resumen del catálogo
        </h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Total productos:</span>{" "}
            <span className="font-mono text-foreground">{products.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Destacados:</span>{" "}
            <span className="font-mono text-foreground">
              {products.filter((p) => p.featured).length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">
              Solicitudes de presupuesto:
            </span>{" "}
            <span className="font-mono text-foreground">{selReqs.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Mensajes de contacto:</span>{" "}
            <span className="font-mono text-foreground">{conReqs.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">
              Community Support:
            </span>{" "}
            <span className="font-mono text-foreground">{csReqs.length}</span>
          </div>
        </div>
      </div>

      {!isSupabaseConfigured() && <div className="rounded-sm border border-warden-ochre/30 bg-warden-ochre/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 size-4 shrink-0 text-warden-ochre" />
          <div>
            <p className="text-sm font-medium text-warden-ochre">
              Modo demostración — Datos ficticios
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supabase no está conectado. Este panel muestra datos de ejemplo;
              no representa solicitudes reales ni realiza envíos de correo.
            </p>
          </div>
        </div>
      </div>}
    </div>
  );
}
