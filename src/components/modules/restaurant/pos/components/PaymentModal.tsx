"use client";

import React, { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import {
  Check,
  Printer,
  Loader2,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { usePOS } from "@/context/POSContext";
import { useCLC } from "@/context/CLCContext";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/redux/slices/cartSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import { addCartItemsAction } from "@/app/actions/restaurant/cart";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentMethod = "cash" | "card" | "online" | null;
type PaymentStep = "select" | "receipt";

export default function PaymentModal({
  open,
  onOpenChange,
}: PaymentModalProps) {
  const t = useTranslations("POS.payment");
  const { selectedTable } = usePOS();
  const { formatPrice } = useCLC();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { orderType } = useSelector((state: RootState) => state.cart);

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [step, setStep] = useState<PaymentStep>("select");
  const [deliveryCharges, setDeliveryCharges] = useState<string>("0");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const displaySubtotal = cartItems.reduce((acc, item) => {
    const extraPrice = item.selectedVariations?.length
      ? item.selectedVariations.reduce(
          (s: number, v: any) => s + (Number(v.additionalPrice) || 0),
          0,
        )
      : Number(item.selectedVariation?.additionalPrice) || 0;
    return acc + (Number(item.price) + extraPrice) * item.quantity;
  }, 0);
  const displayTotal = displaySubtotal;
  const deliveryChargesNum = parseFloat(deliveryCharges) || 0;
  const actualTotal =
    orderType === "Delivery" ? displayTotal + deliveryChargesNum : displayTotal;
  const paidAmountNum = parseFloat(paidAmount) || 0;
  const isPaidAmountInvalid = paidAmountNum <= 0 || paidAmountNum < actualTotal;

  React.useEffect(() => {
    if (open) {
      setMethod(null);
      setStep("select");
      setDeliveryCharges("0");
      setReceiptData(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (open && step === "select") {
      setPaidAmount(displayTotal.toFixed(2));
    }
  }, [open, displayTotal, step]);

  const handleConfirm = async () => {
    if (isPaidAmountInvalid) {
      toast.error(t("toasts.amountTooLow"));
      return;
    }
    if (method && cartItems.length > 0) {
      setIsProcessing(true);

      const payload: Record<string, any> = {
        paymentMethod: method.charAt(0).toUpperCase() + method.slice(1),
        orderType,
        items: cartItems.map((item) => {
          const entry: Record<string, any> = {
            itemId: item.cashierItemId || item.id,
            quantity: item.quantity,
          };
          const vars: any[] = item.selectedVariations?.length
            ? item.selectedVariations
            : item.selectedVariation
              ? [item.selectedVariation]
              : [];
          if (vars.length === 1) {
            const vgId = vars[0].variantGroupId || vars[0].id;
            if (vgId) entry.variantGroupId = vgId;
            entry.variantOptionName = vars[0].name;
          } else if (vars.length > 1) {
            entry.variantGroupIds = vars
              .map((v) => v.variantGroupId || v.id)
              .filter(Boolean);
            entry.variantOptionNames = vars.map((v) => v.name);
          }
          return entry;
        }),
      };
      if (selectedTable?.name) payload.tableName = selectedTable.name;
      if (orderType === "Delivery" && deliveryChargesNum > 0)
        payload.deliveryFee = deliveryChargesNum;

      try {
        const result = await addCartItemsAction(payload);
        if (result.success) {
          toast.success(t("toasts.success"));
          setReceiptData(result.data);
          dispatch(clearCart());
          setStep("receipt");
        } else {
          toast.error(result.message || t("toasts.failed"));
        }
      } catch (err: any) {
        console.error("Payment error:", err);
        toast.error(err?.message || t("toasts.error"));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleNewOrder = () => {
    onOpenChange(false);
  };

  if (step === "receipt") {
    const receiptItems: any[] = receiptData?.items || [];
    const receiptOrderId = receiptData?.id || "——";
    const receiptDate = receiptData?.createdAt
      ? new Date(receiptData.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "——";
    const receiptTableName =
      receiptData?.tableName || selectedTable?.name || "——";
    const receiptPaymentMethod = receiptData?.paymentMethod || method || "——";
    const receiptOrderType = receiptData?.orderType || orderType;
    const receiptItemsTotal: number = receiptData?.itemsTotal ?? 0;
    const receiptDeliveryFee: number = receiptData?.deliveryFee ?? 0;
    const receiptGrandTotal: number = receiptData?.grandTotal ?? 0;

    const handlePrint = () => {
      const printWindow = window.open("", "_blank", "width=420,height=700");
      if (!printWindow) return;

      const itemsHtml = receiptItems
        .map((item: any) => {
          const discountAmt = parseFloat(item.discount) || 0;
          const hasDiscount = discountAmt > 0;
          const unitPrice = item.basePrice - discountAmt;
          const totalAmt = parseFloat(item.totalAmount) || 0;

          const priceRow = `<tr>
             <td style="font-size:11px;padding:1px 0 0 8px;">
               ${hasDiscount ? `<s style="color:#bbb;">${formatPrice(item.basePrice)}</s> ` : ""}
               <span style="color:#666;">${formatPrice(hasDiscount ? unitPrice : item.basePrice)} x ${item.quantity}</span>
             </td>
             <td style="text-align:right;font-size:10px;padding:1px 0 0;">
               ${hasDiscount ? `<span style="background:#fee2e2;color:#dc2626;font-weight:700;padding:1px 4px;border-radius:4px;">-${formatPrice(discountAmt)} ${t("itemOff")}</span>` : ""}
             </td>
           </tr>`;

          const variantRows = (item.variants || [])
            .map(
              (v: any) =>
                `<tr>
             <td style="color:#888;font-size:11px;padding:1px 0 0 8px;">${v.groupName}: <b>${v.optionName}</b></td>
             <td style="color:#1eb589;font-size:11px;text-align:right;padding:1px 0 0;">${v.price > 0 ? `+${formatPrice(v.price)}` : ""}</td>
           </tr>`,
            )
            .join("");

          return `
          <tr>
            <td style="font-weight:700;padding:6px 0 0;font-size:13px;">${item.quantity}x ${item.itemName}</td>
            <td style="font-weight:700;text-align:right;padding:6px 0 0;font-size:13px;">${formatPrice(totalAmt)}</td>
          </tr>
          ${priceRow}
          ${variantRows}`;
        })
        .join("");

      const deliveryRow =
        receiptDeliveryFee > 0
          ? `<tr>
             <td style="color:#666;padding:3px 0;">${t("deliveryFee")}</td>
             <td style="text-align:right;padding:3px 0;">${formatPrice(receiptDeliveryFee)}</td>
           </tr>`
          : "";

      printWindow.document.write(`
        <!DOCTYPE html><html><head><title>${t("receipt")}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{font-family:'Courier New',Courier,monospace;font-size:13px;padding:24px 20px;max-width:340px;margin:0 auto;}
          h1{text-align:center;font-size:20px;color:#357252;margin-bottom:2px;font-weight:900;}
          .sub{text-align:center;color:#999;font-size:12px;margin-bottom:14px;}
          .meta{display:flex;justify-content:space-between;font-size:11px;color:#666;margin-bottom:8px;}
          hr{border:none;border-top:1px dashed #ccc;margin:10px 0;}
          table{width:100%;border-collapse:collapse;}
          .total-row td{font-weight:900;font-size:15px;padding-top:8px;}
          .footer{text-align:center;color:#aaa;font-size:11px;margin-top:18px;line-height:1.6;}
          @media print{body{padding:8px;}}
        </style></head><body>
        <h1>${t("receipt")}</h1>
        <p class="sub">${receiptOrderType} &middot; ${receiptTableName}</p>
        <div class="meta"><span>${receiptOrderId}</span><span>${receiptDate}</span></div>
        <hr>
        <table>${itemsHtml}</table>
        <hr>
        <table>
          <tr><td style="color:#666;padding:3px 0;">${t("subtotal")}</td><td style="text-align:right;padding:3px 0;">${formatPrice(receiptItemsTotal)}</td></tr>
          ${deliveryRow}
        </table>
        <hr>
        <table>
          <tr class="total-row"><td>${t("grandTotal")}</td><td style="text-align:right;">${formatPrice(receiptGrandTotal)}</td></tr>
        </table>
        <p class="footer">${t("paidVia")} <b>${receiptPaymentMethod}</b><br>${t("thankYou")}</p>
        </body></html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    };

    return (
      <GlobalModal
        open={open}
        onOpenChange={onOpenChange}
        customStyle
        isOutsideDisabled
        className="sm:max-w-[400px] p-6 flex flex-col items-center bg-white border-none shadow-2xl rounded-2xl text-center"
      >
        <div className="flex flex-col items-center w-full pb-6">
          {/* Check icon */}
          <div className="w-12 h-12 rounded-full bg-[#e6f4ef] flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-[#357252] stroke-[3px]" />
          </div>
          <h2 className="text-[20px] font-black text-[#1b2d22] tracking-tight mb-0.5">
            {t("successTitle")}
          </h2>
          <p className="text-[12px] text-[#8ea89a] font-medium mb-5">
            {receiptOrderType} · {receiptTableName}
          </p>

          {/* Order meta */}
          <div className="flex justify-between w-full text-[12px] text-[#556977] font-semibold mb-4 border-b border-dashed border-gray-200 pb-4">
            <span>{receiptOrderId}</span>
            <span>{receiptDate}</span>
          </div>

          {/* Line items */}
          <div className="w-full space-y-3 mb-4">
            {receiptItems.length > 0 ? (
              receiptItems.map((item: any, idx: number) => {
                const discountAmt = parseFloat(item.discount) || 0;
                const hasDiscount = discountAmt > 0;
                const unitPrice = item.basePrice - discountAmt;
                const totalAmt = parseFloat(item.totalAmount) || 0;
                return (
                  <div key={idx} className="w-full">
                    {/* Item name + total */}
                    <div className="flex justify-between text-[13px] text-[#1b2d22] font-bold">
                      <span>
                        {item.quantity}x {item.itemName}
                      </span>
                      <span className="shrink-0 ml-2">
                        {formatPrice(totalAmt)}
                      </span>
                    </div>

                    {/* Unit price x qty, with discount if present */}
                    <div className="flex items-center justify-between text-[11px] mt-0.5 flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5">
                        {hasDiscount && (
                          <span className="text-gray-400 line-through">
                            {formatPrice(item.basePrice)}
                          </span>
                        )}
                        <span className="text-[#8ea89a]">
                          {formatPrice(hasDiscount ? unitPrice : item.basePrice)} x {item.quantity}
                        </span>
                      </div>
                      {hasDiscount && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">
                          -{formatPrice(discountAmt)} {t("itemOff")}
                        </span>
                      )}
                    </div>

                    {/* Variant details */}
                    {item.variants?.map((v: any, vi: number) => (
                      <div
                        key={vi}
                        className="flex justify-between text-[11px] text-[#8ea89a] mt-0.5"
                      >
                        <span>
                          {v.groupName}:{" "}
                          <span className="font-semibold text-[#556977]">
                            {v.optionName}
                          </span>
                        </span>
                        {v.price > 0 && (
                          <span className="text-[#1eb589] font-semibold">
                            +{formatPrice(v.price)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <p className="text-[13px] text-[#8ea89a]">{t("noItems")}</p>
            )}
          </div>

          {/* Subtotal / delivery / total */}
          <div className="w-full space-y-1.5 mb-3">
            <div className="flex justify-between text-[13px] text-[#3e5648] font-medium">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(receiptItemsTotal)}</span>
            </div>
            {receiptDeliveryFee > 0 && (
              <div className="flex justify-between text-[13px] text-[#3e5648] font-medium">
                <span>{t("deliveryFee")}</span>
                <span>{formatPrice(receiptDeliveryFee)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between w-full text-[17px] text-[#111] font-black mb-5 border-t border-dashed border-gray-200 pt-3">
            <span>{t("grandTotal")}</span>
            <span>{formatPrice(receiptGrandTotal)}</span>
          </div>

          <div className="text-center mb-5">
            <p className="text-[13px] text-[#3e5648] font-medium mb-1">
              {t("paidVia")}{" "}
              <span className="font-black text-[#111] capitalize">
                {receiptPaymentMethod}
              </span>
            </p>
            <p className="text-[11px] text-[#8ea89a] font-medium">
              {t("thankYou")}
            </p>
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-[#357252] hover:bg-[#2a5a41] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 stroke-[2.5px]" /> {t("print")}
            </button>
            <button
              onClick={handleNewOrder}
              className="flex-1 bg-[#f4f6f8] hover:bg-[#e9ecef] text-[#111] font-bold py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              {t("newOrder")}
            </button>
          </div>
        </div>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
    >
      <DialogHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[18px] font-black tracking-tight text-[#111] border-none">
          {t("title")}
        </DialogTitle>
      </DialogHeader>

      <div className="p-5">
        {/* Header Total */}
        <div className="bg-[#f2fbf5] rounded-xl flex flex-col items-center justify-center py-4 mb-4">
          <span className="text-[32px] font-black text-[#357252] leading-none mb-1">
            {formatPrice(actualTotal)}
          </span>
          <span className="text-[12px] text-[#789684] font-semibold">
            {t("totalPayable")}
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-[#556977] text-[13px] font-medium">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(displaySubtotal)}</span>
          </div>
          {orderType === "Delivery" && (
            <div className="flex justify-between text-[#556977] text-[13px] font-medium items-center">
              <span>{t("deliveryCharges")}</span>
              <input
                type="number"
                min="0"
                value={deliveryCharges}
                onChange={(e) => setDeliveryCharges(e.target.value)}
                className="w-24 border border-gray-200 text-right rounded-md px-2 py-0.5 text-[13px] font-bold text-[#111] focus:outline-none focus:border-[#357252]"
              />
            </div>
          )}
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center mb-4">
          <span className="text-[15px] font-black text-[#111]">
            {t("total")}
          </span>
          <span className="text-[15px] font-black text-[#111]">
            {formatPrice(actualTotal)}
          </span>
        </div>

        {/* Method Selection */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setMethod("cash")}
            className={`relative flex flex-col items-center justify-center py-3 rounded-xl border ${method === "cash" ? "bg-[#357252] border-[#357252] text-white" : "bg-white border-gray-200 text-[#111] hover:border-gray-300"} transition-all`}
          >
            {method === "cash" && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white stroke-[3px]" />
            )}
            <Banknote
              className={`w-5 h-5 mb-1.5 ${method === "cash" ? "text-white" : "text-[#2a3c30]"} stroke-[2px]`}
            />
            <span
              className={`text-[12px] font-bold ${method === "cash" ? "text-white" : "text-[#111]"}`}
            >
              {t("cash")}
            </span>
          </button>

          <button
            onClick={() => setMethod("card")}
            className={`relative flex flex-col items-center justify-center py-3 rounded-xl border ${method === "card" ? "bg-[#357252] border-[#357252] text-white" : "bg-white border-gray-200 text-[#111] hover:border-gray-300"} transition-all`}
          >
            {method === "card" && (
              <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-white stroke-[3px]" />
            )}
            <CreditCard
              className={`w-5 h-5 mb-1.5 ${method === "card" ? "text-white" : "text-[#2a3c30]"} stroke-[2px]`}
            />
            <span
              className={`text-[12px] font-bold ${method === "card" ? "text-white" : "text-[#111]"}`}
            >
              {t("card")}
            </span>
          </button>
        </div>

        {/* Paid Amount */}
        <div className="bg-[#fcfdfd] border border-gray-100 p-3 rounded-xl mb-4 flex flex-col items-center">
          <span className="text-[#657a8a] text-[11px] font-bold mb-1.5 w-full text-left">
            {t("paidAmount")}
          </span>
          <input
            type="number"
            min={actualTotal}
            step="0.01"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className={`w-full border-2 text-center rounded-lg py-1.5 text-[16px] outline-none font-black text-[#111] mb-2 ${
              isPaidAmountInvalid
                ? "border-red-400 focus:border-red-400"
                : "border-[#357252] focus:border-[#357252]"
            }`}
          />
          {isPaidAmountInvalid ? (
            <span className="text-[12px] font-bold text-red-500 text-center">
              {t("amountTooLow")}
            </span>
          ) : (
            <span className="text-[14px] font-black text-[#1eb589]">
              {t("change")} {formatPrice(paidAmountNum - actualTotal)}
            </span>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method || isProcessing || isPaidAmountInvalid}
          className={`w-full font-bold py-3 rounded-xl text-[14.5px] transition-colors flex items-center justify-center gap-2 ${
            !method || isProcessing || isPaidAmountInvalid
              ? "bg-[#8debb4] text-white cursor-not-allowed opacity-80"
              : "bg-[#1eb589] hover:bg-[#159a72] text-white shadow-md"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : !method ? (
            t("selectMethod")
          ) : (
            t("confirmPayment", { method: t(method) })
          )}
        </button>
      </div>
    </GlobalModal>
  );
}
