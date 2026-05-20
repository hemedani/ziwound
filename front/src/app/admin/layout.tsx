import { redirect } from "next/navigation";
import { getMe } from "@/app/actions/user/getMe";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AdminLayoutShell } from "@/components/layout/admin-layout-shell";
import { Toaster } from "@/components/ui/toaster";

// Force dynamic rendering — admin routes must read the auth token cookie at request time.
// Without this, Next.js may statically generate the layout at build time (empty cookie store)
// and bake the redirect into the HTML, breaking admin access in production.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { success, body: user } = await getMe();

  if (!success || !user) {
    redirect("/fa/login");
  }

  const isAdmin = ["Ghost", "Manager", "Editor"].includes(user.level);
  if (!isAdmin) {
    redirect("/fa/reports");
  }

  // Admin panel defaults to Persian (fa) since it has no locale prefix in the URL
  const messages = await getMessages({ locale: "fa" });

  return (
    <NextIntlClientProvider messages={messages} locale="fa">
      <Toaster />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </NextIntlClientProvider>
  );
}
