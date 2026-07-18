import type { Metadata } from "next";
import { SelectionView } from "@/components/selection/selection-view";

export const metadata: Metadata = {
  title: "Mi Selección",
  description:
    "Revisa tus productos WARDEN seleccionados y envía una solicitud de presupuesto. Sin compromiso de compra.",
};

export default async function SelectionPage() {
  return <SelectionView />;
}
