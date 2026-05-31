"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  FolderOpen,
  FileImage,
  Shield,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { logout as logoutAction } from "@/app/actions/user/logout";
import { LanguageSwitcher } from "./language-switcher";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("header");
  const tAdmin = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    logout();
    router.push(`/${locale}`);
  };

  const isLanding = pathname === `/${locale}` || pathname === "/";

  return (
    <header
      className={cn(
        "z-999 w-full transition-all duration-500",
        pathname.startsWith("/admin") ? "sticky top-0" : "fixed top-0",
        isLanding && !scrolled
          ? "bg-transparent border-b border-white/5"
          : "bg-background/80 backdrop-blur-xl border-b border-border/60"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-crimson flex items-center justify-center shadow-lg shadow-crimson/20 group-hover:shadow-crimson/30 transition-shadow">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-offwhite">
            ZiWound
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!pathname.startsWith("/admin") && !pathname.includes("/login") && !pathname.includes("/register") && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: `/${locale}`, label: t("home") },
              { href: `/${locale}/explore`, label: t("explore") },
              { href: `/${locale}/war-crimes`, label: t("warCrimes") },
              { href: `/${locale}/documents`, label: t("documents") },
              { href: `/${locale}/war-criminals`, label: t("warCriminals") },
              { href: `/${locale}/reporters`, label: t("reporters") },
              { href: `/${locale}/blog`, label: t("blog") },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href || pathname.startsWith(item.href)
                    ? "text-gold bg-white/5"
                    : "text-slate-body hover:text-offwhite hover:bg-white/[0.04]"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "text-slate-body hover:text-offwhite hover:bg-white/[0.04]"
                  )}
                >
                  {t("more")}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-strong border-white/10">
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/about`}>{t("about")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/contact`}>{t("contact")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/faq`}>{t("faq")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/help`}>{t("help")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/privacy`}>{t("privacy")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/terms`}>{t("terms")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && (
              <>
                <Link
                  href={`/${locale}/reports/my`}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-body hover:text-offwhite hover:bg-white/[0.04] transition-all"
                >
                  {t("myReports")}
                </Link>
                <Link
                  href={`/${locale}/reports/new`}
                  className="ml-1 px-4 py-2 rounded-lg text-sm font-medium bg-crimson/90 text-white hover:bg-crimson transition-colors shadow-sm shadow-crimson/20"
                >
                  {t("newReport")}
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 ml-1 bg-white/5 hover:bg-white/10"
                  aria-label={t("profile") || "User menu"}
                >
                  <div className="h-8 w-8 rounded-full bg-crimson/20 flex items-center justify-center border border-crimson/30">
                    <User className="h-4 w-4 text-crimson-light" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass-strong border-white/10"
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {(user.first_name || user.last_name) && (
                      <p className="font-medium text-offwhite">
                        {user.first_name || ""} {user.last_name || ""}
                      </p>
                    )}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-slate-body">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {!pathname.startsWith("/admin") &&
                  (user?.level === "Ghost"
                    ? 4
                    : user?.level === "Manager"
                      ? 3
                      : user?.level === "Editor"
                        ? 2
                        : 1) >= 3 && (
                    <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                      <Link href="/admin/dashboard">{t("adminPanel")}</Link>
                    </DropdownMenuItem>
                  )}
                <DropdownMenuItem asChild className="text-offwhite focus:bg-white/10 focus:text-offwhite cursor-pointer">
                  <Link href={`/${locale}/profile`}>{t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-crimson-light focus:bg-white/10 focus:text-crimson-light cursor-pointer"
                >
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !pathname.startsWith("/admin") &&
            !pathname.includes("/login") &&
            !pathname.includes("/register") && (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link href={`/${locale}/login`}>
                  <Button
                    variant="ghost"
                    className="text-slate-body hover:text-offwhite hover:bg-white/[0.04]"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button className="bg-crimson hover:bg-crimson-light text-white shadow-sm shadow-crimson/20">
                    {t("register")}
                  </Button>
                </Link>
              </div>
            )
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-lg text-slate-body hover:text-offwhite hover:bg-white/[0.04]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={locale === "fa" || locale === "ar" ? "left" : "right"}
              className={cn(
                "glass-strong border-white/10 w-80 max-w-full [&>button:last-child]:hidden z-[999] overflow-y-auto",
                locale === "fa" || locale === "ar"
                  ? "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
                  : ""
              )}
            >
              <SheetHeader className="relative pe-8">
                <SheetClose className="absolute end-4 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
                <SheetTitle className="text-start text-offwhite flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-crimson flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  ZiWound
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-6">
                <nav className="flex flex-col gap-1">
                  {pathname.startsWith("/admin") ? (
                    <>
                      <MobileLink href="/admin/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                        {tAdmin("dashboard")}
                      </MobileLink>
                      <MobileLink href={`/${locale}/about`}>{t("about")}</MobileLink>
                      <MobileLink href={`/${locale}/contact`}>{t("contact")}</MobileLink>
                      <MobileLink href={`/${locale}/faq`}>{t("faq")}</MobileLink>
                      <MobileLink href="/admin/reports" icon={<FileText className="h-4 w-4" />}>
                        {tAdmin("reports")}
                      </MobileLink>
                      {(user?.level === "Ghost" ? 4 : user?.level === "Manager" ? 3 : user?.level === "Editor" ? 2 : 1) >= 3 && (
                        <MobileLink href="/admin/users" icon={<Users className="h-4 w-4" />}>
                          {tAdmin("users")}
                        </MobileLink>
                      )}
                      <MobileLink href="/admin/tags" icon={<Tags className="h-4 w-4" />}>
                        {tAdmin("tags")}
                      </MobileLink>
                      <MobileLink href="/admin/categories" icon={<FolderOpen className="h-4 w-4" />}>
                        {tAdmin("categories")}
                      </MobileLink>
                      <MobileLink href="/admin/files" icon={<FileImage className="h-4 w-4" />}>
                        {tAdmin("files")}
                      </MobileLink>
                      <div className="my-2 h-px bg-white/10" />
                      <MobileLink href={`/${locale}/reports/my`}>{t("myReports")}</MobileLink>
                      <MobileLink href={`/${locale}/reports/new`}>{t("newReport")}</MobileLink>
                      <MobileLink href={`/${locale}/documents`}>{t("documents")}</MobileLink>
                      <MobileLink href={`/${locale}/blog`}>{t("blog")}</MobileLink>
                      <MobileLink href={`/${locale}/war-crimes`}>{t("warCrimes")}</MobileLink>
                    </>
                  ) : (
                    <>
                      <MobileLink href={`/${locale}`}>{t("home")}</MobileLink>
                      <MobileLink href={`/${locale}/explore`}>{t("explore")}</MobileLink>
                      <MobileLink href={`/${locale}/war-crimes`}>{t("warCrimes")}</MobileLink>
                      <MobileLink href={`/${locale}/documents`}>{t("documents")}</MobileLink>
                      <MobileLink href={`/${locale}/war-criminals`}>{t("warCriminals")}</MobileLink>
                      <MobileLink href={`/${locale}/reporters`}>{t("reporters")}</MobileLink>
                      <MobileLink href={`/${locale}/blog`}>{t("blog")}</MobileLink>
                      <div className="my-2 h-px bg-white/10" />
                      <MobileLink href={`/${locale}/about`}>{t("about")}</MobileLink>
                      <MobileLink href={`/${locale}/contact`}>{t("contact")}</MobileLink>
                      <MobileLink href={`/${locale}/faq`}>{t("faq")}</MobileLink>
                      <MobileLink href={`/${locale}/help`}>{t("help")}</MobileLink>
                      <MobileLink href={`/${locale}/privacy`}>{t("privacy")}</MobileLink>
                      <MobileLink href={`/${locale}/terms`}>{t("terms")}</MobileLink>
                      {isAuthenticated && (
                        <>
                          <div className="my-2 h-px bg-white/10" />
                          <MobileLink href={`/${locale}/reports/my`}>{t("myReports")}</MobileLink>
                          <MobileLink href={`/${locale}/reports/new`}>{t("newReport")}</MobileLink>
                        </>
                      )}
                    </>
                  )}
                </nav>
                {!isAuthenticated &&
                  !pathname.startsWith("/admin") &&
                  !pathname.includes("/login") &&
                  !pathname.includes("/register") && (
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                      <Link href={`/${locale}/login`}>
                        <Button variant="outline" className="w-full border-white/10 text-offwhite hover:bg-white/5">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/register`}>
                        <Button className="w-full bg-crimson hover:bg-crimson-light text-white">
                          {t("register")}
                        </Button>
                      </Link>
                    </div>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-body hover:text-offwhite hover:bg-white/[0.04] transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
