"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { AuthHeader } from "../components/AuthHeader";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordView() {
  const { form, onSubmit, isPending } = useForgotPassword();
  const t = useTranslations("Auth.forgotPassword");

  return (
    <Card className="border-none shadow-none bg-transparent">
      <AuthHeader title={t("title")} description={t("subtitle")} />

      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 ml-1">
                    {t("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8">
          <Typography variant="small" className="text-gray-600">
            {t("rememberPassword")}{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-bg hover:underline"
            >
              {t("login")}
            </Link>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
