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
            // We rely on the cookie set by verifyOtpAction being available for this next request
            // In many cases this works immediately in the same flow, or we might need a small delay/reload context
            // But typically for server actions in Next.js, cookies set in one action are available in next action if same context
            const statusRes = await getRestaurantStatusAction();
            if (statusRes.success && statusRes.data?.status === "active") {
              router.replace(
                `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/dashboard`,
              );
              return;
            }
            // Fallback to status page if not active or error
            router.replace(
              `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/status`,
            );
            return;
          } catch (err) {
            console.error("Status check failed", err);
            // Fallback to status page
            router.replace(
              `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/status`,
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
    <Card className="border-none shadow-none bg-transparent m-0 p-0">
      <CardHeader className="px-0 pt-0 mb-8 text-center">
        <Typography variant="h2" className="text-emerald-bg">
          Verify Code
        </Typography>
        <Typography variant="muted" className="mt-2">
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
          >
            <InputOTPGroup className="gap-2 sm:gap-3 font-bold">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || otpValue.length < 6}
            className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-white rounded-xl text-lg font-bold shadow-lg transition-all active:scale-[0.98]"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Proceed"
            )}
          </Button>

          <div className="text-center space-y-4">
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="block w-full text-sm text-gray-500 hover:text-emerald-bg transition font-medium disabled:opacity-50"
            >
              Didn&apos;t receive the code?{" "}
              <span className="text-emerald-bg font-bold cursor-pointer hover:underline">
                {isResending
                  ? "Resending..."
                  : timer > 0
                    ? `Resend in ${timer}s`
                    : "Resend Code"}
              </span>
            </button>

            <LocalizedLink href="/login" className="block">
              <Typography
                variant="small"
                className="text-gray-400 hover:text-emerald-bg transition underline underline-offset-4"
              >
                Back to Login
              </Typography>
            </LocalizedLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
