"use client";
import { useState } from "react";
import * as z from "zod";
import { CreditCard, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import creditCardType from "credit-card-type";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addCardAction,
  updateCardAction,
} from "@/app/actions/customer/userprofile";
import { useZodForm } from "@/hooks/use-zod-form";

const formatCardNumber = (v: string) =>
  v
    .replace(/\s?/g, "")
    .replace(/(\d{4})/g, "$1 ")
    .trim()
    .slice(0, 19);

const formatExpiryDate = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{0,2})/, "$1/$2")
    .slice(0, 5);

const cardSchema = z.object({
  cardNumber: z.string().min(19, "Full card number required"),
  expiryDate: z.string().min(5, "Format: MM/YY"),
  cvv: z.string().min(3, "Min 3 digits").max(4),
  cardholderName: z.string().min(2, "Name is required"),
  isDefault: z.boolean().default(false),
});

interface AddCardFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  card?: any;
}

export function AddCardForm({ onSuccess, onCancel, card }: AddCardFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [cardBrand, setCardBrand] = useState<string>(
    card?.cardType || "unknown",
  );

  const form = useZodForm(cardSchema, {
    defaultValues: {
      cardNumber: card?.cardNumber || "",
      expiryDate: card?.expiryDate || "",
      cvv: card?.cvv || "",
      cardholderName: card?.cardholderName || "",
      isDefault: card?.isDefault || false,
    },
  });

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (v: string) => void,
  ) => {
    const formatted = formatCardNumber(e.target.value);
    onChange(formatted);
    const types = creditCardType(formatted);
    setCardBrand(types.length === 1 ? types[0].type : "unknown");
  };

  async function onSubmit(values: z.infer<typeof cardSchema>) {
    setIsPending(true);
    const payload = { ...values, cardType: cardBrand };

    const result = card
      ? await updateCardAction(card.id, payload)
      : await addCardAction(payload);

    if (result.success) {
      toast.success(result.message);
      if (!card) form.reset();
      onSuccess();
    } else {
      toast.error(result.message);
    }
    setIsPending(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold text-gray-500 uppercase">
                Card Number
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 flex items-center justify-center pointer-events-none">
                    {cardBrand === "unknown" ? (
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    ) : (
                      <span className="text-[10px] font-black italic px-1.5 py-0.5 rounded border border-gray-200 uppercase bg-gray-100">
                        {cardBrand}
                      </span>
                    )}
                  </div>
                  <Input
                    {...field}
                    placeholder="0000 0000 0000 0000"
                    onChange={(e) => handleCardChange(e, field.onChange)}
                    className="pl-16 h-12 rounded-2xl border-gray-100 bg-gray-50 font-mono"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase">
                  Expiry Date
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MM/YY"
                    onChange={(e) =>
                      field.onChange(formatExpiryDate(e.target.value))
                    }
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-gray-500 uppercase">
                  CVV
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="•••"
                      className="h-12 rounded-2xl border-gray-100 bg-gray-50"
                    />
                    <HelpCircle className="absolute right-4 top-3.5 h-5 w-5 text-gray-300" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold text-gray-500 uppercase">
                Cardholder Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="FULL NAME"
                  className="h-12 rounded-2xl border-gray-100 bg-gray-50 uppercase"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
              <Checkbox
                id="isDefault"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-[#2D6A4F] border-gray-300"
              />
              <label
                htmlFor="isDefault"
                className="text-xs font-semibold text-gray-600 cursor-pointer"
              >
                Set as default payment method
              </label>
            </div>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 h-14 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold transition-all"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : card ? (
              "Update Card"
            ) : (
              "Save Card"
            )}
          </Button>
          {card && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-14 rounded-full border-gray-200 font-bold"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
