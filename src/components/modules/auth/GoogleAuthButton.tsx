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
import { useServerAction } from "@/hooks/use-server-action";

export function GoogleAuthButton({
  country,
  language,
  loading,
  setLoading,
  role,
}: any) {
  const router = useRouter();

  const { execute, isPending } = useServerAction(googleAuthAction, {
    onSuccess: (data: any) => {
       if (data?.role) {
          const targetSubPath = ROLE_REDIRECT_MAP[data.role as UserRole];
          const finalUrl = `/${country.toLowerCase()}/${language.toLowerCase()}${targetSubPath}`;
          router.push(finalUrl);
       }
    },
    onError: () => {
        // Optional custom error handling if needed, defaults to toast from hook
    }
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Logic: 
      // 1. Fetch user profile from Google using the token
      // 2. Pass profile + token to server action
      
      // Since this part involves a GET request to google, we might need a separate try/catch 
      // or we can wrap this in a transition. However, axios call is external. 
      // We can use isPending from hook to show loading state effectively if we call execute.
      
      // Let's rely on setloading if provided or use isPending if possible.
      // But props might be controlling loading state of parent form too? 
      // Actually, loading/setLoading are passed props. We should respect them or check usage.
      // In Refactored Parent components, we passed `setLoading={() => {}}` (empty) because we relied on `isPending`.
      // So relying on `isPending` here is safer for the new code.
      
      try {
        const { data: userInfo } = await axios.get<any>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );

        execute({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          token: tokenResponse.access_token,
          role: role, 
        });

      } catch (error) {
        toast.error("Google authentication failed.");
        console.error(error);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => login()}
      disabled={loading || isPending}
      className="w-full h-12 gap-3 rounded-xl border-gray-200"
    >
      {loading || isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <FcGoogle className="text-xl" />
      )}
      Google
    </Button>
  );
}
