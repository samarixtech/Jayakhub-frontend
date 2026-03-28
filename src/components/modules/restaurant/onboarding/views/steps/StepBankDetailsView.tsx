"use client";

import { Lock, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStepBankDetails,
  BANKS,
  ACCOUNT_TYPES,
} from "../../hooks/useStepBankDetails";

export default function StepBankDetailsView() {
  const { form, onSubmit } = useStepBankDetails();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-gray-900">
          Set up your payout account
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Enter your bank details so we can deposit your earnings directly.
        </Typography>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
        <div className="bg-emerald-bg p-2 rounded-lg text-white">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <Typography className="text-emerald-bg font-bold text-sm">
            256-bit SSL Encryption
          </Typography>
          <Typography className="text-emerald-bg/80 text-xs mt-1">
            Your banking information is encrypted and stored securely. We never
            share your data.
          </Typography>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountTitle"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold uppercase text-gray-400">
                  Account Tile / Holder Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase text-gray-400">
                    Bank Name
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl">
                        <SelectValue placeholder="Select Bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-50" position="popper" sideOffset={4}>
                      {BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase text-gray-400">
                    Account Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-50" position="popper" sideOffset={4}>
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-bold uppercase text-gray-400">
                  IBAN Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="IQ00 0000 0000 0000 0000 000"
                    className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-6 border-t border-gray-50">
            <Typography className="font-bold text-gray-900 text-sm mb-3">
              Payout Schedule
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-bg" />
                <span className="text-xs text-gray-600">
                  Weekly payouts every Monday
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-bg" />
                <span className="text-xs text-gray-600">
                  Processing takes 1-2 business days
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              className="bg-emerald-bg text-white px-10 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
