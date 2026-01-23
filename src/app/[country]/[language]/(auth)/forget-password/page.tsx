"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { forgotPasswordAction } from "@/app/actions/auth/auth";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LocalizedLink from "@/components/navigation/LocalizedLink";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { country, language } = useLocale();
  const [state, formAction] = useFormState(forgotPasswordAction, null);

  useEffect(() => {
    if (!state) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    if (state.success && state.data) {
      sessionStorage.setItem("pendingVerificationEmail", state.data.email);

      sessionStorage.setItem("verificationIntent", "forgot-password");

      toast.success(state.message || "Reset code sent!");

      const verifyPath = `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp`;
      router.push(verifyPath);
    } else if (!state.success) {
      toast.error(state.message || "Reset failed. Please try again.");
    }
  }, [state, router, country, language]);

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
        <form
          action={(formData) => {
            setLoading(true);
            formAction(formData);
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600 ml-1">
              Email Address
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@mail.com"
              required
              className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <Typography variant="small" className="text-gray-600">
            Remember your password?{" "}
            <LocalizedLink
              href="/login"
              className="font-bold text-emerald-bg hover:underline"
            >
              Login
            </LocalizedLink>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
