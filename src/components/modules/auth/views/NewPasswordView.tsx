"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AuthHeader } from "../components/AuthHeader";
import { PasswordField } from "../components/PasswordField";
import { useNewPassword } from "../hooks/useNewPassword";

export default function NewPasswordView() {
  const { form, onSubmit, isPending } = useNewPassword();

  return (
    <Card className="border-none shadow-none bg-transparent m-0 p-0">
      <div className="mb-6">
        <AuthHeader
          title="New Password"
          description="Enter your new security credentials"
        />
      </div>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordField field={field} placeholder="New Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordField
                      field={field}
                      placeholder="Confirm New Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-emerald-bg text-white rounded-xl text-lg font-bold"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
