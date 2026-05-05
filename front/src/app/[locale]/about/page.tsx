import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Globe, Users, FileText, ArrowRight } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const features = [
    {
      icon: Shield,
      title: t("about.feature1Title"),
      description: t("about.feature1Description"),
    },
    {
      icon: Globe,
      title: t("about.feature2Title"),
      description: t("about.feature2Description"),
    },
    {
      icon: Users,
      title: t("about.feature3Title"),
      description: t("about.feature3Description"),
    },
    {
      icon: FileText,
      title: t("about.feature4Title"),
      description: t("about.feature4Description"),
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {t("about.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("about.mission")}
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8">
            <blockquote className="text-2xl md:text-3xl font-medium text-center italic">
              &ldquo;{t("about.vision")}&rdquo;
            </blockquote>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t("about.whyChooseUs")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t("about.howItWorks")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("about.step1Title")}</h3>
            <p className="text-muted-foreground">{t("about.step1Description")}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("about.step2Title")}</h3>
            <p className="text-muted-foreground">{t("about.step2Description")}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("about.step3Title")}</h3>
            <p className="text-muted-foreground">{t("about.step3Description")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">{t("about.readyToContribute")}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {t("about.ctaDescription")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/reports/new">
              {t("about.submitReport")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/war-crimes">{t("about.exploreData")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
