"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, FileText, Lock, Zap, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
  const t = useTranslations("home");
  const nav = useTranslations("nav");
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.description"),
    },
    {
      icon: Globe,
      title: t("features.multilang.title"),
      description: t("features.multilang.description"),
    },
    {
      icon: FileText,
      title: t("features.easy.title"),
      description: t("features.easy.description"),
    },
    {
      icon: Lock,
      title: t("features.private.title"),
      description: t("features.private.description"),
    },
    {
      icon: Zap,
      title: t("features.fast.title"),
      description: t("features.fast.description"),
    },
    {
      icon: Users,
      title: t("features.community.title"),
      description: t("features.community.description"),
    },
  ];

  const steps = [
    {
      number: 1,
      title: t("steps.create.title"),
      description: t("steps.create.description"),
    },
    {
      number: 2,
      title: t("steps.submit.title"),
      description: t("steps.submit.description"),
    },
    {
      number: 3,
      title: t("steps.track.title"),
      description: t("steps.track.description"),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              {t("hero.badge")}
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">{t("hero.description")}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <>
                  <Button size="lg" asChild className="gap-2">
                    <Link href="/reports/my">
                      {nav("myReports") || "My Reports"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/reports/new">{nav("newReport") || "New Report"}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild className="gap-2">
                    <Link href="/register">
                      {t("hero.ctaButton")} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">{nav("login")}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,not_#fff_40%,#6366f1_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,not_#030712_40%,#6366f1_100%)] opacity-20" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="text-lg text-muted-foreground">{t("features.description")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="text-lg text-muted-foreground">{t("howItWorks.description")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="absolute end-0 top-8 hidden h-px w-16 bg-border sm:block rtl:left-0 rtl:right-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl rounded-xl border bg-card p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="mb-4 text-2xl font-bold">{t("trust.title")}</h2>
              <p className="text-muted-foreground">{t("trust.description")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                t("trust.benefits.0"),
                t("trust.benefits.1"),
                t("trust.benefits.2"),
                t("trust.benefits.3"),
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-primary py-20 md:py-32 text-primary-foreground">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{t("cta.title")}</h2>
              <p className="mb-8 text-lg opacity-90">{t("cta.description")}</p>
              <Button size="lg" variant="secondary" asChild className="gap-2">
                <Link href="/register">
                  {t("cta.button")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
