import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";
import { FAQContent } from "@/components/faq/faq-content";

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <PageContainer
      title={t("faq.title")}
      description={t("faq.subtitle")}
      heroGradient="from-gold/5"
    >
      <FAQContent />
    </PageContainer>
  );
}
