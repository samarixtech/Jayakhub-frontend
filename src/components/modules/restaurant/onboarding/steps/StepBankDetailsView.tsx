"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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
  bankDetailsSchema,
  BankDetailsInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";

const BANKS = [
  "Bank of America",
  "Chase",
  "Wells Fargo",
  "Citibank",
  "HSBC",
  "Other",
];

const ACCOUNT_TYPES = ["Current", "Savings"];

export default function StepBankDetailsView() {
  const { country, language } = useLocale();
  const router = useRouter();
  const { prevStep } = useOnboarding();

  const form = useForm<BankDetailsInput>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountTitle: "",
      bankName: "",
      accountType: "",
      iban: "",
    },
  });

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_bank_details");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (e) {}
    }
  }, [form]);

  const onSubmit = (data: BankDetailsInput) => {
    console.log("Static Mode: Saving Bank Details", data);
    localStorage.setItem("onboarding_bank_details", JSON.stringify(data));
    toast.success("Bank details saved! (Static)");

    // Navigate to Review Step
    router.push(`/${country}/${language}/restaurant/onboarding/step-review`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-[#111827]">
          Set up your payout account
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Enter your bank details so we can deposit your earnings directly.
        </Typography>
      </div>

      {/* Encryption Notice */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
        <div className="bg-[#346853] p-2 rounded-lg text-white">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <Typography className="text-[#346853] font-bold text-sm">
            256-bit SSL Encryption
          </Typography>
          <Typography className="text-[#346853]/80 text-xs mt-1">
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
              <FormItem>
                <FormLabel className="text-gray-700 font-bold">
                  Account Title / Holder Name{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name as it appears on bank account"
                    className="h-12 bg-gray-50/50 border-gray-200"
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
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">
                    Bank Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200">
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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
                <FormItem>
                  <FormLabel className="text-gray-700 font-bold">
                    Account Type <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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
              <FormItem>
                <FormLabel className="text-gray-700 font-bold">
                  IBAN NO <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="IQ__ ____ ____ ____ ____"
                    className="h-12 bg-gray-50/50 border-gray-200"
                    {...field}
                  />
                </FormControl>
                <Typography className="text-xs text-gray-400">
                  Internal Bank Account Number (23 chars)
                </Typography>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer: Payout Schedule */}
          <div className="pt-4 border-t border-gray-50">
            <Typography className="font-bold text-gray-900 text-sm mb-3">
              Payout Schedule
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Weekly payouts every Monday
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Processing takes 1-2 business days
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                prevStep();
                router.back();
              }}
              className="text-gray-400 font-bold hover:bg-transparent"
            >
              Back
            </Button>

            <div className="flex items-center gap-4">
              <Typography className="text-sm font-medium text-gray-500">
                Step 06 of 07
              </Typography>
              <Button
                type="submit"
                className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                Next Step
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
