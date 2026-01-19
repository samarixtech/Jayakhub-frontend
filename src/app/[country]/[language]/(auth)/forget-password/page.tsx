"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/components/services/api";
import useLocale from "@/hooks/useLocals";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { country, language } = useLocale();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/forgot-password", {
        identifier: email, // Changed to 'identifier' to match standard auth patterns
      });

      if (response.data?.meta?.status === 200 || response.status === 200) {
        // 1. Store email
        sessionStorage.setItem("pendingVerificationEmail", email);
        // 2. Set intent so Verify page knows to redirect to /change-password
        sessionStorage.setItem("verificationIntent", "forgot-password");

        toast.success("Reset code sent to your email!");

        const verifyPath = `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp`;
        router.push(verifyPath);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.meta?.message || "Failed to send reset code",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
      <div className="hidden md:flex bg-[#0B5D4E] text-white flex-col justify-between overflow-hidden">
        <div className="p-12">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            Forgot <br /> Password?
          </h1>
          <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
          <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
            Don&apos;t worry! It happens. Please enter the email associated with
            your account.
          </p>
        </div>

        <div className="relative w-full h-[45%] mt-auto">
          <Image
            src="/Chef.png"
            alt="Forgot Password Illustration"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-[#0B5D4E] mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            We will send a 6-digit verification code to your email to reset your
            password.
          </p>

          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0B5D4E] text-white rounded-xl text-lg font-bold shadow-lg hover:bg-[#094C40] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-[#0B5D4E] transition"
            >
              Remember your password?{" "}
              <span className="font-semibold underline text-[#0B5D4E]">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
