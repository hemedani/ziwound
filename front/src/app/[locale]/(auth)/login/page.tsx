"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/app/actions/user/login";
import { Link, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("auth.emailInvalid"),
  password: z.string().min(1, "auth.passwordRequired"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    const result = await login({ email: data.email, password: data.password });

    if (result.success) {
      if (result.user) {
        setUser(result.user);
        setToken("authenticated");
      }
      toast({
        title: t("common.success"),
        description: t("auth.loginSuccess"),
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: result.error || t("auth.invalidCredentials"),
      });
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(153,27,27,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="rounded-2xl glass-strong p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson/10 ring-1 ring-crimson/20">
              <Shield className="h-7 w-7 text-crimson" />
            </div>
            <h1 className="text-2xl font-bold text-offwhite mb-2">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-sm text-slate-body">
              {t("auth.loginDescription")}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-offwhite">{t("auth.email")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                        disabled={loading}
                        className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-offwhite">{t("auth.password")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                        className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-crimson hover:bg-crimson-light text-white gap-2 h-11 animate-pulse-glow"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? t("common.loading") : t("auth.loginButton")}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-body">
              {t("auth.noAccount")}{" "}
              <Link
                href="/register"
                className="text-gold font-medium hover:text-gold-light transition-colors"
              >
                {t("auth.registerButton")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
