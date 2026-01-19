"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/components/services/api";
import useLocale from "@/hooks/useLocals";

export default function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [timer, setTimer] = useState(60); // TIMER STATE
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

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    }

    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;

    setIsResending(true);
    try {
      const response = await api.post("/resend-otp", {
        identifier: email,
      });

      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Verification code resent!");
        setTimer(60); // RESET TIMER
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.meta?.message || "Failed to resend code",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const otpString = code.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    if (!email) {
      toast.error("Email identifier missing");
      return;
    }

    setLoading(true);
    try {
      // Check if this is a password reset flow
      const intent = sessionStorage.getItem("verificationIntent");

      if (intent === "forgot-password") {
        // For forgot-password, we just store the OTP and move to change-password
        // because the /reset-password API requires the OTP as part of the payload.
        sessionStorage.setItem("pendingOTP", otpString);
        const changePassPath = `/${country?.toLowerCase()}/${language?.toLowerCase()}/new-password`;
        router.push(changePassPath);
        return;
      }

      // Normal Registration Flow
      const response = await api.post("/verify-otp", {
        identifier: email,
        otp: otpString,
      });
      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Account verified successfully!");
        sessionStorage.removeItem("pendingVerificationEmail");
        const dashboardPath = `/${country?.toLowerCase()}/${language?.toLowerCase()}/dashboard`;
        router.push(dashboardPath);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.meta?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex bg-[#0B5D4E] text-white flex-col justify-between overflow-hidden">
        <div className="p-12">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            Secure <br /> Access
          </h1>
          <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
          <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
            One more step to keep your account safe.
            <br />
            Please enter the verification code sent to: <br />
            <span className="font-bold text-white underline decoration-emerald-400 underline-offset-4">
              {email || "your email"}
            </span>
          </p>
        </div>

        <div className="relative w-full h-[45%] mt-auto">
          <Image
            src="/Chef.png"
            alt="Secure Access Illustration"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-[#0B5D4E] mb-2">
            Verify Code
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Enter the 6-digit code sent to your device
          </p>

          <div className="flex gap-2 sm:gap-3 justify-between mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                autoFocus={index === 0}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#0B5D4E] focus:ring-4 focus:ring-[#0B5D4E]/10 outline-none transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full h-14 bg-[#0B5D4E] text-white rounded-xl text-lg font-bold shadow-lg hover:bg-[#094C40] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Proceed"}
          </button>

          <div className="text-center mt-8 space-y-3">
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="text-sm text-gray-500 hover:text-[#0B5D4E] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn&apos;t receive the code?{" "}
              <span className="text-[#0B5D4E] font-bold">
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </span>
            </button>
            <div>
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-[#0B5D4E] transition"
              >
                Back to <span className="font-semibold underline">Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
