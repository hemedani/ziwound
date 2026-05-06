import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ziwound — Documenting War Crimes",
  description: "A solemn platform for documenting war crimes and human rights violations.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ziwound",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale = "fa";
  try {
    locale = await getLocale();
  } catch (error) {
    locale = "fa";
  }

  const isRTL = locale === "fa" || locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="font-sans antialiased min-h-screen"
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
