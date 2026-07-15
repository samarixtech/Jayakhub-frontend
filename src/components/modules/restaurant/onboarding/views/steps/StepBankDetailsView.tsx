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
import { useTranslations } from "next-intl";
import {
  useStepBankDetails,
  ACCOUNT_TYPES,
} from "../../hooks/useStepBankDetails";

export default function StepBankDetailsView() {
  const { form, onSubmit, banks, loadingBanks } = useStepBankDetails();
  const t = useTranslations("Onboarding.bankDetailsView");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-gray-900">
          {t("title")}
        </Typography>
        <Typography className="text-gray-500 mt-1">
          {t("subtitle")}
        </Typography>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-4">
        <div className="bg-emerald-bg p-2 rounded-lg text-white">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <Typography className="text-emerald-bg font-bold text-sm">
            {t("sslTitle")}
          </Typography>
          <Typography className="text-emerald-bg/80 text-xs mt-1">
            {t("sslDesc")}
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
                  {t("accountTitleLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("accountTitlePlaceholder")}
                    className="h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-bold uppercase text-gray-400">
                    {t("bankNameLabel")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={loadingBanks}>
                    <FormControl>
                      <SelectTrigger className="h-12! bg-gray-50/50 border-gray-100 rounded-xl w-full">
                        <SelectValue placeholder={loadingBanks ? t("loadingBanks") : t("selectBank")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-50" position="popper">
                      {banks.map((bank) => (
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
                    {t("accountTypeLabel")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12! bg-gray-50/50 border-gray-100 rounded-xl w-full">
                        <SelectValue placeholder={t("selectType")} />
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
                  {t("ibanLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("ibanPlaceholder")}
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
              {t("payoutScheduleTitle")}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-bg" />
                <span className="text-xs text-gray-600">
                  {t("weeklyPayouts")}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-emerald-bg" />
                <span className="text-xs text-gray-600">
                  {t("processingTime")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              className="bg-emerald-bg text-white px-10 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover"
            >
              {t("nextStep")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
