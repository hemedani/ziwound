import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, FileText, MessageCircle, Book, ArrowRight } from "lucide-react";

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const helpSections = [
    {
      icon: FileText,
      title: t("help.gettingStartedTitle"),
      description: t("help.gettingStartedDesc"),
      href: `/${locale}/faq`,
    },
    {
      icon: HelpCircle,
      title: t("help.submittingReportsTitle"),
      description: t("help.submittingReportsDesc"),
      href: `/${locale}/faq`,
    },
    {
      icon: Book,
      title: t("help.guidesTitle"),
      description: t("help.guidesDesc"),
      href: `/${locale}/blog`,
    },
    {
      icon: MessageCircle,
      title: t("help.contactSupportTitle"),
      description: t("help.contactSupportDesc"),
      href: `/${locale}/contact`,
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-crimson" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
            {t("help.overline") || "Support"}
          </span>
          <div className="h-px w-12 bg-crimson" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-offwhite">
          {t("help.title")}
        </h1>
        <p className="text-lg text-slate-body max-w-2xl mx-auto">
          {t("help.subtitle")}
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl glass-light p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-crimson/10 group-hover:bg-crimson/20 transition-colors">
                  <section.icon className="h-6 w-6 text-crimson" />
                </div>
                <h3 className="text-lg font-semibold text-offwhite">{section.title}</h3>
              </div>
              <p className="text-slate-body mb-6 text-sm leading-relaxed">{section.description}</p>
              <Button
                variant="outline"
                asChild
                className="w-full border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
              >
                <Link href={section.href} className="gap-2">
                  {t("help.learnMore")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl glass-light p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent" />
          <div className="relative">
            <h3 className="text-lg font-semibold mb-2 text-offwhite">{t("help.stillNeedHelp")}</h3>
            <p className="text-slate-body mb-6">{t("help.contactPrompt")}</p>
            <Button asChild className="bg-crimson hover:bg-crimson-light text-white gap-2">
              <Link href={`/${locale}/contact`}>{t("help.contactUs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
