"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Typography } from "@/components/ui/typography";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useEffect, useRef } from "react";

export default function VerifyOtpView() {
  const {
    otpValue,
    setOtpValue,
    email,
    isVerifying,
    isResending,
    timer,
    handleResend,
    handleVerify,
  } = useVerifyOtp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
            ref={inputRef}
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
        ring-offset-background focus:ring-2 focus:ring-emerald-bg focus:ring-offset-2
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
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
