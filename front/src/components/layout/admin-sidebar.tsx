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
    {
      name: t("dashboard"),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("reports"),
      href: "/admin/reports",
      icon: FileText,
    },
    {
      name: t("users"),
      href: "/admin/users",
      icon: Users,
      requiresLevel: 3,
    },
    {
      name: t("tags"),
      href: "/admin/tags",
      icon: Tags,
    },
    {
      name: t("categories"),
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      name: t("files"),
      href: "/admin/files",
      icon: FileImage,
    },
  ];

  // Filter navigation items based on user level
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
        "fixed inset-y-0 start-0 z-50 hidden md:flex flex-col border-e bg-background transition-all duration-300",
        collapsed
          ? "w-0 -translate-x-full md:translate-x-0 md:w-16 overflow-hidden md:overflow-visible"
          : "w-64 max-md:w-full max-md:z-[60]",
      )}
    >
      {/* Header with toggle */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">{t("adminPanel")}</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className={cn(collapsed && "mx-auto")}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            <p>{t("version")} 0.1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
