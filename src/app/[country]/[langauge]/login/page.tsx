"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/service/api";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("authModal");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        role: "user",
      });
      const { accessToken, user }: any = response.data;

      sessionStorage.setItem("authToken", accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));

      toast.success(t("welcome"));
      router.push("/home");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F4F1] flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Left Side: Image/Branding */}
        <div className="hidden md:flex md:w-1/2 bg-[#0B5D4E] p-12 flex-col justify-center text-white">
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Welcome <br /> Back!
          </h2>
          <p className="text-emerald-100 text-lg">
            Log in to access your account and continue your journey with us.
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
            <h1 className="text-4xl font-black text-[#0B5D4E]">{t("login")}</h1>
            <p className="text-gray-500 mt-2">{t("continue")}</p>
          </div>

          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700">
              <FcGoogle className="text-2xl" /> Login with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-medium">
              <FaApple className="text-2xl" /> Login with Apple
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

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0B5D4E] outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0B5D4E] text-white font-bold rounded-xl shadow-lg hover:bg-[#084838] transition transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            {t("newAccount")}{" "}
            <Link
              href="/signup"
              className="text-[#0B5D4E] font-bold hover:underline"
            >
              {t("signup")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
