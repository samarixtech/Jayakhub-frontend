"use client";
import { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { useFormState } from "react-dom";
import { registerAction } from "@/app/actions/auth/auth";
import { GoogleAuthButton } from "@/components/modules/auth/GoogleAuthButton";

export default function CustomerRegisterView() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();

  const [state, formAction] = useFormState(registerAction, null);

  useEffect(() => {
    if (!state) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    if (state.success && state.data) {
      const identifier = state.data.email;
      sessionStorage.setItem("pendingVerificationEmail", identifier);
      toast.success(state.message || "OTP sent!");

      router.push(
        `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp?email=${encodeURIComponent(identifier)}`,
      );
    } else if (!state.success) {
      toast.error(state.message || "Registration failed");
    }
  }, [state, router, country, language]);

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
        {" "}
        <CardHeader className="px-0 pt-0 text-center">
          <Typography
            variant="h2"
            className="text-emerald-bg border-none p-0 m-0"
          >
            {t("createAccount")}
          </Typography>
          <Typography variant="muted" className="mt-2">
            {t("freeDelivery")}
          </Typography>
        </CardHeader>
        <CardContent className="px-0">
          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GoogleAuthButton
              role="customer"
              loading={loading}
              setLoading={setLoading}
              country={country}
              language={language}
            />
            <Button
              type="button"
              className="flex items-center justify-center gap-3 h-12 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold text-sm"
            >
              <FaApple className="text-xl" /> Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-gray-100" />
            </div>
            <div className="relative flex justify-center uppercase">
              <Typography
                as="span"
                className="bg-white px-4 text-[11px] text-gray-400 font-black tracking-widest"
              >
                Or register with email
              </Typography>
            </div>
          </div>

          {/* Registration Form */}
          <form
            action={(formData) => {
              setLoading(true);
              formAction(formData);
            }}
            className="space-y-4"
          >
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              className="h-14 rounded-xl"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="h-14 rounded-xl"
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              className="h-14 rounded-xl"
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="h-14 pr-12 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-bg text-white text-lg font-bold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600 pb-0.5"
          >
            {t("existingAccount")}{" "}
            <LocalizedLink
              href="/login"
              className="text-emerald-bg font-bold hover:underline"
            >
              {t("login")}
            </LocalizedLink>
          </Typography>
        </CardContent>
      </Card>
    </GoogleOAuthProvider>
  );
}
