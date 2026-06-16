import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { products } from "@/data/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Package, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Mi Selección",
  description:
    "Review your selected WARDEN products and submit a quote request.",
};

export default function SelectionPage() {
  const selectedIds = ["p1", "p2", "p5"];
  const selectedProducts = products.filter((p) =>
    selectedIds.includes(p.id)
  );

  return (
    <PageSection>
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Package className="size-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Mi Selección
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Review your selected products below, then submit a quote request.
            We will respond with availability, pricing, and estimated delivery
            times within 2 business days.
          </p>
        </div>
      </Container>

      <Container className="!py-12">
        {selectedProducts.length > 0 ? (
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Selected Products
              </h2>
              {selectedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="border-border bg-card"
                >
                  <CardContent className="flex items-start justify-between py-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <CardDescription className="text-xs mt-0.5">
                          {product.subtitle}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-xs text-muted-foreground">
                        Qty: 1
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator className="mt-6" />

              <p className="text-sm text-muted-foreground">
                Total items selected: {selectedProducts.length}. Pricing and
                availability will be confirmed in our response to your quote
                request.
              </p>
            </div>

            <div>
              <Card className="border-border bg-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">
                    Request a Quote
                  </CardTitle>
                  <CardDescription>
                    Fill in your details and we will get back to you within 2
                    business days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="sel-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Name
                      </label>
                      <Input
                        id="sel-name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="sel-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <Input
                        id="sel-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="sel-phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Phone{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </label>
                      <Input
                        id="sel-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="sel-notes"
                        className="text-sm font-medium text-foreground"
                      >
                        Notes{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </label>
                      <Textarea
                        id="sel-notes"
                        placeholder="Any additional requests, shipping preferences, or questions..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Quote Request
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="size-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              Your selection is empty
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Browse the catalog and add products to your selection. When you
              are ready, return here to submit a quote request.
            </p>
            <Button className="mt-6" render={<Link href="/collections" />}>
              Browse Catalog
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )}
      </Container>
    </PageSection>
  );
}
