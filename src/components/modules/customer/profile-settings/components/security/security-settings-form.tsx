"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/modules/auth/components/PasswordField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useSetPasswordForm,
  useChangePasswordForm,
} from "./useSecuritySettings";
import { useTranslations } from "next-intl";
import { CustomerProfileData } from "@/types";

interface SecuritySettingsFormProps {
  profile: CustomerProfileData;
}

export function SecuritySettingsForm({ profile }: SecuritySettingsFormProps) {
  const t = useTranslations("CustomerDashboard.ProfileSettings");

  const needsPasswordSet =
    profile.verification_status?.current_method === "google" &&
    profile.password === false;

  // Render the appropriate form depending on state
  if (needsPasswordSet) {
    return <SetPasswordForm t={t} />;
  }

  return <ChangePasswordForm t={t} />;
}

function SetPasswordForm({ t }: { t: any }) {
  const { form, isPending, onSubmit } = useSetPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <p className="text-[14px] font-bold text-gray-900">
            You are currently logged in with Google. Set a new password to
            secure your account.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    {t("new_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      error={!!fieldState.error}
                      placeholder={t("password_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    {t("confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      error={!!fieldState.error}
                      placeholder={t("password_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 h-12 font-bold min-w-[180px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ChangePasswordForm({ t }: { t: any }) {
  const { form, isPending, onSubmit } = useChangePasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <p className="text-[14px] font-bold text-gray-900">
            {t("change_password")}
          </p>

          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[12px] font-bold text-gray-900">
                  {t("current_password")}
                </FormLabel>
                <FormControl>
                  <PasswordField
                    field={field}
                    error={!!fieldState.error}
                    placeholder={t("password_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    {t("new_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      error={!!fieldState.error}
                      placeholder={t("password_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    {t("confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      error={!!fieldState.error}
                      placeholder={t("password_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 h-12 font-bold min-w-[180px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("update_password")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
