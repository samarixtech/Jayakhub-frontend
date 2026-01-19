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
import { ArrowLeft } from "lucide-react";
import LocalizedLink from "@/components/navigation/LocalizedLink";

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface GoogleSignupButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  country: string;
  language: string;
}

function GoogleSignupButton({
  loading,
  setLoading,
  country,
  language,
}: GoogleSignupButtonProps) {
  const router = useRouter();

  const handleGoogleSuccess = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // 1. Get User Info from Google using the access_token
        const userInfo = await axios.get<GoogleUserInfo>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );

        const userData = userInfo.data;
        const email = userData.email || "";
        const name = userData.name || "";
        const picture = userData.picture || "";

        // 2. Send data to your backend
        const response = await api.post("/google-auth", {
          email,
          name,
          picture,
          token: tokenResponse.access_token,
          role: "customer",
        });

        const responseData = response.data as { meta: { status: number } };
        if (
          responseData.meta.status === 201 ||
          responseData.meta.status === 200
        ) {
          toast.success("Google Login Successful!");
          router.push(
            `/${country?.toLowerCase()}/${language?.toLowerCase()}/dashboard`,
          );
        }
      } catch (error) {
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

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterApiResponse {
  meta: {
    status: number;
    message?: string;
  };
  data: {
    email: string;
    message?: string;
  };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
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
      const response = await api.post("/register", {
        ...formData,
        role: "customer",
      });

      const responseData = response.data as RegisterApiResponse;

      if (
        responseData.meta.status === 201 ||
        responseData.meta.message === "success"
      ) {
        const identifier = responseData.data.email;
        sessionStorage.setItem("pendingVerificationEmail", identifier);
        toast.success(responseData.data.message || "OTP sent!");

        router.push(
          `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp?email=${encodeURIComponent(identifier)}`,
        );
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            data?: { message?: string };
            meta?: { message?: string };
          };
        };
      };

      const errorMessage =
        apiError.response?.data?.data?.message ||
        apiError.response?.data?.meta?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <div className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#F7FBFA]">
        {/* LEFT PANEL */}
        <div className="hidden md:flex bg-[#0B5D4E] text-white flex-col justify-between overflow-hidden">
          <LocalizedLink href={"/restaurants"} className="m-5">
            <ArrowLeft />
          </LocalizedLink>
          <div className="p-10">
            <h1 className="text-6xl font-black leading-tight mb-6 tracking-tight">
              Join Us Today!
            </h1>
            <div className="h-1.5 w-20 bg-emerald-400 mb-6"></div>
            <p className="text-lg text-emerald-100/80 max-w-sm leading-relaxed">
              Create an account to experience our premium services and free
              delivery.
            </p>
          </div>
          <div className="relative w-full h-[40%] mt-auto">
            <Image
              src="/Chef.png"
              alt="Registration Illustration"
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
                {t("createAccount")}
              </h2>
              <p className="text-sm text-gray-500 mt-2">{t("freeDelivery")}</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <GoogleSignupButton
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
                Or register with email
              </span>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                value={formData.name}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                value={formData.email}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                value={formData.phone}
              />
              <input
                type="password"
                placeholder="Password (Min 8 characters)"
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-[#0B5D4E]/10 focus:border-[#0B5D4E] outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={8}
                value={formData.password}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0B5D4E] text-white text-lg font-bold rounded-xl shadow-xl hover:bg-[#084838] transition transform active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? "Processing..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
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
    </GoogleOAuthProvider>
  );
}
