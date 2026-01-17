"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/components/services/api";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";

export default function RegisterPage() {
  // 1. Added 'name' to the state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. Sending full payload: name, email, phone, role, password
      const response = await api.post("/auth/register", {
        ...formData,
        role: "customer",
      });

      // 3. Handling the specific response structure
      if (response.data.status === "success") {
        toast.success(response.data.message || "OTP sent!");

        // 4. Redirecting to verify-otp with the identifier (email) in query params
        router.push(
          `/${country?.toLocaleLowerCase()}/${language?.toLocaleLowerCase()}/verify-otp`
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F4F1] flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-[#0B5D4E] p-12 flex-col justify-center text-white">
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Join Us <br /> Today!
          </h2>
          <p className="text-emerald-100 text-lg">
            Create an account to experience our premium services and free
            delivery.
          </p>
          <div className="mt-12 h-64 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-white/40 italic">
              Graphic/Image Placeholder
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-[#0B5D4E]">
              {t("createAccount")}
            </h1>
            <p className="text-gray-500 mt-2">{t("freeDelivery")}</p>
          </div>

          <div className="space-y-3 mb-8">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
            >
              <FcGoogle className="text-2xl" /> Sign up with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-medium"
            >
              <FaApple className="text-2xl" /> Sign up with Apple
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-4 bg-white text-sm text-gray-400 uppercase font-semibold">
              Or email
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Added Full Name Input */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password (Min 8 characters)"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={8}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0B5D4E] text-white font-bold rounded-xl shadow-lg hover:bg-[#084838] transition transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            {t("existingAccount")}{" "}
            <Link
              href="/login"
              className="text-[#0B5D4E] font-bold hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
