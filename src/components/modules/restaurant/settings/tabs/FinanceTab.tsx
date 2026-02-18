"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "../types";
import { updateBankDetailsAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function FinanceTab({ settings }: { settings: SettingsData | null }) {
  const router = useRouter();
  const bank = settings?.bankAccount;
  const updateStatus = settings?.onboardingUpdate?.bankDetails || "none";
  const isPending = updateStatus === "pending";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bankName: bank?.bankName || "",
    accountHolderName: bank?.accountHolderName || "",
    iban: bank?.iban || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateBankDetailsAction(formData);
      if (response.success) {
        toast.success(response.message || "Bank details update requested.");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update bank details.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Finance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Banking information.</p>
      </div>

      {isPending && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-semibold">
            Update Pending
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            YOUR CHANGES ARE SUBMITTED, WE ARE REVIEWING IT AND WILL APPROVE
            SHORTLY.
          </AlertDescription>
        </Alert>
      )}

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Bank Account Details
      </h3>

      <div
        className={`border border-gray-100 rounded-xl p-5 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Bank Name
            </Label>
            <Input
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Bank Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
              disabled={isPending}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Account Holder Name
            </Label>
            <Input
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Account Holder Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
              disabled={isPending}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">
            IBAN / Account Number
          </Label>
          <Input
            name="iban"
            value={formData.iban}
            onChange={handleChange}
            placeholder="IBAN / Account Number"
            className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={handleSave}
          disabled={loading || isPending}
        >
          {loading ? "Saving..." : "Save Finance Details"}
        </Button>
      </div>
    </div>
  );
}
