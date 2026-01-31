"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  ownerInfoSchema,
  OwnerInfoInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { getProfile } from "@/app/actions/customer/userprofile";
import { Mail } from "lucide-react";

import { WizardStepProps } from "../types";
import { useOnboarding } from "../OnboardingContext";

export default function StepOwnerInfoView({ onNext, onBack }: WizardStepProps) {
  const router = useRouter();
  console.log(
    "StepOwnerInfoView rendered. onNext:",
    !!onNext,
    "onBack:",
    !!onBack,
  );
  const { country, language } = useLocale();
  const { nextStep } = useOnboarding();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function fetchEmail() {
      const res = await getProfile();
      if (res.success && res.data?.email) {
        setEmail(res.data.email);
      }
    }
    fetchEmail();
  }, []);

  const form = useForm<OwnerInfoInput>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
    },
  });
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("onboarding_owner_info");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      }
    } catch (e) {
      console.error("Failed to load owner info", e);
    }
  }, []); // Empty dependency array to run only on mount

  const onSubmit = (data: OwnerInfoInput) => {
    console.log("Static Mode: Saving Owner Info", data);
    try {
      localStorage.setItem("onboarding_owner_info", JSON.stringify(data));
      toast.success("Owner info saved! (Static)");
    } catch (e) {
      console.error("LocalStorage Save Error", e);
    }

    // Simplified navigation using Context
    console.log("Calling nextStep from Context...");
    nextStep();
    router.push(
      `/${country}/${language}/restaurant/onboarding/step-restaurant-info`,
    );
  };

  const onError = (errors: any) => {
    console.error("Validation Errors:", errors);
    toast.error("Please check the form for errors");
  };

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
                    <div className="relative">
                      <Phone className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        placeholder="+964 000 000 0000"
                        {...field}
                      />
                    </div>
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

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Typography className="text-sm font-medium text-gray-500">
              Step 01 of 06
            </Typography>
            <Button
              type="submit"
              onClick={() => console.log("Next Step Button Clicked")}
              disabled={false}
              className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
