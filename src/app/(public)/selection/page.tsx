import type { Metadata } from "next";
import { SelectionView } from "@/components/selection/selection-view";

export const metadata: Metadata = {
  title: "My Selection",
  description:
    "Review your selected WARDEN products and submit a quote request. No purchase obligation.",
};

export default function SelectionPage() {
  return <SelectionView />;
}
