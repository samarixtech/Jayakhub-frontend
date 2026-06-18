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
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { Typography } from "@/components/ui/typography";
import { AuthHeader } from "../components/AuthHeader";
import { SocialAuthButtons } from "../components/SocialAuthButtons";
import { AuthDivider } from "../components/AuthDivider";
import { PasswordField } from "../components/PasswordField";
import { useCustomerRegister } from "../hooks/useCustomerRegister";

export default function CustomerRegisterView() {
  const t = useTranslations("authModal");
  const { form, onSubmit, isPending, isGoogleLoading, setIsGoogleLoading } =
    useCustomerRegister();

  return (
    <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
      <AuthHeader
        title={t("createAccount")}
        description={t("freeDelivery")}
        compact={true}
      />

      <CardContent className="px-0">
        <SocialAuthButtons
          role="customer"
          isGoogleLoading={isGoogleLoading}
          setIsGoogleLoading={setIsGoogleLoading}
          isPending={isPending}
        />

        <AuthDivider text="Or register with email" compact={true} />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mx-1 transition-all"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      className="h-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg transition-all"
                      {...field}
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
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      className="h-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PhoneInput
                      placeholder="Phone Number"
                      maxLength={14}
                      defaultCountry="PK"
                      className="h-12 rounded-xl [&_button]:rounded-s-xl [&_input]:rounded-e-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg transition-all"
                      {...field}
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
                  <FormControl>
                    <PasswordField field={field} compact={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordField
                      field={field}
                      placeholder="Confirm Password"
                      compact={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none ">
                    <FormLabel className="text-sm font-normal text-gray-500">
                      I agree to the{" "}
                      <Link
                        href="/terms-of-service"
                        className="font-bold text-emerald-bg hover:underline"
                      >
                        Terms and Conditions
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending || !form.watch("terms")}
              className="w-full h-11 bg-emerald-bg text-white text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <Typography
          variant="small"
          className="mt-3 text-center text-gray-600 mb-0 p-0"
        >
          {t("existingAccount")}{" "}
          <Link
            href="/login"
            className="text-emerald-bg font-bold hover:underline"
          >
            {t("login")}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}
