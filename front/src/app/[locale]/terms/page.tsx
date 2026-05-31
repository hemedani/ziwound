import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const sections = [
    { title: t("terms.section1Title"), content: t("terms.section1Content") },
    { title: t("terms.section2Title"), content: t("terms.section2Content") },
    { title: t("terms.section3Title"), content: t("terms.section3Content") },
    { title: t("terms.section4Title"), content: t("terms.section4Content") },
    { title: t("terms.contactTitle"), content: t("terms.contactContent") },
  ];

  return (
    <PageContainer
      title={t("terms.title")}
      description={t("terms.subtitle")}
      heroGradient="from-crimson/8"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="rounded-2xl glass-light p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-offwhite">{section.title}</h2>
            <p className="text-slate-body leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
