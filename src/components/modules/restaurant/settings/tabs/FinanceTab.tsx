import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "../types";

export function FinanceTab({ settings }: { settings: SettingsData | null }) {
  const bank = settings?.bankAccount;

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Finance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Banking information.</p>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Bank Account Details
      </h3>

      <div className="border border-gray-100 rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Bank Name
            </Label>
            <Input
              defaultValue={bank?.bankName || ""}
              placeholder="Bank Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Account Holder Name
            </Label>
            <Input
              defaultValue={bank?.accountHolderName || ""}
              placeholder="Account Holder Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">
            IBAN / Account Number
          </Label>
          <Input
            defaultValue={bank?.iban || ""}
            placeholder="IBAN / Account Number"
            className="h-10 border-gray-200 text-sm focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Save Finance Details
        </Button>
      </div>
    </div>
  );
}
