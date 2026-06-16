"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { RequestPayoutPayload } from "../hooks/usePayouts";

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: RequestPayoutPayload) => Promise<void>;
  isSubmitting: boolean;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const t = useTranslations("RestaurantDashboard.Payouts.form");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    await onSubmit({
      amount: parsedAmount,
    });
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t("title")}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="amount">{t("amountLabel")}</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder={t("amountPlaceholder")}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancelBtn")}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? t("submitting") : t("submitBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPayoutModal;
