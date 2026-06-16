export function ResultsCounter({
  total,
  filtered,
}: {
  total: number;
  filtered: number;
}) {
  if (total === filtered) {
    return (
      <p className="text-sm text-muted-foreground">
        <span className="text-data text-foreground/80">{total}</span>{" "}
        {total === 1 ? "product" : "products"}
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      <span className="text-data text-foreground/80">{filtered}</span> of{" "}
      <span className="text-data text-foreground/80">{total}</span>{" "}
      {total === 1 ? "product" : "products"}
    </p>
  );
}
