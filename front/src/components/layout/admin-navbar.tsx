"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LogOut,
  User,
  Shield,
  Bell,
  Plus,
  Menu,
  FileText,
  BookOpen,
  CheckCircle,
  ArrowLeftFromLine,
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
import { cn } from "@/lib/utils";

interface AdminNavbarProps {
  onMobileMenuToggle: () => void;
}

export function AdminNavbar({ onMobileMenuToggle }: AdminNavbarProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logoutAction();
    logout();
    router.push("/fa/login");
  };

  const quickActions = [
    { label: t("reports") || "Reports", href: "/admin/reports", icon: FileText },
    { label: t("blog") || "Blog", href: "/admin/blog", icon: BookOpen },
    { label: t("documents") || "Documents", href: "/admin/documents", icon: CheckCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] glass-strong">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile menu + spacer */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="md:hidden text-slate-body hover:text-offwhite hover:bg-white/5 rounded-lg"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: Quick Actions */}
        <div className="hidden md:flex items-center gap-1">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-body hover:text-offwhite hover:bg-white/[0.04] transition-all"
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-white/[0.06] mx-1.5" />
          <Link
            href="/fa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gold hover:text-offwhite hover:bg-white/[0.04] transition-all"
          >
            <ArrowLeftFromLine className="h-3.5 w-3.5" />
            {t("viewSite") || "Return to Website"}
          </Link>
        </div>

        {/* Right: Notifications, User */}
        <div className="flex items-center gap-2">
          {/* Notifications placeholder */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-slate-body hover:text-offwhite hover:bg-white/5 relative"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 end-1.5 h-1.5 w-1.5 rounded-full bg-crimson animate-pulse-glow" />
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 h-auto text-slate-body hover:text-offwhite hover:bg-white/5"
                  aria-label="User menu"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center ring-2 ring-crimson/20">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-medium text-offwhite leading-tight">
                      {user.first_name || ""} {user.last_name || ""}
                    </span>
                    <span className="text-[10px] text-slate-body/60 leading-tight">
                      {user.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass-strong border-white/10"
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="h-8 w-8 rounded-full bg-crimson/20 flex items-center justify-center border border-crimson/30 shrink-0">
                    <Shield className="h-4 w-4 text-crimson-light" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-offwhite">
                      {user.first_name || ""} {user.last_name || ""}
                    </p>
                    <span className="inline-flex items-center rounded-md bg-crimson/10 px-1.5 py-0.5 text-[10px] font-medium text-crimson-light w-fit ring-1 ring-inset ring-crimson/20">
                      {t(`level_${user.level}` as any) || user.level}
                    </span>
                  </div>
                </div>
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
          )}
        </div>
      </div>
    </header>
  );
}
