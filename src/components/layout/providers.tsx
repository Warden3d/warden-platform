"use client";

import { SelectionProvider } from "@/hooks/use-selection";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <SelectionProvider>{children}</SelectionProvider>;
}
