"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/logout";
import {
  LayoutDashboard,
  Package,
  Inbox,
  LogOut,
  Shield,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/requests", label: "Solicitudes", icon: Inbox },
];

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    // Redirect handled by server action
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-warden-carbon/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-border bg-warden-surface transition-transform duration-200 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-warden-blue" />
            <span className="text-sm font-semibold tracking-wide text-foreground">
              WARDEN Admin
            </span>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Cerrar menú"
            className="inline-flex items-center justify-center size-8 rounded-sm text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-3" aria-label="Navegación de administración">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50",
                  isActive
                    ? "bg-warden-blue/15 text-warden-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-red-400"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
          <p className="mt-2 px-3 text-[10px] text-muted-foreground/60">
            Supabase Auth
          </p>
        </div>
      </aside>
    </>
  );
}
