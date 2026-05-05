"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Moon,
  Sun,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  FolderOpen,
  FileImage,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const t = useTranslations("header");
  const tAdmin = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    logout();
    router.push(`/${locale}`);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl">{t("appName")}</span>
        </Link>

        {/* Navigation links - show on public routes for all users */}
        {!pathname.startsWith("/admin") && !pathname.includes("/login") && !pathname.includes("/register") && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("contact")}
            </Link>
            <Link
              href={`/${locale}/faq`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("faq")}
            </Link>
            <Link
              href={`/${locale}/war-crimes`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("warCrimes")}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("blog")}
            </Link>
            <Link
              href={`/${locale}/documents`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("documents")}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href={`/${locale}/reports/my`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {t("myReports")}
                </Link>
                <Link
                  href={`/${locale}/reports/new`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {t("newReport")}
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-2"
            onClick={toggleTheme}
            title={mounted && theme === "dark" ? t("lightMode") : t("darkMode")}
            aria-label={mounted && theme === "dark" ? t("lightMode") : t("darkMode")}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={t("profile") || "User menu"}
                >
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {(user.first_name || user.last_name) && (
                      <p className="font-medium">
                        {user.first_name || ""} {user.last_name || ""}
                      </p>
                    )}
                    {user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                {!pathname.startsWith("/admin") &&
                  (user?.level === "Ghost"
                    ? 4
                    : user?.level === "Manager"
                      ? 3
                      : user?.level === "Editor"
                        ? 2
                        : 1) >= 3 && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">{t("adminPanel")}</Link>
                    </DropdownMenuItem>
                  )}
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/profile`}>{t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !pathname.startsWith("/admin") &&
            !pathname.includes("/login") &&
            !pathname.includes("/register") && (
              <div className="flex gap-2">
                <Link href={`/${locale}/login`}>
                  <Button variant="ghost" className="w-full cursor-pointer">
                    {t("login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button className="w-full cursor-pointer">{t("register")}</Button>
                </Link>
              </div>
            )
          )}

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "fa" || locale === "ar" ? "right" : "left"}>
              <SheetHeader>
                <SheetTitle className="text-start">{t("appName")}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {isAuthenticated && (
                  <nav className="flex flex-col gap-4">
                    {pathname.startsWith("/admin") ? (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>{tAdmin("dashboard")}</span>
                        </Link>
                        <Link
                          href={`/${locale}/about`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("about")}
                        </Link>
                        <Link
                          href={`/${locale}/contact`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("contact")}
                        </Link>
                        <Link
                          href={`/${locale}/faq`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("faq")}
                        </Link>
                        <Link
                          href="/admin/reports"
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{tAdmin("reports")}</span>
                        </Link>
                        {(user?.level === "Ghost"
                          ? 4
                          : user?.level === "Manager"
                            ? 3
                            : user?.level === "Editor"
                              ? 2
                              : 1) >= 3 && (
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                          >
                            <Users className="h-4 w-4" />
                            <span>{tAdmin("users")}</span>
                          </Link>
                        )}
                        <Link
                          href="/admin/tags"
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          <Tags className="h-4 w-4" />
                          <span>{tAdmin("tags")}</span>
                        </Link>
                        <Link
                          href="/admin/categories"
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>{tAdmin("categories")}</span>
                        </Link>
                        <Link
                          href="/admin/files"
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          <FileImage className="h-4 w-4" />
                          <span>{tAdmin("files")}</span>
                        </Link>
                        <div className="my-2 h-px bg-muted" />
                        <Link
                          href={`/${locale}/reports/my`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("myReports")}
                        </Link>
                        <Link
                          href={`/${locale}/reports/new`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("newReport")}
                        </Link>
                        <Link
                          href={`/${locale}/documents`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("documents")}
                        </Link>
<Link
                          href={`/${locale}/blog`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("blog")}
                        </Link>
                        <Link
                          href={`/${locale}/war-crimes`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("warCrimes")}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/${locale}/about`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("about")}
                        </Link>
                        <Link
                          href={`/${locale}/contact`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("contact")}
                        </Link>
                        <Link
                          href={`/${locale}/faq`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("faq")}
                        </Link>
                        <Link
                          href={`/${locale}/war-crimes`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("warCrimes")}
                        </Link>
                        <Link
                          href={`/${locale}/blog`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("blog")}
                        </Link>
                        <Link
                          href={`/${locale}/documents`}
                          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                          {t("documents")}
                        </Link>
                        {isAuthenticated && (
                          <>
                            <Link
                              href={`/${locale}/reports/my`}
                              className="text-sm font-medium hover:text-primary transition-colors"
                            >
                              {t("myReports")}
                            </Link>
                            <Link
                              href={`/${locale}/reports/new`}
                              className="text-sm font-medium hover:text-primary transition-colors"
                            >
                              {t("newReport")}
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </nav>
                )}
                {!isAuthenticated &&
                  !pathname.startsWith("/admin") &&
                  !pathname.includes("/login") &&
                  !pathname.includes("/register") && (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href={`/${locale}/login`}>
                        <Button variant="outline" className="w-full">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/register`}>
                        <Button className="w-full">{t("register")}</Button>
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
