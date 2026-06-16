import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { faqs } from "@/data/faq";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BookOpen, ExternalLink, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Support",
  description:
    "Wardens helping wardens. Resources, guides, and support for the BattleTech tabletop community.",
};

const resources = [
  {
    title: "Product Guides",
    description:
      "Detailed usage guides for every WARDEN product, including setup instructions, compatibility notes, and gameplay examples.",
    icon: BookOpen,
  },
  {
    title: "Community Discord",
    description:
      "Join the WARDEN community on Discord to share table setups, ask questions, and connect with other BattleTech players using WARDEN tools.",
    icon: MessageCircle,
  },
  {
    title: "External Resources",
    description:
      "Links to official BattleTech rules references, community tools, and partner creators within the tabletop ecosystem.",
    icon: ExternalLink,
  },
];

export default function CommunitySupportPage() {
  return (
    <>
      <PageSection>
        <Container>
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Community Support
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Wardens helping wardens. Resources, guides, and support channels
              for the BattleTech tabletop community. Whether you are learning
              Classic for the first time or refining your Alpha Strike company
              tactics, these resources are here to help.
            </p>
          </div>
        </Container>
      </PageSection>

      <PageSection className="!pt-0">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3 mb-16">
            {resources.map((resource) => (
              <Card key={resource.title} className="border-border bg-card">
                <CardHeader>
                  <resource.icon className="size-6 text-primary mb-2" />
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{resource.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="mb-12" />

          <div id="faq">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-4 max-w-3xl">
              {faqs.map((faq) => (
                <Card key={faq.question} className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button render={<Link href="/contact" />}>
              Contact Support
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/collections" />}>
              Browse Catalog
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
