import { Banknote, CreditCard, CheckCircle2, Circle } from "lucide-react";

interface CheckoutPaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  savedCards: any[];
}

export const CheckoutPaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  savedCards,
}: CheckoutPaymentMethodProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Banknote className="text-[#346853]" size={20} />
        <h3 className="font-bold text-lg text-gray-900">Payment Method</h3>
      </div>
      <div className="space-y-3">
        {/* Stripe Option */}
        <div
          onClick={() => setPaymentMethod("stripe")}
          className={`border p-4 rounded-lg cursor-pointer transition-all ${
            paymentMethod === "stripe" || paymentMethod.startsWith("pm_")
              ? "border-[#346853] bg-[#346853]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CreditCard
                className={
                  paymentMethod === "stripe" || paymentMethod.startsWith("pm_")
                    ? "text-[#346853]"
                    : "text-gray-400"
                }
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Credit Card / Stripe
                </p>
                <p className="text-xs text-gray-500">
                  Secure payment via Stripe
                </p>
              </div>
            </div>
            {(paymentMethod === "stripe" ||
              paymentMethod.startsWith("pm_")) && (
              <CheckCircle2 className="text-[#346853] fill-[#346853]/20" />
            )}
          </div>

          {/* Saved Cards & New Card Options */}
          {(paymentMethod === "stripe" || paymentMethod.startsWith("pm_")) && (
            <div className="mt-4 pt-4 border-t border-[#346853]/10 animate-in fade-in slide-in-from-top-2 space-y-3">
              {/* Option: Pay with New Card */}
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  setPaymentMethod("stripe");
                }}
                className={`p-3 rounded-xl border border-dashed flex items-center gap-3 cursor-pointer transition-all group ${
                  paymentMethod === "stripe"
                    ? "border-[#346853] bg-[#346853]/5"
                    : "border-gray-300 hover:border-[#346853] hover:bg-[#346853]/5"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === "stripe"
                      ? "border-[#346853]"
                      : "border-gray-400 group-hover:border-[#346853]"
                  }`}
                >
                  {paymentMethod === "stripe" && (
                    <div className="w-2 h-2 rounded-full bg-[#346853]" />
                  )}
                </div>
                <span className="font-medium text-sm text-gray-700">
                  Pay with a new card
                </span>
              </div>

              {/* Saved Cards List */}
              {savedCards.map((card: any) => (
                <div
                  key={card.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaymentMethod(card.stripePaymentMethodId);
                  }}
                  className={`p-3 rounded-xl border border-dashed flex items-center justify-between cursor-pointer transition-all group ${
                    paymentMethod === card.stripePaymentMethodId
                      ? "border-[#346853] bg-[#346853]/5"
                      : "border-gray-300 hover:border-[#346853] hover:bg-[#346853]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === card.stripePaymentMethodId
                          ? "border-[#346853]"
                          : "border-gray-400 group-hover:border-[#346853]"
                      }`}
                    >
                      {paymentMethod === card.stripePaymentMethodId && (
                        <div className="w-2 h-2 rounded-full bg-[#346853]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900 capitalize">
                        {card.cardType} •••• {card.last4}
                      </span>
                      <span className="text-xs text-gray-500">
                        Expires {card.expiryDate}
                      </span>
                    </div>
                  </div>
                  <CreditCard size={16} className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COD Option */}
        <div
          onClick={() => setPaymentMethod("cod")}
          className={`border p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
            paymentMethod === "cod"
              ? "border-[#346853] bg-[#346853]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <Banknote
              className={
                paymentMethod === "cod" ? "text-[#346853]" : "text-gray-400"
              }
            />
            <div>
              <p className="font-bold text-gray-900 text-sm">
                Cash on Delivery
              </p>
              <p className="text-xs text-gray-500">Pay when food arrives</p>
            </div>
          </div>
          {paymentMethod === "cod" ? (
            <CheckCircle2 className="text-[#346853] fill-[#346853]/20" />
          ) : (
            <Circle className="text-gray-300" />
          )}
        </div>
      </div>
    </div>
  );
};
