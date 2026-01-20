"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/components/services/api";
import useLocale from "@/hooks/useLocals";
import { ApiResponse, ApiError } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

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
      const response = await api.post<ApiResponse>("/forgot-password", {
        identifier: email,
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
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.meta?.message ||
        "Reset failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 text-center">
        <Typography variant="h2" className="text-emerald-bg border-none mb-2">
          Reset Password
        </Typography>

        <Typography variant="muted">
          We will send a 6-digit verification code to your email to reset your
          password.
        </Typography>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleResetRequest} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600 ml-1">
              Email Address
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-bg hover:bg-emerald-bg-hover text-lg font-bold rounded-xl"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <Typography variant="small" className="text-gray-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold underline text-emerald-bg"
            >
              Login
            </Link>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
