import { getTranslations } from "next-intl/server";

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
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-crimson" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
            {t("terms.overline") || "Legal"}
          </span>
          <div className="h-px w-12 bg-crimson" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-offwhite">
          {t("terms.title")}
        </h1>
        <p className="text-lg text-slate-body max-w-2xl mx-auto">
          {t("terms.subtitle")}
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="rounded-2xl glass-light p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-offwhite">{section.title}</h2>
            <p className="text-slate-body leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
