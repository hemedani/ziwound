import { redirect } from "next/navigation";
import { getMe } from "@/app/actions/user/getMe";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AdminLayoutShell } from "@/components/layout/admin-layout-shell";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { success, body: user } = await getMe({
    _id: 1,
    first_name: 1,
    last_name: 1,
    email: 1,
    level: 1,
    is_verified: 1,
  });

  if (!success || !user) {
    redirect("/fa/login");
  }

  const isAdmin = ["Ghost", "Manager", "Editor"].includes(user.level);
  if (!isAdmin) {
    redirect("/fa/reports");
  }

  const messages = await getMessages({ locale: "fa" });

  return (
    <NextIntlClientProvider messages={messages} locale="fa">
      <Toaster />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </NextIntlClientProvider>
  );
}
