"use client";
import { useState } from "react";
import { FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import useLocale from "@/hooks/useLocals";
import { registerAction } from "@/app/actions/auth/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { GoogleAuthButton } from "@/components/modules/auth/GoogleAuthButton";
import { useZodForm } from "@/hooks/use-zod-form";

export default function CustomerRegisterView() {
  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1 SETUP FORM WITH ZOD
  const form = useZodForm(registerSchema, {
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2 SETUP SERVER ACTION
  const { execute, isPending } = useServerAction(registerAction, {
    onSuccess: (data: any) => {
      const identifier = data?.email || form.getValues("email");
      
      if (identifier) {
        sessionStorage.setItem("pendingVerificationEmail", identifier);
        router.push(
            `/${country?.toLowerCase() || 'pakistan'}/${language?.toLowerCase() || 'en'}/verify-otp?email=${encodeURIComponent(identifier)}`
        );
      }
    },
  });

  function onSubmit(data: RegisterInput) {
    execute(data);
  }

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <Card className="border-none shadow-none bg-transparent overflow-hidden m-0 p-0">
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
          {/* SOCIAL BUTTONS */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GoogleAuthButton
              role="customer"
              loading={isPending}
              setLoading={() => {}}
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

          {/* DIVIDER */}
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

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        className="h-14 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        className="h-14 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        className="h-14 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          className="h-14 pr-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                     <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="h-14 pr-12 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                         {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-emerald-bg text-white text-lg font-bold rounded-xl"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600 pb-0.5"
          >
            {t("existingAccount")}{" "}
            <LocalizedLink
              href="/login"
              className="text-emerald-bg font-bold hover:underline"
            >
              {t("login")}
            </LocalizedLink>
          </Typography>
        </CardContent>
      </Card>
    </GoogleOAuthProvider>
  );
}
