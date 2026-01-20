"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import api from "@/components/services/api";
import useLocale from "@/hooks/useLocals";
import { ApiResponse, ApiError } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";

export default function VerifyCodePage() {
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const { country, language } = useLocale();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No verification email found. Please register again.");
      router.push("/register");
    }
  }, [router]);
  // TIMER LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // RESEND LOGIC
  const handleResend = async () => {
    if (timer > 0 || !email) return;
    setIsResending(true);
    try {
      const response = await api.post<ApiResponse>("/resend-otp", {
        identifier: email,
      });
      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Verification code resent!");
        setTimer(60);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.meta?.message || "Failed to resend.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // VERIFY LOGIC
  const handleVerify = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    if (!email) {
      toast.error("Email identifier missing");
      return;
    }

    setLoading(true);
    try {
      const intent = sessionStorage.getItem("verificationIntent");

      if (intent === "forgot-password") {
        sessionStorage.setItem("pendingOTP", otpValue);
        router.push(
          `/${country?.toLowerCase()}/${language?.toLowerCase()}/new-password`,
        );
        return;
      }

      const response = await api.post<ApiResponse>("/verify-otp", {
        identifier: email,
        otp: otpValue,
      });
      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Account verified successfully!");
        sessionStorage.removeItem("pendingVerificationEmail");
        router.push(
          `/${country?.toLowerCase()}/${language?.toLowerCase()}/dashboard`,
        );
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.meta?.message || "Verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
      <CardHeader className="px-0 pt-0 mb-8 text-center">
        <Typography
          variant="h2"
          className="text-emerald-bg border-none p-0 m-0"
        >
          Verify Code
        </Typography>
        <Typography variant="muted" className="mt-2">
          Enter the 6-digit code sent to your device
        </Typography>
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex flex-col items-center space-y-8">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
            onComplete={handleVerify}
          >
            <InputOTPGroup className="gap-2 sm:gap-3 font-bold">
              <InputOTPSlot
                index={0}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-14 rounded-xl border-2 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg text-xl"
              />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full h-14 bg-emerald-bg text-white rounded-xl text-lg font-bold shadow-lg hover:bg-emerald-bg-hover transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
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
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </span>
            </button>

            <LocalizedLink href="/login" className="block">
              <Typography
                variant="small"
                className="text-gray-400 hover:text-emerald-bg transition underline decoration-gray-200 underline-offset-4"
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
