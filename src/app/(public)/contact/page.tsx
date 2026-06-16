import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with WARDEN for product inquiries, custom work, licensing partnerships, or support.",
};

export default function ContactPage() {
  return (
    <PageSection>
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Product inquiries, custom work requests, licensing partnerships, or
            general questions. We respond to every message within two business
            days.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Describe your inquiry in detail..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit">
                    Send Message
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <Mail className="size-5 text-primary mb-2" />
                <CardTitle className="text-base">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  contact@warden-platform.com
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <MapPin className="size-5 text-primary mb-2" />
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  WARDEN operates remotely. Products are manufactured in
                  small-batch facilities and shipped worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to all inquiries within 2 business days.
                  Custom work assessments may require additional time for
                  technical review.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" render={<Link href="/selection" />}>
            Go to Mi Selección
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Container>
    </PageSection>
  );
}
