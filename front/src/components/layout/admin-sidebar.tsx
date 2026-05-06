"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  FolderOpen,
  FileImage,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Globe,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navigation = [
    { name: t("dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("reports"), href: "/admin/reports", icon: FileText },
    { name: t("users"), href: "/admin/users", icon: Users, requiresLevel: 3 },
    { name: t("tags"), href: "/admin/tags", icon: Tags },
    { name: t("categories"), href: "/admin/categories", icon: FolderOpen },
    { name: t("countries") || "Countries", href: "/admin/countries", icon: Globe },
    { name: t("provinces") || "Provinces", href: "/admin/provinces", icon: Globe },
    { name: t("cities") || "Cities", href: "/admin/cities", icon: Globe },
    { name: t("files"), href: "/admin/files", icon: FileImage },
    { name: t("documents"), href: "/admin/documents", icon: FileText },
    { name: t("blog") || "Blog", href: "/admin/blog", icon: BookOpen },
  ];

  const filteredNavigation = navigation.filter(
    (item) =>
      !item.requiresLevel ||
      (user &&
        (user.level === "Ghost"
          ? 4
          : user.level === "Manager"
            ? 3
            : user.level === "Editor"
              ? 2
              : 1) >= item.requiresLevel),
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-50 hidden md:flex flex-col transition-all duration-300",
        "bg-[#0c0c0c] border-e border-white/[0.06]",
        collapsed
          ? "w-0 -translate-x-full md:translate-x-0 md:w-16 overflow-hidden md:overflow-visible"
          : "w-64 max-md:w-full max-md:z-[60]",
      )}
    >
      {/* Header with logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-crimson flex items-center justify-center shadow-lg shadow-crimson/20">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-offwhite tracking-tight">{t("adminPanel")}</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-slate-body hover:text-offwhite hover:bg-white/5 rounded-lg",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-crimson/15 text-crimson-light border border-crimson/20"
                  : "text-slate-body hover:bg-white/[0.04] hover:text-offwhite",
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-crimson-light")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-white/[0.06] p-4">
          <div className="text-xs text-slate-body/60">
            <p>{t("version")} 0.1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
