"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/components/services/api";
import { ApiResponse, ApiError } from "@/types/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

      const response = await api.post<ApiResponse>("/reset-password", {
        identifier: email,
        otp: otp,
        newPassword: password,
      });

      if (response.status === 200 || response.data?.meta?.status === 200) {
        toast.success("Password updated successfully!");
        sessionStorage.clear();
        router.push("/login");
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
    <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
      <CardHeader className="px-0 pt-0 mb-6 text-center">
        <Typography
          variant="h2"
          className="text-emerald-bg border-none p-0 m-0"
        >
          New Password
        </Typography>
        <Typography variant="muted" className="mt-2">
          Enter your new security credentials
        </Typography>
      </CardHeader>

      <CardContent className="px-0">
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* NEW PASSWORD */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-emerald-bg text-white rounded-xl text-lg font-bold shadow-lg hover:bg-emerald-bg-hover transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
