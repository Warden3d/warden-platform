import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("page-container", className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("page-section", className)}>{children}</section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-eyebrow text-muted-foreground", className)}>
      {children}
    </span>
  );
}

export function SectionDivider({ className }: { className?: string }) {
  return <hr className={cn("section-divider", className)} />;
}

/** @deprecated Use Section instead */
export const PageSection = Section;
