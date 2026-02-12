"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { resetPasswordAction } from "@/app/actions/auth/auth";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useZodForm } from "@/hooks/use-zod-form";

export default function NewPasswordView() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { country, language } = useLocale();

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { execute, isPending } = useServerAction(resetPasswordAction, {
    onSuccess: () => {
      sessionStorage.clear();
      router.push(`/${country}/${language}/login`);
    },
  });

  useEffect(() => {
    const email = sessionStorage.getItem("pendingVerificationEmail");
    const otp = sessionStorage.getItem("pendingOTP");

    if (!email || !otp) {
      toast.error("Session expired. Please start over.");
      router.push(`/${country}/${language}/forgot-password`);
    }
  }, [country, language, router]);

  const onSubmit = (data: ResetPasswordInput) => {
    execute(data);
  };

  return (
    <Card className="border-none shadow-none bg-transparent m-0 p-0">
      <CardHeader className="px-0 pt-0 mb-6 text-center">
        <Typography variant="h2" className="text-emerald-bg">
          New Password
        </Typography>
        <Typography variant="muted" className="mt-2">
          Enter your new security credentials
        </Typography>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-emerald-bg text-white rounded-xl text-lg font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
