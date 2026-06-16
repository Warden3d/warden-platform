import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { drops } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Drops",
  description:
    "Limited production runs and launch drops from WARDEN. Time-limited availability on special editions and new product launches.",
};

export default function DropsPage() {
  const upcoming = drops.filter((d) => d.status === "upcoming");
  const ended = drops.filter((d) => d.status === "ended");

  return (
    <PageSection>
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Drops
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Limited production runs and launch events. Drops are available for a
            defined window of time — order during the drop window to secure your
            products. Quantities may be limited.
          </p>
        </div>

        {upcoming.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Upcoming Drops
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 mb-12">
              {upcoming.map((drop) => (
                <Card
                  key={drop.id}
                  className="border-border bg-card"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase tracking-widest border-primary/20 text-primary"
                      >
                        Upcoming
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Starts{" "}
                        {new Date(drop.startsAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{drop.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {drop.description}
                    </p>
                    {drop.endsAt && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Ends{" "}
                        {new Date(drop.endsAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {ended.length > 0 && (
          <>
            <Separator className="my-8" />
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Flame className="size-5 text-muted-foreground" />
              Past Drops
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {ended.map((drop) => (
                <Card
                  key={drop.id}
                  className="border-border bg-card opacity-60"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-[10px]">
                        Ended
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{drop.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {drop.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Button render={<Link href="/selection" />}>
            Go to Mi Selección
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/collections" />}>
            Browse Catalog
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Container>
    </PageSection>
  );
}
