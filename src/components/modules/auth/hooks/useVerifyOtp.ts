"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  resendOtpAction,
  verifyOtpAction,
  verifyResetOtpAction,
} from "@/app/actions/auth/auth";
import { useCountdown } from "@/hooks/use-countdown";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export function useVerifyOtp() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const { timer, setTimer } = useCountdown(60);

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

  const handleResend = () => {
    if (timer > 0 || !email) return;

    startResendTransition(async () => {
      const result = await resendOtpAction(email);
      if (result.success) {
        toast.success(result.message || "OTP Sent Successfully");
        setTimer(60);
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    });
  };

  const handleVerify = () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    if (!email) return;

    startVerifyTransition(async () => {
      const intent = sessionStorage.getItem(AUTH_KEYS.INTENT);
      let result;

      if (intent === "forgot-password" && email) {
        result = await verifyResetOtpAction({
          otp: otpValue,
          identifier: email,
        });
      } else {
        result = await verifyOtpAction({ otp: otpValue });
      }

      if (result.success) {
        if (intent === "forgot-password") {
          sessionStorage.setItem(AUTH_KEYS.PENDING_OTP, otpValue);
          router.push(`/new-password`);
          return;
        }

        const role = (result.data?.user?.role as string | undefined)?.toLowerCase() as UserRole | undefined;
        const targetSubPath = role ? ROLE_REDIRECT_MAP[role] : null;

        if (!targetSubPath) {
          toast.error("Authentication error: Invalid user role");
          router.replace(`/login`);
          return;
        }

        toast.success(result.message || "Account verified!");
        sessionStorage.removeItem(AUTH_KEYS.PENDING_EMAIL);
        sessionStorage.removeItem(AUTH_KEYS.INTENT);

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
            router.replace("/restaurant/onboarding");
            return;
          }
        }

        router.replace(targetSubPath);
      } else {
        toast.error(result.message || "Verification failed");
        setOtpValue("");
      }
    });
  };

  return {
    otpValue,
    setOtpValue,
    email,
    isVerifying,
    isResending,
    timer,
    handleResend,
    handleVerify,
  };
}
