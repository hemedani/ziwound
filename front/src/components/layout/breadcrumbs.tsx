"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export function Breadcrumbs() {
  const t = useTranslations("breadcrumbs");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const locale = useLocale();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    // Remove locale prefix and split path
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    const items: BreadcrumbItem[] = [
      {
        label: t("home"),
        href: `/${locale}`,
        isLast: segments.length === 0,
      },
    ];

    // Build path segments with labels
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Map segments to translation keys
      let label = segment;
      switch (segment) {
        case "about":
          label = tHeader("about");
          break;
        case "contact":
          label = tHeader("contact");
          break;
        case "faq":
          label = tHeader("faq");
          break;
        case "war-crimes":
          label = tHeader("warCrimes");
          break;
        case "blog":
          label = tHeader("blog");
          break;
        case "documents":
          label = tHeader("documents");
          break;
        case "reports":
          label = tHeader("myReports");
          break;
        case "new":
          label = t("newReport");
          break;
        case "my":
          label = t("myReports");
          break;
        default:
          // For dynamic segments like IDs, use a generic label
          if (segment.match(/^[0-9a-fA-F]{24}$/)) {
            label = t("detail");
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
      }

      items.push({
        label,
        href: `/${locale}${currentPath}`,
        isLast,
      });
    });

    return items;
  }, [pathname, locale, t, tHeader]);

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 px-4 md:px-6 border-b bg-muted/30"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
            )}
            {item.isLast ? (
              <span
                className="font-medium text-foreground"
                aria-current="page"
              >
                {index === 0 && (
                  <Home className="h-4 w-4 inline mr-1" />
                )}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  index === 0 && "flex items-center"
                )}
              >
                {index === 0 && (
                  <Home className="h-4 w-4 mr-1" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
