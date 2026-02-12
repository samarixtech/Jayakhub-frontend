"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { registerRestaurantAction } from "@/app/actions/auth/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Separator } from "@/components/ui/separator";
import { FaApple } from "react-icons/fa";
import { GoogleAuthButton } from "@/components/modules/auth/GoogleAuthButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { useZodForm } from "@/hooks/use-zod-form";

export default function RestaurantRegisterView() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = useTranslations("authModal");
  const router = useRouter();
  const { country, language } = useLocale();

  // 1 SETUP FORM WITH ZOD
  const form = useZodForm(registerSchema, {
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Restore from Session Storage
  // Using useEffect to avoid hydration mismatch
  useEffect(() => {
    const savedData = sessionStorage.getItem("restaurant_register_form");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset({
          ...parsed,
          password: "",
          confirmPassword: "",
        });
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [form]);

  // Save to Session Storage with Debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = form.watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { password, confirmPassword, ...rest } = value;
        sessionStorage.setItem(
          "restaurant_register_form",
          JSON.stringify(rest),
        );
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [form]);

  // 2 SETUP SERVER ACTION
  const { execute, isPending } = useServerAction(registerRestaurantAction, {
    onSuccess: (data: any) => {
      const identifier = data?.email || form.getValues("email");

      // CLEAR STORAGE
      sessionStorage.removeItem("restaurant_register_form");

      sessionStorage.setItem("pendingVerificationEmail", identifier);
      toast.success("Business account created! Verify your OTP.");

      router.push(
        `/${country?.toLowerCase()}/${language?.toLowerCase()}/verify-otp?email=${encodeURIComponent(identifier)}`,
      );
    },
  });

  const onSubmit = (data: RegisterInput) => {
    execute(data);
  };

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <Card className="border-none shadow-none bg-transparent m-0 p-0">
        <CardHeader className="px-0 pt-0 text-center">
          <Typography
            variant="h2"
            className="text-emerald-bg border-none p-0 m-0"
          >
            Partner with Us
          </Typography>
          <Typography variant="muted" className="mt-2">
            Grow your business by reaching more customers
          </Typography>
        </CardHeader>

        <CardContent className="px-0">
          {/* SOCIAL LOGINS */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <GoogleAuthButton
              loading={isGoogleLoading}
              setLoading={setIsGoogleLoading}
              country={country}
              language={language}
              role="restaurant_owner"
              disabled={isPending}
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

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mx-1"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Owner Name"
                        className="h-13 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
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
                        className="h-13 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
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
                      <PhoneInput
                        placeholder="Phone Number"
                        maxLength={14}
                        defaultCountry="PK"
                        className="h-13 rounded-xl [&_button]:rounded-s-xl [&_input]:rounded-e-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
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
                          className="h-13 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
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
                          className="h-13 pr-12 rounded-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal text-gray-500">
                        I agree to the{" "}
                        <LocalizedLink
                          href="/terms"
                          className="font-bold text-emerald-bg hover:underline"
                        >
                          Terms and Conditions
                        </LocalizedLink>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending || !form.watch("terms")}
                className="w-full h-13 bg-emerald-bg text-white text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Register Restaurant"
                )}
              </Button>
            </form>
          </Form>

          <Typography
            variant="small"
            className="mt-6 text-center text-gray-600 pb-0.5"
          >
            Already a partner?{" "}
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
