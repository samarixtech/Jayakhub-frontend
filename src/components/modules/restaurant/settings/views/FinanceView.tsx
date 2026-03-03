"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { updateBankDetailsAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FinanceView({ settings }: { settings: SettingsData | null }) {
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
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Finance Details</CardTitle>
        <CardDescription className="text-gray-500">
          Manage your banking information for payouts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPending && (
          <Alert className="bg-blue-50 border-blue-200">
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

        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-semibold text-gray-800">
            Bank Account Details
          </h3>

          <div
            className={`border border-border bg-muted/20 rounded-xl p-5 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Bank Name
                </Label>
                <Input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  className="bg-background"
                  disabled={isPending}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Account Holder Name
                </Label>
                <Input
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder="Account Holder Name"
                  className="bg-background"
                  disabled={isPending}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                IBAN / Account Number
              </Label>
              <Input
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="IBAN / Account Number"
                className="bg-background"
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6 border-t border-border mt-2">
        <Button onClick={handleSave} disabled={loading || isPending}>
          {loading ? "Saving..." : "Save Finance Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
