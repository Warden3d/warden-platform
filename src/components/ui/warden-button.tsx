import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type WardenButtonBase = {
  variant?: "primary" | "outline" | "ghost" | "ochre";
  size?: "default" | "sm" | "lg";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variants = {
  primary: "bg-warden-blue text-warden-carbon hover:bg-warden-blue/90",
  outline:
    "border border-border bg-transparent text-foreground hover:border-warden-blue/40 hover:text-warden-blue",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-warden-elevated hover:text-foreground",
  ochre: "bg-warden-ochre text-warden-carbon hover:bg-warden-ochre/90",
};

const sizes = {
  default: "h-9 px-5 text-sm tracking-wide",
  sm: "h-7 px-3 text-xs tracking-wider uppercase",
  lg: "h-11 px-7 text-sm tracking-wide",
};

function buttonStyles({
  variant = "primary",
  size = "default",
  className,
}: WardenButtonBase & { className?: string }) {
  return cn(base, variants[variant], sizes[size], className);
}

type WardenButtonAsLink = WardenButtonBase & {
  href: string;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

type WardenButtonAsButton = WardenButtonBase & {
  href?: never;
  className?: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"button">;

type WardenButtonProps = WardenButtonAsLink | WardenButtonAsButton;

export function WardenButton(props: WardenButtonProps) {
  const { variant, size, className, children, ...rest } = props;

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest as WardenButtonAsLink;
    return (
      <Link
        href={href}
        className={buttonStyles({ variant, size, className })}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = rest as WardenButtonAsButton;
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
