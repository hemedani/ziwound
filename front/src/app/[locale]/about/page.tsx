import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
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
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-crimson" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
            {t("about.overline") || "About Us"}
          </span>
          <div className="h-px w-12 bg-crimson" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-offwhite">
          {t("about.title")}
        </h1>
        <p className="text-lg text-slate-body max-w-3xl mx-auto leading-relaxed">
          {t("about.mission")}
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <div className="rounded-2xl glass-light p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent" />
          <blockquote className="relative text-xl md:text-2xl font-medium text-center italic text-offwhite leading-relaxed">
            &ldquo;{t("about.vision")}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-offwhite">
          {t("about.whyChooseUs")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-crimson/10 group-hover:bg-crimson/20 transition-colors shrink-0">
                  <feature.icon className="h-6 w-6 text-crimson" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-offwhite group-hover:text-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-body text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-offwhite">
          {t("about.howItWorks")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-crimson/10 flex items-center justify-center mx-auto mb-4 ring-1 ring-crimson/20">
                <span className="text-2xl font-bold text-crimson">{step}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-offwhite">
                {t(`about.step${step}Title`)}
              </h3>
              <p className="text-slate-body text-sm">{t(`about.step${step}Description`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,27,27,0.1)_0%,_transparent_70%)]" />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-offwhite">
            {t("about.readyToContribute")}
          </h2>
          <p className="text-lg text-slate-body max-w-2xl mx-auto mb-8">
            {t("about.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-crimson hover:bg-crimson-light text-white gap-2 animate-pulse-glow">
              <Link href="/reports/new">
                {t("about.submitReport")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="border-white/15 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
            >
              <Link href="/war-crimes">{t("about.exploreData")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
