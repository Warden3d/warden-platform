"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="flex-1 overflow-x-hidden min-w-0 lg:ml-56">
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-warden-carbon px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú de administración"
            className="inline-flex items-center justify-center size-9 rounded-sm text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold tracking-wide text-foreground">
            WARDEN Admin
          </span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
