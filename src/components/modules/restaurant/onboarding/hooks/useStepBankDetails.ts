"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  bankDetailsSchema,
  BankDetailsInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { getBanksAction } from "@/app/actions/restaurant/settings";

export const ACCOUNT_TYPES = ["Current", "Savings"];

export const useStepBankDetails = () => {
  const { country, language } = useLocale();
  const router = useRouter();
  const t = useTranslations("Onboarding.bankDetailsView");

  const [banks, setBanks] = useState<string[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

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
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const response = await getBanksAction();
        if (response.success && Array.isArray(response.data)) {
          setBanks(response.data);
        }
      } catch (err) {
        console.error("Failed to load banks", err);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

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
    toast.success(t("toastSaved"));
    router.push(`/restaurant/onboarding/step-review`);
  };

  return {
    form,
    onSubmit,
    banks,
    loadingBanks,
  };
};
