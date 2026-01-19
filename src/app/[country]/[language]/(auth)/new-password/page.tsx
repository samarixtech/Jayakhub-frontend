"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import api from "@/components/services/api";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem("pendingVerificationEmail");
    const otp = sessionStorage.getItem("pendingOTP");
    if (!email || !otp) {
      toast.error("Invalid session. Please start again.");
      router.push("/forgot-password");
    }
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const email = sessionStorage.getItem("pendingVerificationEmail");
      const otp = sessionStorage.getItem("pendingOTP");

      const response = await api.post("/reset-password", {
        identifier: email,
        otp: otp,
        newPassword: password,
      });

      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Password updated successfully!");
        sessionStorage.clear();
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.meta?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
      <div className="hidden md:flex bg-[#0B5D4E] text-white flex-col justify-between overflow-hidden">
        <div className="p-12">
          <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
            Secure <br /> Update
          </h1>
          <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
          <p className="text-lg text-emerald-100/80 max-w-sm">
            Please choose a strong new password to keep your account safe.
          </p>
        </div>
        <div className="relative w-full h-[45%] mt-auto">
          <Image
            src="/Chef.png"
            alt="Illustration"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
            priority
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-[#0B5D4E] mb-2">
            New Password
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Enter your new security credentials
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* NEW PASSWORD FIELD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 pr-12 rounded-xl border border-gray-100 bg-gray-50 focus:border-[#0B5D4E] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B5D4E] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-4 pr-12 rounded-xl border border-gray-100 bg-gray-50 focus:border-[#0B5D4E] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B5D4E] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#0B5D4E] text-white rounded-xl text-lg font-bold shadow-lg hover:bg-[#094C40] transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
