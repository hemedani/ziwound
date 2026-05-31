import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/layout/page-container";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const sections = [
    { title: t("privacy.section1Title"), content: t("privacy.section1Content") },
    { title: t("privacy.section2Title"), content: t("privacy.section2Content") },
    { title: t("privacy.section3Title"), content: t("privacy.section3Content") },
    { title: t("privacy.section4Title"), content: t("privacy.section4Content") },
    { title: t("privacy.contactTitle"), content: t("privacy.contactContent") },
  ];

  return (
    <PageContainer
      title={t("privacy.title")}
      description={t("privacy.subtitle")}
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
