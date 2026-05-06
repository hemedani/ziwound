"use client";

import React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Shield, Mail, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { NewsletterSignup } from "./newsletter-signup";
import { cn } from "@/lib/utils";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const linkGroups = [
    {
      title: t("quickLinks") || "Quick Links",
      links: [
        { href: `/${locale}/war-crimes`, label: t("warCrimes") || "War Crimes" },
        { href: `/${locale}/reports/new`, label: t("submitReport") || "Submit Report" },
        { href: `/${locale}/documents`, label: t("documents") || "Documents" },
        { href: `/${locale}/blog`, label: t("blog") || "Blog" },
      ],
    },
    {
      title: t("support") || "Support",
      links: [
        { href: `/${locale}/about`, label: t("about") || "About" },
        { href: `/${locale}/contact`, label: t("contact") || "Contact" },
        { href: `/${locale}/faq`, label: t("faq") || "FAQ" },
        { href: `/${locale}/help`, label: t("help") || "Help" },
      ],
    },
    {
      title: t("legal") || "Legal",
      links: [
        { href: `/${locale}/privacy`, label: t("privacyPolicy") || "Privacy Policy" },
        { href: `/${locale}/terms`, label: t("termsOfService") || "Terms of Service" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-charcoal-light">
      {/* Top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

      <div className="container px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <div className="h-9 w-9 rounded-xl bg-crimson flex items-center justify-center shadow-lg shadow-crimson/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-offwhite">Ziwound</span>
            </Link>
            <p className="text-sm text-slate-body leading-relaxed max-w-sm mb-6">
              {t("description") ||
                "A solemn platform dedicated to documenting war crimes and human rights violations for justice and accountability."}
            </p>

            <div className="mb-8">
              <NewsletterSignup />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-body">
              <Mail className="h-4 w-4 text-gold" />
              <span>contact@ziwound.org</span>
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-offwhite uppercase tracking-wider mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-slate-body hover:text-offwhite transition-colors"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-body/70">
            {t("copyright", { year: new Date().getFullYear() }) ||
              `© ${new Date().getFullYear()} Ziwound. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
