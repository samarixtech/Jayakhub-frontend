"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { AuthHeader } from "../components/AuthHeader";
import { SocialAuthButtons } from "../components/SocialAuthButtons";
import { AuthDivider } from "../components/AuthDivider";
import { PasswordField } from "../components/PasswordField";
import { useLogin } from "../hooks/useLogin";

export default function LoginView() {
  const { form, onSubmit, isPending, isGoogleLoading, setIsGoogleLoading } =
    useLogin();

  return (
    <Card className="border-none shadow-none bg-transparent py-2">
      <AuthHeader
        title="Login to Account"
        description="Enter your details to continue"
      />

      <CardContent className="px-0">
        <SocialAuthButtons
          isGoogleLoading={isGoogleLoading}
          setIsGoogleLoading={setIsGoogleLoading}
          isPending={isPending}
        />

        <AuthDivider text="Or continue with email" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-1"
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

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mt-2">
                <Link
                  href="/forget-password"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <Typography variant="small" className="mt-8 text-center text-gray-600">
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
  );
}
