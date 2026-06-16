import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Licensed Universes",
  description:
    "WARDEN collections developed in collaboration with partner studios and independent BattleTech creators.",
};

export default function LicensesPage() {
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
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Licensed Universes
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Collections developed in collaboration with partner studios and
              independent BattleTech creators. Each licensed collection brings
              custom tooling and unique aesthetics while maintaining WARDEN
              standards for precision, durability, and gameplay-first design.
            </p>
          </div>
        </Container>
      </PageSection>

      <PageSection className="!pt-0">
        <Container>
          <Card className="border-border bg-card max-w-2xl">
            <CardHeader>
              <CardTitle>Licensing Partnerships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WARDEN collaborates with independent creators and small studios
                within the BattleTech community who share our commitment to
                precision, quality, and gameplay integrity. Each licensed
                collection is developed from concept to production with direct
                creator involvement, ensuring the final product reflects their
                vision while meeting WARDEN manufacturing standards.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                Our licensing model is designed to be fair, transparent, and
                sustainable for both independent creators and WARDEN. Revenue
                sharing is structured around a per-unit royalty paid quarterly,
                with no upfront costs to the creator. Creators retain ownership
                of their intellectual property while WARDEN handles
                manufacturing, fulfillment, and customer support.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                If you are a creator developing physical tools or accessories
                for the BattleTech ecosystem and are interested in a licensing
                partnership, reach out through our Contact page with a brief
                description of your product concept.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button render={<Link href="/contact" />}>
              Contact About Licensing
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/collections" />}>
              Back to Collections
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
