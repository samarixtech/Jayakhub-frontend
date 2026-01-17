"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/components/services/api";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton({ loading, setLoading, country, language }: any) {
  const router = useRouter();

  const handleGoogleSuccess = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );

        const { email, name, picture }: any = userInfo.data;

        // Use your google-login or google-register endpoint
        const response = await api.post("/google-login", {
          email,
          token: tokenResponse.access_token,
        });

        if (response.data.meta.status === 200) {
          toast.success("Login Successful!");
          router.push(
            `/${country?.toLowerCase()}/${language?.toLowerCase()}/dashboard`,
          );
        }
      } catch (error: any) {
        toast.error("Google authentication failed.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleSuccess()}
      disabled={loading}
      className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold text-gray-700 text-sm disabled:opacity-50"
    >
      <FcGoogle className="text-xl" /> Google
    </button>
  );
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", {
        identifier: formData.email,
        password: formData.password,
      });

      // Check for status 200 and the specific message from your backend
      if (response.data.meta.status === 200) {
        const { identifier, message } = response.data.data;

        // 1. Store the email in sessionStorage as requested
        sessionStorage.setItem("pendingVerificationEmail", identifier);

        // 2. Show success message from backend
        toast.success(message || "OTP sent!");

        // 3. Redirect to the verify-otp page with the email in the query params
        router.push(
          `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp?email=${encodeURIComponent(identifier)}`,
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.data?.message ||
          error.response?.data?.meta?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
        {/* LEFT PANEL */}
        <div className="hidden md:flex bg-[#0B5D4E] text-white flex-col justify-between overflow-hidden">
          <div className="p-12">
            <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
              Welcome <br /> Back!
            </h1>
            <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
            <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
              Login to access your account, track orders, and enjoy our premium
              services.
            </p>
          </div>
          <div className="relative w-full h-[40%] mt-auto">
            <Image
              src="/Chef.png"
              alt="Login Illustration"
              fill
              style={{ objectFit: "contain", objectPosition: "bottom" }}
              className="w-full h-full"
              priority
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#0B5D4E]">
                Login to Account
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your details to continue
              </p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <GoogleLoginButton
                loading={loading}
                setLoading={setLoading}
                country={country}
                language={language}
              />
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold text-sm"
              >
                <FaApple className="text-xl" /> Apple
              </button>
            </div>

            <div className="relative mb-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[11px] text-gray-400 uppercase font-black tracking-widest">
                Or login with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <div className="flex justify-end">
                  <Link
                    href={`/${country?.toLowerCase()}/${language?.toLowerCase()}/forget-password`}
                    size="sm"
                    className="text-xs text-gray-400 hover:text-[#0B5D4E]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0B5D4E] text-white text-lg font-bold rounded-xl shadow-xl hover:bg-[#084838] transition transform active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#0B5D4E] font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
