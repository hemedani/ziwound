import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, FileText, MessageCircle, Book } from "lucide-react";

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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {t("help.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("help.subtitle")}
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpSections.map((section) => (
            <Card key={section.title} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <Button variant="outline" asChild className="w-full">
                  <Link href={section.href}>{t("help.learnMore")}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">{t("help.stillNeedHelp")}</h3>
            <p className="text-muted-foreground mb-4">{t("help.contactPrompt")}</p>
            <Button asChild>
              <Link href={`/${locale}/contact`}>{t("help.contactUs")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
