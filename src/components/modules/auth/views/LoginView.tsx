"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
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
import { SocialAuthButtons } from "../components/SocialAuthButtons";
import { AuthDivider } from "../components/AuthDivider";
import { PasswordField } from "../components/PasswordField";
import { useLogin } from "../hooks/useLogin";

export default function LoginView() {
  const { form, onSubmit, isPending, isGoogleLoading, setIsGoogleLoading } =
    useLogin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Auth.login");

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "session-expired") {
      toast.error(t("sessionExpired"));
      router.replace(pathname);
    } else if (reason === "account-suspended") {
      toast.error(t("accountSuspended"));
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, t]);

  return (
    <Card className="border-none shadow-none bg-transparent py-2">
      <AuthHeader title={t("title")} description={t("subtitle")} />

      <CardContent className="px-0">
        <SocialAuthButtons
          isGoogleLoading={isGoogleLoading}
          setIsGoogleLoading={setIsGoogleLoading}
          isPending={isPending}
        />

        <AuthDivider text={t("orContinueWithEmail")} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-1"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{t("emailSrLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      className="h-13 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mt-2">
                <Link
                  href="/forget-password"
                  className="text-xs text-gray-400 hover:text-emerald-bg transition-colors font-bold"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-13 bg-emerald-bg hover:bg-emerald-bg-hover text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </Form>

        <Typography variant="small" className="mt-8 text-center text-gray-600">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-emerald-bg font-bold hover:underline"
          >
            {t("createAccount")}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
