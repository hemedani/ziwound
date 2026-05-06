"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "@/app/actions/user/registerUser";
import { Link, useRouter } from "@/i18n/routing";
import { Loader2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/authStore";

const registerSchema = z.object({
  first_name: z.string().min(1, "auth.firstNameRequired"),
  last_name: z.string().min(1, "auth.lastNameRequired"),
  email: z.string().email("auth.emailInvalid"),
  password: z.string().min(6, JSON.stringify({ key: "validation.minLength", values: { min: 6 } })),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    const result = await registerUser({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      gender: "Male",
    });

    if (result.success) {
      toast({
        title: t("common.success"),
        description: t("auth.registerSuccess"),
      });
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: result.error || t("auth.registerFailed"),
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
              {t("auth.registerTitle")}
            </h1>
            <p className="text-sm text-slate-body">
              {t("auth.registerDescription")}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-offwhite">{t("auth.firstName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-offwhite">{t("auth.lastName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={loading}
                          className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                {loading ? t("common.loading") : t("auth.registerButton")}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-body">
              {t("auth.hasAccount")}{" "}
              <Link
                href="/login"
                className="text-gold font-medium hover:text-gold-light transition-colors"
              >
                {t("auth.loginButton")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
