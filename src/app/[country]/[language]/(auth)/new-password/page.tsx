"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { resetPasswordAction } from "@/app/actions/auth/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { country, language } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const email = sessionStorage.getItem("pendingVerificationEmail");
    const otp = sessionStorage.getItem("pendingOTP");

    if (!email || !otp) {
      toast.error("Session expired. Please start over.");
      router.push(`/${country}/${language}/forgot-password`);
      return;
    }

    startTransition(async () => {
      // Pass the values to the server action
      const result = await resetPasswordAction({
        email: email, // This goes to 'payload.email' in the action
        otp: otp,
        newPassword: password,
      });

      if (result.success) {
        toast.success(result.message);
        sessionStorage.clear();
        router.push(`/${country}/${language}/login`);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="border-none shadow-none bg-transparent m-0 p-0">
      <CardHeader className="px-0 pt-0 mb-6 text-center">
        <Typography variant="h2" className="text-emerald-bg">
          New Password
        </Typography>
        <Typography variant="muted" className="mt-2">
          Enter your new security credentials
        </Typography>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
              className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              name="identifier"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isPending}
              className="h-14 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-4 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-emerald-bg text-white rounded-xl text-lg font-bold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...
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
