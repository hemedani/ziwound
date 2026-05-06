"use client";

import { z } from "zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeNewsletter } from "@/app/actions/newsletter/subscribe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

type NewsletterSignupProps = {
  className?: string;
};

export function NewsletterSignup({ className }: NewsletterSignupProps) {
  const t = useTranslations("newsletter");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const result = await subscribeNewsletter(values);

    if (result.success) {
      toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });
      form.reset();
      return;
    }

    toast({
      title: t("errorTitle"),
      description: result.body.message || t("errorDescription"),
      variant: "destructive",
    });
  };

  return (
    <div className={cn("mt-6 rounded-lg border bg-muted/40 p-4", className)}>
      <h4 className="text-sm font-semibold text-foreground">{t("title")}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{t("description")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    aria-label={t("emailLabel")}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting} className="sm:w-auto">
            {form.formState.isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
