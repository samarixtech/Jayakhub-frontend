"use client";
import { Mail, Loader2 } from "lucide-react";
import { CustomerProfileData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePersonalInfo } from "./usePersonalInfo";
import { useTranslations } from "next-intl";

interface PersonalInfoFormProps {
  profile: CustomerProfileData;
  updateProfile: (data: Partial<CustomerProfileData>) => void;
}

export function PersonalInfoForm({
  profile,
  updateProfile,
}: PersonalInfoFormProps) {
  const { form, isPending, onSubmit } = usePersonalInfo(profile, updateProfile);
  const t = useTranslations("CustomerDashboard.ProfileSettings");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FIRST NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  {t("first_name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("first_name_placeholder")}
                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LAST NAME */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  {t("last_name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("last_name_placeholder")}
                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL ADDRESS (DISABLED) */}
          <FormItem>
            <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              {t("email_address")}
            </FormLabel>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <FormControl>
                <Input
                  disabled
                  value={profile.email || ""}
                  className="pl-12 rounded-2xl border-gray-100 bg-gray-100/50 h-12 cursor-not-allowed text-gray-500"
                />
              </FormControl>
            </div>
          </FormItem>

          {/* PHONE NUMBER */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  {t("phone_number")}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="PK"
                    placeholder={t("phone_placeholder")}
                    className="rounded-2xl border-gray-100 bg-gray-100/50 h-12 focus-visible:ring-emerald-bg"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="bg-emerald-bg hover:bg-emerald-bg-hover text-white font-bold rounded-xl h-12 px-8"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              </>
            ) : (
              t("save_changes")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
