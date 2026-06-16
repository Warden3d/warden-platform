import type { Metadata } from "next";
import { Container, PageSection } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Compass, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "About WARDEN",
  description:
    "WARDEN develops precision physical equipment for BattleTech Classic, Alpha Strike, and AeroTech tabletop gaming.",
};

export default function AboutPage() {
  return (
    <>
      <PageSection>
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About WARDEN
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              WARDEN exists because tabletop gaming deserves better tools. We
              develop precision physical equipment designed to enhance the
              experience of playing BattleTech Classic, Alpha Strike, and
              AeroTech — not by adding complexity, but by removing friction.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every WARDEN product is conceived, prototyped, tested, and
              manufactured with a single guiding principle: the product must
              earn its place on your table. If a tool does not speed up a phase,
              clarify a rule, or reduce the mental load of keeping track of game
              state, it does not ship.
            </p>
          </div>
        </Container>
      </PageSection>

      <Separator />

      <PageSection>
        <Container>
          <h2 className="section-title mb-8">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <Shield className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Functionality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every product serves a clear, definable gameplay purpose. We
                  do not produce decorative objects. A WARDEN product on your
                  table is there because it actively improves how you play.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <Compass className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All WARDEN products are designed to work seamlessly with
                  official BattleTech maps, record sheets, miniatures, and
                  rulebooks. We test against the current editions of each game
                  system we support.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <Wrench className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Robustness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Brass, aluminum, and acrylic components machined to precise
                  tolerances. WARDEN products are built to handle hundreds of
                  game sessions without degradation in fit or function.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <svg
                  className="size-6 text-primary mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <CardTitle className="text-base">Clarity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Information design is a core competency. Numbers, markings,
                  and indicators on WARDEN products are engineered for
                  legibility under variable lighting conditions and at tabletop
                  distances. No decorative flourishes that compromise
                  readability.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <svg
                  className="size-6 text-primary mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <CardTitle className="text-base">Coherence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Products within a WARDEN collection share materials, design
                  language, and mechanical interfaces. A Commander who uses the
                  Hex Markers will find the Armor Sliders immediately familiar.
                  No learning curve between tools.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <svg
                  className="size-6 text-primary mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <CardTitle className="text-base">Honesty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We describe our products accurately, show real specifications,
                  and do not overpromise. Brass develops patina. Acrylic can
                  scratch. These are not defects — they are material
                  characteristics. We tell you what to expect before you order.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
