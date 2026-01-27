"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { useFormState } from "react-dom";
import { registerRestaurantAction } from "@/app/actions/auth/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Separator } from "@radix-ui/react-separator";
import { FaApple } from "react-icons/fa";
import { GoogleAuthButton } from "@/components/modules/auth/GoogleAuthButton";

export default function RestaurantRegisterView() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();

  const [state, formAction] = useFormState(registerRestaurantAction, null);

  useEffect(() => {
    if (!state) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    if (state.success && state.data) {
      const identifier = state.data.email;
      sessionStorage.setItem("pendingVerificationEmail", identifier);
      toast.success("Business account created! Verify your OTP.");

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
      <Card className="border-none shadow-none bg-transparent m-0 p-0">
        <CardHeader className="px-0 pt-0 text-center">
          <Typography
            variant="h2"
            className="text-emerald-bg border-none p-0 m-0"
          >
            Partner with Us
          </Typography>
          <Typography variant="muted" className="mt-2">
            Grow your business by reaching more customers
          </Typography>
        </CardHeader>

        <CardContent className="px-0">
          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GoogleAuthButton
              role="restaurant_owner"
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
              placeholder="Owner Name"
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "Register Restaurant"
              )}
            </Button>
          </form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600 pb-0.5"
          >
            Already a partner?{" "}
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
