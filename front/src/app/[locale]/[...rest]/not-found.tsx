"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {t("title") || "Page Not Found"}
      </h1>
      <p className="mb-8 max-w-[500px] text-lg text-muted-foreground">
        {t("description") || "Sorry, the page you are looking for does not exist."}
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("backHome") || "Back to Home"}
        </Link>
      </Button>
    </div>
  );
}
