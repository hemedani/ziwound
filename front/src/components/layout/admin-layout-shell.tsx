"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminNavbar } from "./admin-navbar";
import { cn } from "@/lib/utils";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a]">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "ms-0 md:ms-16" : "ms-0 md:ms-64",
        )}
      >
        <AdminNavbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
