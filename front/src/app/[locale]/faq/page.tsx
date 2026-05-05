import { getTranslations } from "next-intl/server";
import { FAQContent } from "@/components/faq/faq-content";

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {t("faq.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </section>

      <FAQContent />
    </div>
  );
}
