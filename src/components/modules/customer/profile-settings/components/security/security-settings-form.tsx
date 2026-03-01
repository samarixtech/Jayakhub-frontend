"use client";

import { Lock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSecuritySettings } from "./useSecuritySettings";

export function SecuritySettingsForm() {
  const { form, isPending, onSubmit } = useSecuritySettings();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <p className="text-[14px] font-bold text-gray-900">Change Password</p>

          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[12px] font-bold text-gray-900">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-3.5 text-gray-400"
                      size={18}
                    />
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 rounded-2xl border-gray-100 bg-[#F9FAFB] h-12"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="rounded-2xl border-gray-100 bg-[#F9FAFB] h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[12px] font-bold text-gray-900">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="rounded-2xl border-gray-100 bg-[#F9FAFB] h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8 h-12 font-bold min-w-[180px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
