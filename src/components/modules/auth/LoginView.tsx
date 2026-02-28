"use client";
import { useState } from "react";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useLocale from "@/hooks/useLocals";
import { AUTH_KEYS } from "@/config/auth-keys.config";
import { loginAction } from "@/app/actions/auth/auth";
import { loginSchema, LoginInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { GoogleAuthButton } from "@/components/modules/auth/GoogleAuthButton";
import { useZodForm } from "@/hooks/use-zod-form";

export default function LoginView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // SETUP FORM WITH ZOD
  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // SETUP SERVER ACTION
  const { execute, isPending } = useServerAction(loginAction, {
    onSuccess: (data: any) => {
      const identifier = data?.identifier || data?.email;
      if (identifier) {
        sessionStorage.setItem(AUTH_KEYS.PENDING_EMAIL, identifier);
        router.push(`/verify-otp?email=${encodeURIComponent(identifier)}`);
      } else if (data?.data?.user?.role || data?.user?.role) {
        // Direct login success
        const role = (data.data?.user?.role || data.user?.role) as UserRole;

        if (role === "restaurant_owner") {
          getRestaurantStatusAction()
            .then((statusRes) => {
              if (statusRes.success && statusRes.data?.status === "active") {
                router.push(`/restaurant/dashboard`);
              } else {
                router.push(`/restaurant/status`);
              }
            })
            .catch((err) => {
              router.push(`/restaurant/status`);
            });
          return;
        }

        const targetSubPath = ROLE_REDIRECT_MAP[role];
        router.push(targetSubPath || "/dashboard");
      }
    },
  });

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function onSubmit(data: LoginInput) {
    execute(data);
  }

  return (
    <>
      <Card className="border-none shadow-none bg-transparent py-2">
        <CardHeader className="px-0 pt-0 text-center">
          <CardTitle className="text-3xl font-bold text-emerald-bg">
            Login to Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your details to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {/* SOCIAL LOGINS */}
          <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
            <GoogleAuthButton
              loading={isGoogleLoading}
              setLoading={setIsGoogleLoading}
              disabled={isPending}
            />
            <Button
              type="button"
              className="h-12 bg-black hover:bg-gray-800 text-white gap-3 rounded-xl"
            >
              <FaApple className="text-xl" /> Apple
            </Button>
          </div>

          {/* DIVIDER */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center uppercase">
              <span className="bg-white px-4 text-[11px] font-black tracking-widest text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mx-1"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        className="h-13 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="h-13 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-bg"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end mt-1">
                  <Link
                    href={`/forget-password`}
                    className="text-xs text-gray-400 hover:text-emerald-bg transition-colors font-bold"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-13 bg-emerald-bg hover:bg-emerald-bg-hover text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-bg font-bold hover:underline"
            >
              Create Account
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
