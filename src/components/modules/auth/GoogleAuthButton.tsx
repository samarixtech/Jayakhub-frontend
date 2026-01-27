// components/auth/GoogleAuthButton.tsx
"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { googleAuthAction } from "@/app/actions/auth/auth";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { Loader2 } from "lucide-react";

export function GoogleAuthButton({
  country,
  language,
  loading,
  setLoading,
}: any) {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // 1. Fetch user profile from Google
        const { data: userInfo } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );

        // 2. Call the Server Action (sets cookies and returns the backend role)
        const result = await googleAuthAction({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          token: tokenResponse.access_token,
        });

        if (result.success && result.role) {
          toast.success("Login Successful!");

          // 3. Dynamic redirection based on the role returned by your backend
          const targetSubPath = ROLE_REDIRECT_MAP[result.role as UserRole];
          const finalUrl = `/${country.toLowerCase()}/${language.toLowerCase()}${targetSubPath}`;

          router.push(finalUrl);
        } else {
          toast.error(result.message || "Authentication failed");
        }
      } catch (error) {
        toast.error("Google authentication failed.");
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
      onClick={() => login()}
      disabled={loading}
      className="w-full h-12 gap-3 rounded-xl border-gray-200"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <FcGoogle className="text-xl" />
      )}
      Google
    </Button>
  );
}
