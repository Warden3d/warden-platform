import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "WARDEN Core",
  description:
    "The foundational product line for BattleTech Classic players. Precision tools engineered to reduce table clutter and speed up phase execution.",
};

export default function WardenCorePage() {
  return (
    <>
      <PageSection>
        <Container>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            All Collections
          </Link>
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="size-6 text-primary" />
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-widest border-primary/20 text-primary"
              >
                BattleTech Classic
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              WARDEN Core
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              The foundational product line for BattleTech Classic players.
              Precision tools engineered to reduce table clutter, speed up phase
              execution, and keep the focus on tactical decisions — not rulebook
              lookups.
            </p>
          </div>
        </Container>
      </PageSection>

      <PageSection className="!pt-0">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Hex Position Markers — Brass Edition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Precision-machined brass hex markers that sit flush within a
                  standard 1.25-inch hex. Clear visual cues for unit status,
                  line-of-sight blocking, and terrain conditions. Natural brass
                  patina develops over time for a unique tabletop presence.
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Material</dt>
                    <dd className="text-sm text-foreground">
                      Solid brass, uncoated
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Compatibility
                    </dt>
                    <dd className="text-sm text-foreground">
                      BattleTech Classic, Alpha Strike
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Tactical Heat Dial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dual-layer acrylic dial tracking heat scale from 0 to 30 with
                  high-contrast numerals. Warning indicators at shutdown roll
                  (14) and ammo explosion (26) thresholds. Keeps heat management
                  physical, visible, and tactile.
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Material</dt>
                    <dd className="text-sm text-foreground">
                      Laser-cut acrylic, dual layer
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Range</dt>
                    <dd className="text-sm text-foreground">0 to 30 heat</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Armor Status Slider Set</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Eight mini sliders replacing paper record sheets for
                  per-location armor tracking. One slider per location with
                  tactile detents. CNC-machined from aluminum composite with
                  laser-etched numbering. Baseplate aligns with standard record
                  sheet layout.
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Material</dt>
                    <dd className="text-sm text-foreground">
                      Aluminum composite
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Pieces</dt>
                    <dd className="text-sm text-foreground">
                      8 sliders + baseplate
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Cluster Hit Quick Wheel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compact rotating wheel displaying the Cluster Hits Table for
                  missile salvos from 2 to 40. Rotate to salvo size and read hit
                  count for any 2-12 roll. Double-sided with LRM/SRM special
                  cases on reverse. Fits in a standard dice tray.
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Material</dt>
                    <dd className="text-sm text-foreground">
                      Brass pin joint, acrylic plates
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Range</dt>
                    <dd className="text-sm text-foreground">2 to 40 missiles</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button render={<Link href="/selection" />}>
              Add WARDEN Core products to Selection
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/bundles" />}>
              View Commander Pack Bundle
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
