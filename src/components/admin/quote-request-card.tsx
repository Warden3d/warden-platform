import type { EmailStatus, Request } from "@/types/warden";
import { StatusBadge } from "./status-badge";

const emailLabels: Record<EmailStatus, string> = {
  pending: "Pendiente", sent: "Enviado", failed: "Fallido",
};
const entityLabels = { product: "Producto", bundle: "Bundle", drop: "Drop" };

export function QuoteRequestCard({ request: req, demo = false }: { request: Request; demo?: boolean }) {
  const client = req.client;
  const money = (amount: number) => new Intl.NumberFormat("es-ES", {
    style: "currency", currency: req.currency,
  }).format(amount);
  const reference = req.reference ?? "Sin referencia";
  return (
    <article className="min-w-0 rounded-sm border border-border bg-warden-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 break-words">
          <h3 className="font-mono font-medium text-foreground">{reference}</h3>
          <p className="mt-1 text-sm">{client.firstName} {client.lastName}</p>
          <p className="text-xs text-muted-foreground">{client.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {[client.postalCode, client.city, client.region, client.country].filter(Boolean).join(" · ")}
          </p>
          {client.phone && <p className="text-xs text-muted-foreground">Teléfono: {client.phone}</p>}
          {client.company && <p className="text-xs text-muted-foreground">Empresa: {client.company}</p>}
        </div>
        <StatusBadge status={req.status} />
      </div>
      {client.notes && <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">{client.notes}</p>}
      <ul className="mt-4 space-y-3 border-t border-border pt-3">
        {req.lines.map((line, index) => (
          <li key={index} className="flex flex-wrap justify-between gap-2 text-sm">
            <div className="min-w-0 break-words">
              <p>{line.name}</p>
              <p className="text-xs text-muted-foreground">{entityLabels[line.entityType]} · {line.sku || "Sin SKU"}</p>
              {line.configuration?.map((option, i) => <p key={i} className="text-xs text-muted-foreground">{option.label}</p>)}
            </div>
            <div className="text-right font-mono text-xs">
              <p>{line.quantity} × {money(line.unitPrice)}</p>
              <p className="mt-1">{money(line.lineSubtotal)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
        <p>Subtotal de productos: <strong>{money(req.productSubtotal)}</strong></p>
        <p className="text-muted-foreground">Envío: {req.shippingStatus === "pending_calculation" ? "pendiente de calcular" : req.shippingStatus === "free" ? "gratuito" : req.shippingStatus === "not_applicable" ? "no aplicable" : req.shippingCost !== null ? money(req.shippingCost) : "importe no registrado"}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className={req.internalEmailStatus === "failed" ? "font-medium text-red-400" : "text-muted-foreground"}>Aviso a WARDEN: {emailLabels[req.internalEmailStatus]}</span>
        <span className={req.customerEmailStatus === "failed" ? "font-medium text-red-400" : "text-muted-foreground"}>Confirmación al cliente: {emailLabels[req.customerEmailStatus]}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">El estado «Enviado» indica aceptación por el servidor de correo; no confirma entrega en la bandeja de entrada.</p>
      {req.internalNotes && <p className="mt-3 whitespace-pre-wrap break-words text-xs text-muted-foreground">Notas internas: {req.internalNotes}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-muted-foreground">Recibido: {new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date(req.createdAt))} (Madrid)</p>
        {!demo && <a className="font-medium text-warden-ochre underline underline-offset-4" href={`mailto:${encodeURIComponent(client.email)}?subject=${encodeURIComponent(`WARDEN · ${reference}`)}`}>Redactar respuesta</a>}
      </div>
    </article>
  );
}
