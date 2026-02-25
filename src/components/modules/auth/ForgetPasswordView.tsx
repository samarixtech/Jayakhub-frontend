"use client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { forgotPasswordAction } from "@/app/actions/auth/auth";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";
import Link from "next/link";

export default function ForgotPasswordView() {
  const router = useRouter();
  const { country, language } = useLocale();

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: {
      email: "",
    },
  });

  const { execute, isPending } = useServerAction(forgotPasswordAction, {
    onSuccess: (data: any) => {
      if (data?.email) {
        sessionStorage.setItem("pendingVerificationEmail", data.email);
        sessionStorage.setItem("verificationIntent", "forgot-password");
        const verifyPath = `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp`;
        router.push(verifyPath);
      }
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    execute(data);
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 text-center">
        <Typography variant="h2" className="text-emerald-bg border-none mb-2">
          Reset Password
        </Typography>

        <Typography variant="muted">
          We will send a 6-digit verification code to your email to reset your
          password.
        </Typography>
      </CardHeader>

      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 ml-1">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
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
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </>
              ) : (
                "Send Reset Code"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8">
          <Typography variant="small" className="text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-bg hover:underline"
            >
              Login
            </Link>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
