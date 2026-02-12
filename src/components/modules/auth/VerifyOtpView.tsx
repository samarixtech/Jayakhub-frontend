"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { resendOtpAction, verifyOtpAction } from "@/app/actions/auth/auth";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";

export default function VerifyOtpView() {
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [email, setEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  const router = useRouter();
  const { country, language } = useLocale();

  // CHECK THAT IF VERIFICATION EMAIL IS STORED IN SESSION STORAGE (IF NOT, REDIRECT TO REGISTER)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (storedEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(storedEmail);
    } else {
      toast.error("No verification email found. Redirecting...");
      router.push(`/${country}/${language}/register`);
    }
  }, [router, country, language]);

  // COUNTDOWN TIMER
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // RESEND OTP HANDLER
  const handleResend = () => {
    if (timer > 0 || !email) return;

    startResendTransition(async () => {
      const result = await resendOtpAction(email);
      if (result.success) {
        toast.success(result.message || "Code resent!");
        setTimer(60);
      } else {
        toast.error(result.message || "Failed to resend code");
      }
    });
  };

  // OTP VERIFICATION HANDLER
  const handleVerify = () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    if (!email) return;

    startVerifyTransition(async () => {
      const result = await verifyOtpAction({ email, otp: otpValue });

      if (result.success) {
        // HANDLE "Forgot Password" FLOW VS "Registration" FLOW
        const intent = sessionStorage.getItem("verificationIntent");
        if (intent === "forgot-password") {
          sessionStorage.setItem("pendingOTP", otpValue);
          router.push(
            `/${country?.toLowerCase()}/${language?.toLowerCase()}/new-password`,
          );
          return;
        }

        const role = result.data?.user?.role as UserRole | undefined;

        const targetSubPath = role ? ROLE_REDIRECT_MAP[role] : null;

        if (!targetSubPath) {
          console.error("Invalid or missing role:", role);
          toast.error("Authentication error: Invalid user role");
          router.replace(
            `/${country.toLowerCase()}/${language.toLowerCase()}/login`,
          );
          return;
        }

        // FINALIZE AND REDIRECT
        toast.success(result.message || "Account verified!");
        sessionStorage.removeItem("pendingVerificationEmail");

        const targetCountry = country || "pakistan";
        const targetLang = language || "en";

        // If restaurant owner, check status before redirecting
        if (role === "restaurant_owner") {
          try {
            const statusRes = await getRestaurantStatusAction();

            // Check if restaurant exists and has data
            if (statusRes.success && statusRes.data) {
              const status = statusRes.data.status;

              if (status === "active") {
                router.replace(
                  `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/dashboard`,
                );
              } else if (status === "pending" || status === "rejected") {
                router.replace(
                  `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/status`,
                );
              } else {
                // Draft or any other status -> Onboarding
                router.replace(
                  `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/onboarding`,
                );
              }
            } else {
              // No restaurant data found -> Onboarding
              router.replace(
                `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/onboarding`,
              );
            }
            return;
          } catch (err) {
            console.error("Status check failed", err);
            // On error (network/etc), safer to go to onboarding or status?
            // If it failed, maybe we can't determine status.
            // But usually this means not found if API throws on 404.
            router.replace(
              `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/onboarding`,
            );
            return;
          }
        }

        const finalUrl = `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}${targetSubPath}`;

        router.replace(finalUrl);
      } else {
        toast.error(result.message || "Verification failed");
        setOtpValue(""); // CLEAR OTP ON ERROR
      }
    });
  };

  return (
    <Card className="border-none shadow-none bg-transparent m-0 py-2">
      <CardHeader className="px-0 pt-0 text-center">
        <Typography variant="h2" className="text-emerald-bg">
          Verify OTP
        </Typography>
        <Typography variant="muted" className="mb-4">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </Typography>
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex flex-col items-center space-y-8">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
            onComplete={handleVerify}
            disabled={isVerifying}
            // Ensure the container itself can be focused
            containerClassName="group flex items-center has-[:disabled]:opacity-50"
          >
            <InputOTPGroup className="gap-2 sm:gap-4 font-bold">
              {/* Use a simple array map, ensuring the Slot receives the index */}
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl! border! bg-gray-50 text-xl shadow-sm transition-all
        ring-offset-background
        focus:ring-2 focus:ring-emerald-bg focus:ring-offset-2
        data-[active=true]:border-emerald-bg data-[active=true]:ring-4 data-[active=true]:ring-emerald-bg/10 data-[active=true]:z-20"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || otpValue.length < 6}
            className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-white rounded-xl text-lg font-bold shadow-lg transition-all active:scale-[0.98] mb-4"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              </>
            ) : (
              "Verify & Proceed"
            )}
          </Button>

          <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
            <span>Didn&apos;t receive the code?</span>
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="font-bold text-emerald-bg hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isResending
                ? "Resending..."
                : timer > 0
                  ? `Resend in ${timer}s`
                  : "Resend OTP"}
            </button>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Typography variant="small" className="text-slate-500 font-medium">
              Back to
            </Typography>
            <LocalizedLink href="/login" className="inline-block">
              <Typography
                variant="small"
                className="text-emerald-bg font-bold transition-colors hover:opacity-80"
              >
                Log in
              </Typography>
            </LocalizedLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
