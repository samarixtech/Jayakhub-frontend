"use client";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { googleAuthAction } from "@/app/actions/auth/auth";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { Loader2 } from "lucide-react";
import { useServerAction } from "@/hooks/use-server-action";
export function GoogleAuthButton({ country, language, loading, role }: any) {
  const router = useRouter();

  const { execute, isPending } = useServerAction(googleAuthAction, {
    onSuccess: (data: any) => {
      if (data?.role) {
        const targetCountry = country || "pakistan";
        const targetLang = language || "en";

        if (data.role === "restaurant_owner") {
          // Check status
          getRestaurantStatusAction()
            .then((statusRes) => {
              if (statusRes.success && statusRes.data?.status === "active") {
                router.push(
                  `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/dashboard`,
                );
              } else {
                router.push(
                  `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/status`,
                );
              }
            })
            .catch((err) => {
              console.error("Status check failed", err);
              router.push(
                `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}/restaurant/status`,
              );
            });
          return;
        }

        const targetSubPath = ROLE_REDIRECT_MAP[data.role as UserRole];
        const finalUrl = `/${targetCountry.toLowerCase()}/${targetLang.toLowerCase()}${targetSubPath}`;
        router.push(finalUrl);
      }
    },
    onError: () => {
      // Optional custom error handling if needed, defaults to toast from hook
    },
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
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
      className="w-full h-12 gap-3 rounded-xl border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-black"
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
