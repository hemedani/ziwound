"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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
  ImageIcon,
  MapPin,
  Gavel,
  HardDrive,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  nameKey: string;
  href: string;
  icon: React.ElementType;
  requiresLevel?: number;
}

interface NavSection {
  labelKey?: string | null;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    labelKey: null,
    items: [
      { nameKey: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    labelKey: "content",
    items: [
      { nameKey: "reports", href: "/admin/reports", icon: FileText },
      { nameKey: "documents", href: "/admin/documents", icon: FileText },
      { nameKey: "blog", href: "/admin/blog", icon: BookOpen },
      { nameKey: "heroSlides", href: "/admin/hero-slides", icon: ImageIcon },
      { nameKey: "warCriminals", href: "/admin/war-criminals", icon: Gavel },
    ],
  },
  {
    labelKey: "categorization",
    items: [
      { nameKey: "tags", href: "/admin/tags", icon: Tags },
      { nameKey: "categories", href: "/admin/categories", icon: FolderOpen },
    ],
  },
  {
    labelKey: "geography",
    items: [
      { nameKey: "countries", href: "/admin/countries", icon: Globe },
      { nameKey: "provinces", href: "/admin/provinces", icon: MapPin },
      { nameKey: "cities", href: "/admin/cities", icon: MapPin },
    ],
  },
  {
    labelKey: "system",
    items: [
      { nameKey: "users", href: "/admin/users", icon: Users, requiresLevel: 3 },
      { nameKey: "files", href: "/admin/files", icon: HardDrive },
    ],
  },
];

function getLevelValue(level: string): number {
  return level === "Ghost" ? 4 : level === "Manager" ? 3 : level === "Editor" ? 2 : 1;
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === "fa" || locale === "ar";
  const { user } = useAuthStore();
  const userLevel = getLevelValue(user?.level || "Ordinary");

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        onClick={mobileOpen ? onMobileClose : undefined}
        className={cn(
          "fixed inset-y-0 start-0 z-[60] flex flex-col transition-all duration-300",
          "glass-strong border-e border-white/[0.06]",
          mobileOpen
            ? "translate-x-0 w-64"
            : isRtl
              ? "translate-x-full w-64"
              : "-translate-x-full w-64",
          "md:flex",
          collapsed && !mobileOpen
            ? "md:w-16 md:translate-x-0"
            : "md:w-64 md:translate-x-0",
          collapsed && mobileOpen ? "w-64" : "",
        )}
      >
      <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
      {/* Logo Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06] shrink-0">
        {(!collapsed || mobileOpen) && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center shadow-lg shadow-crimson/20 group-hover:shadow-crimson/30 transition-shadow">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-offwhite tracking-tight leading-tight">
                ZiWound
              </span>
              <span className="text-[10px] text-gold font-medium tracking-widest uppercase leading-tight">
                {t("adminPanel")}
              </span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "text-slate-body hover:text-offwhite hover:bg-white/5 rounded-lg shrink-0",
            collapsed && "mx-auto",
          )}
        >
          {collapsed ? (
            <PanelRightOpen className="h-4 w-4" />
          ) : (
            <PanelRightClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {navSections.map((section) => {
          const filteredItems = section.items.filter(
            (item) => !item.requiresLevel || userLevel >= item.requiresLevel,
          );
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.labelKey || "primary"}>
              {section.labelKey && (!collapsed || mobileOpen) && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-body/50">
                  {t(section.labelKey) || section.labelKey}
                </p>
              )}
              <div className="space-y-0.5">
                {filteredItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={mobileOpen ? onMobileClose : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-gradient-to-r from-crimson/[0.12] to-transparent text-crimson-light border-s-2 border-crimson"
                          : "text-slate-body hover:bg-white/[0.04] hover:text-offwhite border-s-2 border-transparent",
                      )}
                      title={collapsed ? t(item.nameKey) || item.nameKey : undefined}
                    >
                      <item.icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0 transition-colors",
                          isActive && "text-crimson-light",
                        )}
                      />
                      {(!collapsed || mobileOpen) && (
                        <span className="truncate">
                          {t(item.nameKey) || item.nameKey}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer User Info */}
      {(!collapsed || mobileOpen) && user && (
        <div className="border-t border-white/[0.06] p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-crimson/20 flex items-center justify-center border border-crimson/30 shrink-0">
              <span className="text-xs font-bold text-crimson-light">
                {user.first_name?.[0] || user.email?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-offwhite truncate">
                {user.first_name || ""} {user.last_name || ""}
              </p>
              <span className="inline-flex items-center rounded-md bg-crimson/10 px-1.5 py-0.5 text-[10px] font-medium text-crimson-light ring-1 ring-inset ring-crimson/20">
                {t(`level_${user.level}` as any) || user.level}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    </aside>
    </>
  );
}
