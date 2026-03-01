"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { resendOtpAction, verifyOtpAction } from "@/app/actions/auth/auth";
import { useCountdown } from "@/hooks/use-countdown";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import Link from "next/link";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export default function VerifyOtpView() {
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [email, setEmail] = useState<string | null>(null);
  const { timer, setTimer } = useCountdown(60);

  const router = useRouter();

  // CHECK THAT IF VERIFICATION EMAIL IS STORED IN SESSION STORAGE (IF NOT, REDIRECT TO REGISTER)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem(AUTH_KEYS.PENDING_EMAIL);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No verification email found. Redirecting...");
      router.push(`/register`);
    }
  }, [router]);

  const resolveRestaurantPath = (status?: string | null) => {
    if (status === "active") return "/restaurant/dashboard";
    if (status === "pending" || status === "rejected")
      return "/restaurant/status";
    return "/restaurant/onboarding";
  };

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
      const result = await verifyOtpAction({ otp: otpValue });

      if (result.success) {
        // HANDLE "Forgot Password" FLOW VS "Registration" FLOW
        const intent = sessionStorage.getItem(AUTH_KEYS.INTENT);
        if (intent === "forgot-password") {
          sessionStorage.setItem(AUTH_KEYS.PENDING_OTP, otpValue);
          router.push(`/new-password`);
          return;
        }

        const role = result.data?.user?.role as UserRole | undefined;

        const targetSubPath = role ? ROLE_REDIRECT_MAP[role] : null;

        if (!targetSubPath) {
          console.error("Invalid or missing role:", role);
          toast.error("Authentication error: Invalid user role");
          router.replace(`/login`);
          return;
        }

        // FINALIZE, CLEAN AND REDIRECT
        toast.success(result.message || "Account verified!");
        sessionStorage.removeItem(AUTH_KEYS.PENDING_EMAIL);
        sessionStorage.removeItem(AUTH_KEYS.INTENT);

        // If RESTAURANT OWNER, CHECK STATUS BEFORE REDIRECTING
        if (role === "restaurant_owner") {
          try {
            const statusRes = await getRestaurantStatusAction();
            const status =
              statusRes.success && statusRes.data
                ? statusRes.data.status
                : null;
            router.replace(resolveRestaurantPath(status));
            return;
          } catch (err) {
            console.error("Status check failed", err);
            router.replace("/restaurant/onboarding");
            return;
          }
        }

        router.replace(targetSubPath);
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
            containerClassName="group flex items-center has-[:disabled]:opacity-50"
          >
            <InputOTPGroup className="gap-2 sm:gap-4 font-bold">
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
            <Link href="/login" className="inline-block">
              <Typography
                variant="small"
                className="text-emerald-bg font-bold transition-colors hover:opacity-80"
              >
                Log in
              </Typography>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
