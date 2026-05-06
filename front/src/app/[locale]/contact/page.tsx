import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

export default async function ContactPage({
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
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-crimson" />
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-gold">
            {t("contact.overline") || "Get in Touch"}
          </span>
          <div className="h-px w-12 bg-crimson" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-offwhite">
          {t("contact.title")}
        </h1>
        <p className="text-lg text-slate-body max-w-2xl mx-auto">
          {t("contact.subtitle")}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl glass-light p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-crimson/10 shrink-0">
                <Mail className="h-6 w-6 text-crimson" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-offwhite">{t("contact.emailTitle")}</h3>
                <p className="text-sm text-slate-body">{t("contact.emailDescription")}</p>
                <a 
                  href="mailto:contact@ziwound.org" 
                  className="text-gold hover:text-gold-light mt-2 inline-block transition-colors"
                >
                  contact@ziwound.org
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass-light p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-crimson/10 shrink-0">
                <Phone className="h-6 w-6 text-crimson" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-offwhite">{t("contact.phoneTitle")}</h3>
                <p className="text-sm text-slate-body">{t("contact.phoneDescription")}</p>
                <p className="text-gold mt-2">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass-light p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-crimson/10 shrink-0">
                <MapPin className="h-6 w-6 text-crimson" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-offwhite">{t("contact.addressTitle")}</h3>
                <p className="text-sm text-slate-body">{t("contact.addressDescription")}</p>
                <p className="mt-2 text-sm text-offwhite">
                  123 Human Rights Ave<br />
                  Geneva, Switzerland
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl glass-strong p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-offwhite">{t("contact.formTitle")}</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
