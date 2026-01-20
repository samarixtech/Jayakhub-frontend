"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import api from "@/components/services/api";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleButtonProps, GoogleUserInfo } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";

function GoogleLoginButton({
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

        const response = await api.post("/google-auth", {
          email,
          name,
          picture,
          role: "customer",
          token: tokenResponse.access_token,
        });

        const responseData = response.data as { meta: { status: number } };
        if (responseData.meta.status === 200) {
          toast.success("Login Successful!");
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
    <Button
      variant="outline"
      type="button"
      onClick={() => handleGoogleSuccess()}
      disabled={loading}
      className="w-full h-12 gap-3 rounded-xl border-gray-200 cursor-pointer"
    >
      <FcGoogle className="text-xl" /> Google
    </Button>
  );
}

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  meta: {
    status: number;
    message?: string;
  };
  data: {
    identifier: string;
    message?: string;
  };
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { country, language } = useLocale();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", {
        identifier: formData.email,
        password: formData.password,
      });

      const responseData = response.data as ApiResponse;

      if (responseData.meta.status === 200) {
        const { identifier, message } = responseData.data;

        sessionStorage.setItem("pendingVerificationEmail", identifier);

        toast.success(message || "OTP sent!");

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
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 text-center">
          <CardTitle className="text-3xl font-bold text-emerald-bg">
            Login to Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your details to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <GoogleLoginButton
              loading={loading}
              setLoading={setLoading}
              country={country}
              language={language}
            />
            <Button
              type="button"
              className="h-12 bg-black hover:bg-gray-800 text-white gap-3 rounded-xl"
            >
              <FaApple className="text-xl" /> Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-white px-4 text-[11px] font-black tracking-widest text-gray-400">
                Or login with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end">
                <LocalizedLink
                  href={`/forget-password`}
                  className="text-xs text-gray-400 hover:text-emerald-bg transition-colors"
                >
                  Forgot Password?
                </LocalizedLink>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600"
          >
            Don&apos;t have an account?{" "}
            <LocalizedLink
              href="/register"
              className="text-emerald-bg font-bold hover:underline"
            >
              Create Account
            </LocalizedLink>
          </Typography>
        </CardContent>
      </Card>
    </GoogleOAuthProvider>
  );
}
