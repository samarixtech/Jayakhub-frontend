"use client";

import { Mail, Phone, Loader2 } from "lucide-react";
import { CustomerProfileData } from "@/types";
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
import { usePersonalInfo } from "./usePersonalInfo";

interface PersonalInfoFormProps {
  profile: CustomerProfileData;
}

export function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const { form, isPending, onSubmit } = usePersonalInfo(profile);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FIRST NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LAST NAME */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL ADDRESS (DISABLED) */}
          <FormItem>
            <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              Email Address
            </FormLabel>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <FormControl>
                <Input
                  disabled
                  value={profile.email || ""}
                  className="pl-12 rounded-2xl border-gray-100 bg-gray-100/50 h-12 cursor-not-allowed text-gray-500"
                />
              </FormControl>
            </div>
          </FormItem>

          {/* PHONE NUMBER */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Phone Number
                </FormLabel>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={18}
                  />
                  <FormControl>
                    <Input
                      placeholder="Phone"
                      className="pl-12 rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-emerald-bg hover:bg-emerald-bg-hover text-white font-bold rounded-xl h-12 px-8"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
