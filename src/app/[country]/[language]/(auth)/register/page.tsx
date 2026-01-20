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
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleUserInfo, GoogleButtonProps } from "@/types/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";

function GoogleSignupButton({
  loading,
  setLoading,
  country,
  language,
}: GoogleButtonProps) {
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
  const [showPassword, setShowPassword] = useState(false);
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
      <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
        {" "}
        <CardHeader className="px-0 pt-0 text-center">
          <Typography
            variant="h2"
            className="text-emerald-bg border-none p-0 m-0"
          >
            {t("createAccount")}
          </Typography>
          <Typography variant="muted" className="mt-2">
            {t("freeDelivery")}
          </Typography>
        </CardHeader>
        <CardContent className="px-0">
          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GoogleSignupButton
              loading={loading}
              setLoading={setLoading}
              country={country}
              language={language}
            />
            <Button
              type="button"
              className="flex items-center justify-center gap-3 h-12 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold text-sm"
            >
              <FaApple className="text-xl" /> Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-gray-100" />
            </div>
            <div className="relative flex justify-center uppercase">
              <Typography
                as="span"
                className="bg-white px-4 text-[11px] text-gray-400 font-black tracking-widest"
              >
                Or register with email
              </Typography>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition text-base"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              value={formData.name}
            />
            <Input
              type="email"
              placeholder="Email Address"
              className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition text-base"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              value={formData.email}
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition text-base"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              value={formData.phone}
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition text-base"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-bg text-white text-lg font-bold rounded-xl shadow-xl hover:bg-emerald-bg-hover transition transform active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600"
          >
            {t("existingAccount")}{" "}
            <Link
              href="/login"
              className="text-emerald-bg font-bold hover:underline"
            >
              {t("login")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </GoogleOAuthProvider>
  );
}
