"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { addUser } from "@/app/actions/user/addUser";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "validation.required"),
  last_name: z.string().min(1, "validation.required"),
  father_name: z.string().min(1, "validation.required"),
  mobile: z.string().min(10, JSON.stringify({ key: "validation.minLength", values: { min: 10 } })),
  national_number: z
    .string()
    .min(10, JSON.stringify({ key: "validation.minLength", values: { min: 10 } })),
  address: z.string().min(1, "validation.required"),
  gender: z.enum(["Male", "Female"]),
  level: z.enum(["Ghost", "Manager", "Editor", "Ordinary"]),
  is_verified: z.boolean().default(true),
});

export function AddUserModal() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [_isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      father_name: "",
      mobile: "",
      national_number: "",
      address: "",
      gender: "Male",
      level: "Ordinary",
      is_verified: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await addUser(values, { _id: 1 });
      if (res?.success) {
        toast({
          title: t("success") || "Success",
          description: t("userAdded"),
        });
        setIsOpen(false);
        form.reset();
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast({
          variant: "destructive",
          title: t("error") || "Error",
          description: res?.error || t("userAddFailed"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error") || "Error",
        description: t("unexpectedError"),
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="me-2 h-4 w-4" />
          {t("addUser") || "Add User"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("addUser") || "Add New User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName") || "First Name"}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("firstNamePlaceholder") || "First name"} {...field} />
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
                    <FormLabel>{t("lastName") || "Last Name"}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("lastNamePlaceholder") || "Last name"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="father_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fatherName") || "Father Name"}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("fatherNamePlaceholder") || "Father name"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="national_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("nationalNumber") || "National Number"}</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("mobile") || "Mobile"}</FormLabel>
                    <FormControl>
                      <Input placeholder="09123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("gender") || "Gender"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectGender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">{t("gender_Male") || "Male"}</SelectItem>
                        <SelectItem value="Female">{t("gender_Female") || "Female"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("level") || "Role/Level"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectLevel")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ordinary">{t("level_Ordinary") || "Ordinary"}</SelectItem>
                        <SelectItem value="Editor">{t("level_Editor") || "Editor"}</SelectItem>
                        <SelectItem value="Manager">{t("level_Manager") || "Manager"}</SelectItem>
                        <SelectItem value="Ghost">{t("level_Ghost") || "Ghost"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_verified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4 mt-6">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("isVerified") || "Is Verified"}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address") || "Address"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("addressPlaceholder") || "Full address"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? t("loading") || "Loading..." : t("submit") || "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
