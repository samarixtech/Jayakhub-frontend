"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Auth.toasts");
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
      toast.error(t("noVerificationEmail"));
      router.push(`/register`);
    }
  }, [router, t]);

  const resolveRestaurantPath = (data?: any) => {
    const isOnboarded = data?.isOnboarded;
    const activePlan = data?.activePlan;
    const status = data?.status;
    if (!isOnboarded) return "/restaurant/onboarding";
    if (!activePlan) return "/restaurant/purchase-plan";
    if (status === "active") return "/restaurant/dashboard";
    return "/restaurant/status";
  };

  const handleResend = () => {
    if (timer > 0 || !email) return;

    startResendTransition(async () => {
      const result = await resendOtpAction(email);
      if (result.success) {
        toast.success(result.message || t("otpSent"));
        setTimer(60);
      } else {
        toast.error(result.message || t("failedResendOtp"));
      }
    });
  };

  const handleVerify = () => {
    if (otpValue.length < 6) {
      toast.error(t("enterFullCode"));
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
          toast.error(t("invalidUserRole"));
          router.replace(`/login`);
          return;
        }

        toast.success(result.message || t("accountVerified"));
        sessionStorage.removeItem(AUTH_KEYS.PENDING_EMAIL);
        sessionStorage.removeItem(AUTH_KEYS.INTENT);

        if (role === "restaurant_owner") {
          try {
            const otpUser = result.data?.user;
            const statusRes = await getRestaurantStatusAction();
            const base = statusRes.success && statusRes.data ? statusRes.data : null;
            // Use activePlan from the OTP response as the authoritative value —
            // /my-restaurant may return activePlan: false for expired subscriptions
            const restaurantData = base
              ? { ...base, activePlan: otpUser?.activePlan ?? base.activePlan }
              : null;
            router.replace(resolveRestaurantPath(restaurantData));
            return;
          } catch (err) {
            router.replace("/restaurant/onboarding");
            return;
          }
        }

        router.replace(targetSubPath);
      } else {
        toast.error(result.message || t("verificationFailed"));
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
