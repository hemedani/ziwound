"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/app/actions/contact/send";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendContactMessage(data);
      
      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setError(result.error || t("formError"));
      }
    } catch (_err) {
      setError(t("formError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-offwhite">{t("successTitle")}</h3>
        <p className="text-slate-body">{t("successMessage")}</p>
        <Button 
          variant="outline" 
          className="mt-6 border-white/10 bg-white/5 text-offwhite hover:bg-white/10 hover:text-white"
          onClick={() => setIsSuccess(false)}
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-offwhite">{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("namePlaceholder")} 
                    {...field} 
                    className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-offwhite">{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t("emailPlaceholder")} 
                    {...field} 
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-offwhite">{t("subjectLabel")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 text-offwhite focus:ring-crimson h-11">
                    <SelectValue placeholder={t("subjectPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="glass-strong border-white/10">
                  <SelectItem value="general" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("subjectGeneral")}</SelectItem>
                  <SelectItem value="support" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("subjectSupport")}</SelectItem>
                  <SelectItem value="partnership" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("subjectPartnership")}</SelectItem>
                  <SelectItem value="media" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("subjectMedia")}</SelectItem>
                  <SelectItem value="other" className="text-offwhite focus:bg-white/10 focus:text-offwhite">{t("subjectOther")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-offwhite">{t("messageLabel")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("messagePlaceholder")} 
                  rows={5}
                  {...field} 
                  className="bg-white/5 border-white/10 text-offwhite placeholder:text-slate-body/50 focus-visible:ring-crimson"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="p-4 rounded-lg bg-crimson/10 text-crimson-light text-sm border border-crimson/20">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full md:w-auto bg-crimson hover:bg-crimson-light text-white gap-2 h-11"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? t("sending") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
