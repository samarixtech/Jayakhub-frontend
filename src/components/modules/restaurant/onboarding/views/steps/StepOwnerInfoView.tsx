"use client";

import { User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useStepOwnerInfo } from "../../hooks/useStepOwnerInfo";
// import { useStepSchedule } from "../../hooks/useStepSchedule";

export default function StepOwnerInfoView() {
  const { form, email, onSubmit, onError } = useStepOwnerInfo();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Who manages this restaurant?
      </Typography>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Owner Name */}
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Name
                  </label>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        placeholder="John Doe"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Owner Email (Read Only) */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl text-gray-500"
                  value={email}
                  disabled
                  readOnly
                />
              </div>
            </div>

            {/* Owner Phone */}
            <FormField
              control={form.control}
              name="ownerPhone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Contact Phone
                  </label>
                  <FormControl>
                    <PhoneInput
                      placeholder="+964 750 000 0000"
                      defaultCountry="IQ"
                      className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-start">
                    <FormMessage />
                    <Typography className="text-[10px] text-gray-400">
                      We will send important updates to this number.
                    </Typography>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end items-center pt-4 border-t border-gray-50 gap-4 sm:gap-0">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
