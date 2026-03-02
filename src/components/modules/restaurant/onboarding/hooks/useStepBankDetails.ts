"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  bankDetailsSchema,
  BankDetailsInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";

export const BANKS = [
  "Bank of America",
  "Chase",
  "Wells Fargo",
  "Citibank",
  "HSBC",
  "Other",
];

export const ACCOUNT_TYPES = ["Current", "Savings"];

export const useStepBankDetails = () => {
  const { country, language } = useLocale();
  const router = useRouter();

  const form = useForm<BankDetailsInput>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountTitle: "",
      bankName: "",
      accountType: "",
      iban: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_bank_details");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to load bank details", e);
      }
    }
  }, [form]);

  const onSubmit = (data: BankDetailsInput) => {
    localStorage.setItem("onboarding_bank_details", JSON.stringify(data));
    toast.success("Bank details saved");
    router.push(`/restaurant/onboarding/step-review`);
  };

  return {
    form,
    onSubmit,
  };
};
