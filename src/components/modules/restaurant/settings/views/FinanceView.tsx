"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { updateBankDetailsAction, getBanksAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Check, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FinanceView({ settings }: { settings: SettingsData | null }) {
  const t = useTranslations("RestaurantDashboard.Settings.finance");
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

  const [banks, setBanks] = useState<string[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [openBankSelect, setOpenBankSelect] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const response = await getBanksAction();
        if (response.success && response.data?.banks) {
          setBanks(response.data.banks);
        }
      } catch (err) {
        console.error("Failed to load banks", err);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateBankDetailsAction(formData);
      if (response.success) {
        toast.success(response.message || t("successMsg"));
        router.refresh();
      } else {
        toast.error(response.message || t("errorMsg"));
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return <SettingsSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-gray-500">
          {t("subtitle")}
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
            {t("bankDetails")}
          </h3>

          <div
            className={`border border-border bg-muted/20 rounded-xl p-5 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t("bankName")}
                </Label>
                <Popover open={openBankSelect} onOpenChange={setOpenBankSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBankSelect}
                      disabled={isPending || loadingBanks}
                      className="w-full justify-between bg-background border-input font-normal text-left h-10 px-3 hover:bg-muted/50"
                    >
                      {formData.bankName || (loadingBanks ? "Loading banks..." : t("bankName"))}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white" align="start">
                    <Command className="bg-white">
                      <CommandInput placeholder="Search bank..." className="h-9" />
                      <CommandList>
                        <ScrollArea className="h-72">
                          <CommandEmpty>No bank found.</CommandEmpty>
                          <CommandGroup>
                            {banks.map((bankName) => (
                              <CommandItem
                                key={bankName}
                                value={bankName}
                                onSelect={() => {
                                  setFormData((prev) => ({ ...prev, bankName }));
                                  setOpenBankSelect(false);
                                }}
                                className="flex items-center justify-between text-sm cursor-pointer"
                              >
                                {bankName}
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    formData.bankName === bankName ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t("accountHolder")}
                </Label>
                <Input
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder={t("accountHolder")}
                  className="bg-background"
                  disabled={isPending}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                {t("iban")}
              </Label>
              <Input
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder={t("iban")}
                className="bg-background"
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6 border-t border-border mt-2">
        <Button onClick={handleSave} disabled={loading || isPending}>
          {loading ? "Saving..." : t("saveBtn")}
        </Button>
      </CardFooter>
    </Card>
  );
}
