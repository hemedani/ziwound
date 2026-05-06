"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FAQContent() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems: FAQItem[] = useMemo(() => {
    return [
      {
        id: "what-is-ziwound",
        question: t("questions.whatIsZiwound.question"),
        answer: t("questions.whatIsZiwound.answer"),
        category: "general",
      },
      {
        id: "is-ziwound-free",
        question: t("questions.isZiwoundFree.question"),
        answer: t("questions.isZiwoundFree.answer"),
        category: "general",
      },
      {
        id: "who-can-use",
        question: t("questions.whoCanUse.question"),
        answer: t("questions.whoCanUse.answer"),
        category: "general",
      },
      {
        id: "how-to-report",
        question: t("questions.howToReport.question"),
        answer: t("questions.howToReport.answer"),
        category: "reporting",
      },
      {
        id: "what-evidence",
        question: t("questions.whatEvidence.question"),
        answer: t("questions.whatEvidence.answer"),
        category: "reporting",
      },
      {
        id: "anonymous-report",
        question: t("questions.anonymousReport.question"),
        answer: t("questions.anonymousReport.answer"),
        category: "reporting",
      },
      {
        id: "report-status",
        question: t("questions.reportStatus.question"),
        answer: t("questions.reportStatus.answer"),
        category: "reporting",
      },
      {
        id: "data-security",
        question: t("questions.dataSecurity.question"),
        answer: t("questions.dataSecurity.answer"),
        category: "privacy",
      },
      {
        id: "who-sees-report",
        question: t("questions.whoSeesReport.question"),
        answer: t("questions.whoSeesReport.answer"),
        category: "privacy",
      },
      {
        id: "data-retention",
        question: t("questions.dataRetention.question"),
        answer: t("questions.dataRetention.answer"),
        category: "privacy",
      },
      {
        id: "supported-languages",
        question: t("questions.supportedLanguages.question"),
        answer: t("questions.supportedLanguages.answer"),
        category: "technical",
      },
      {
        id: "mobile-friendly",
        question: t("questions.mobileFriendly.question"),
        answer: t("questions.mobileFriendly.answer"),
        category: "technical",
      },
      {
        id: "browser-support",
        question: t("questions.browserSupport.question"),
        answer: t("questions.browserSupport.answer"),
        category: "technical",
      },
    ];
  }, [t]);

  const categories = [
    { id: "general", label: t("categories.general") },
    { id: "reporting", label: t("categories.reporting") },
    { id: "privacy", label: t("categories.privacy") },
    { id: "technical", label: t("categories.technical") },
  ];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }, [faqItems, searchQuery]);

  const getItemsByCategory = (categoryId: string) => {
    return filteredItems.filter((item) => item.category === categoryId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="rounded-2xl glass-light p-6">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-body" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10 bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      {categories.map((category) => {
        const items = getItemsByCategory(category.id);
        if (items.length === 0) return null;

        return (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-offwhite">
              <HelpCircle className="h-5 w-5 text-gold" />
              {category.label}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border border-white/5 rounded-xl px-4 data-[state=open]:border-crimson/30 data-[state=open]:bg-white/[0.02] transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 text-offwhite hover:text-gold transition-colors">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-body pb-4 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );
      })}

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 text-slate-body/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-offwhite">{t("noResults")}</h3>
          <p className="text-slate-body">{t("tryDifferentSearch")}</p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="rounded-2xl glass-light p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent" />
        <div className="relative">
          <h3 className="text-lg font-semibold mb-2 text-offwhite">{t("stillHaveQuestions")}</h3>
          <p className="text-slate-body mb-6">{t("contactUsPrompt")}</p>
          <Button asChild className="bg-crimson hover:bg-crimson-light text-white">
            <Link href={`/${locale}/contact`}>
              {t("contactUs")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
