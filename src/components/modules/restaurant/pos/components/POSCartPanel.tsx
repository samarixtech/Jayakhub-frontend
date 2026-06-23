"use client";

import React, { useState } from "react";
import {
  Utensils,
  ShoppingBag,
  Bike,
  ReceiptText,
  User,
  Plus,
  Minus,
  X,
  Clock,
} from "lucide-react";
import { usePOS } from "@/context/POSContext";
import { useCLC } from "@/context/CLCContext";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  loadCartFromDB,
  clearCart,
  setOrderType,
  saveToPendingOrdersThunk,
} from "@/redux/slices/cartSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TableModal from "./TableModal";
import ItemModifiersModal from "./ItemModifiersModal";
import PaymentModal from "./PaymentModal";
import toast from "react-hot-toast";

export default function POSCartPanel() {
  const { formatPrice } = useCLC();
  const { isCartOpen, setIsCartOpen, setActiveModifierItemId, selectedTable } =
    usePOS();

  const dispatch = useDispatch<AppDispatch>();
  const {
    items: cartItems,
    isLoading,
    orderType,
    // pendingOrders,
  } = useSelector((state: RootState) => state.cart);

  React.useEffect(() => {
    dispatch(loadCartFromDB());
  }, [dispatch]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "F2") {
        e.preventDefault();
        if (cartItems.length > 0) {
          dispatch(
            saveToPendingOrdersThunk({
              tableName: selectedTable?.name || undefined,
            }),
          );
          toast.success("Order saved to Pending!");
        }
      } else if (e.key === "F3") {
        e.preventDefault();
        if (cartItems.length > 0) {
          setIsPaymentModalOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartItems.length, dispatch, selectedTable]);

  const subtotal = cartItems.reduce((acc, item) => {
    const extraPrice = item.selectedVariations?.length
      ? item.selectedVariations.reduce((s, v) => s + (v.additionalPrice ?? 0), 0)
      : (item.selectedVariation?.additionalPrice ?? 0);
    return acc + (item.price + extraPrice) * item.quantity;
  }, 0);
  const total = subtotal;

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cartItems.find((i) => i.cartId === id || i.id === id);
    if (item) {
      dispatch(updateQuantity({ id, quantity: item.quantity + delta }));
    }
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(updateQuantity({ id, quantity: 0 }));
  };

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isModifiersOpen, setIsModifiersOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const CartContent = () => (
    <div className="w-full h-full lg:w-[300px] xl:w-[320px] bg-white lg:border-l border-gray-200 flex flex-col z-10 shrink-0">
      {/* Top Toggle */}
      <div className="p-3">
        <div className="flex border border-gray-200 rounded-md overflow-hidden h-[36px]">
          <button
            onClick={() => dispatch(setOrderType("Dine-In"))}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all ${orderType === "Dine-In" ? "bg-[#357252] text-white" : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <Utensils className="w-[13px] h-[13px]" />{" "}
            <span className="hidden lg:inline">Dine-In</span>
            <span className="lg:hidden">Dine</span>
          </button>
          <div className="w-px bg-gray-200"></div>
          <button
            onClick={() => dispatch(setOrderType("Takeaway"))}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all ${orderType === "Takeaway" ? "bg-[#357252] text-white" : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <ShoppingBag className="w-[13px] h-[13px]" />{" "}
            <span className="hidden lg:inline">Takeaway</span>
            <span className="lg:hidden">Take</span>
          </button>
          <div className="w-px bg-gray-200"></div>
          <button
            onClick={() => dispatch(setOrderType("Delivery"))}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all ${orderType === "Delivery" ? "bg-[#357252] text-white" : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <Bike className="w-[13px] h-[13px]" /> Delivery
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Table & Customer Details */}
        <div className="px-3 pt-3 pb-2 shrink-0">
          <div className="flex border border-gray-100 rounded-md text-[11px] bg-white h-[36px]">
            {orderType === "Dine-In" && (
              <div
                onClick={() => setIsTableModalOpen(true)}
                className="flex-1 px-3 border-r border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[9px]">
                  Table
                </span>
                <span className="font-black text-[#111] text-[12px]">
                  {selectedTable ? selectedTable.name : "Select"}
                </span>
              </div>
            )}
            <div
              className={`flex-1 px-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors ${orderType !== "Dine-In" && "justify-center"}`}
            >
              <User className="w-[12px] h-[12px] text-[#357252] stroke-[2.5px]" />
              <span className="font-bold text-[#111] text-[12px] truncate">
                Walk-In
              </span>
            </div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-[100px] p-0 bg-white">
          {isLoading ? (
            <div className="flex flex-col px-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col p-3 border border-gray-100 rounded-xl bg-gray-50 animate-pulse"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
              <div className="mb-3">
                <ReceiptText className="w-10 h-10 text-gray-200 stroke-[1.5px]" />
              </div>
              <p className="font-bold text-gray-400 text-[13px]">
                No items yet
              </p>
              <p className="text-[11px] mt-0.5 text-gray-300 font-medium text-center px-4">
                Tap a menu item to start your order
              </p>
            </div>
          ) : (
            <div className="flex flex-col px-3 gap-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col p-3 border border-[#f5e1c4] bg-[#fffbf4] transition-colors rounded-xl shadow-[0_1px_3px_rgba(245,166,35,0.1)]"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-black text-[#111827] text-[13px] leading-tight flex-1 pr-2">
                      {item.name}
                    </span>
                    <span className="font-black text-[#111827] text-[13px] shrink-0">
                      {(() => {
                        const extra = item.selectedVariations?.length
                          ? item.selectedVariations.reduce((s: number, v: any) => s + (v.additionalPrice ?? 0), 0)
                          : (item.selectedVariation?.additionalPrice ?? 0);
                        return formatPrice((item.price + extra) * item.quantity);
                      })()}
                    </span>
                  </div>

                  {/* Selected variants */}
                  {(item.selectedVariations?.length
                    ? item.selectedVariations
                    : item.selectedVariation
                      ? [item.selectedVariation]
                      : []
                  ).map((v: any, vi: number) => (
                    <div key={vi} className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] text-[#357252] font-semibold">
                        {v.name}
                      </span>
                      {v.additionalPrice > 0 && (
                        <span className="text-[10px] text-[#357252] font-semibold">
                          +{formatPrice(v.additionalPrice)}
                        </span>
                      )}
                    </div>
                  ))}

                  <div className="mt-1.5" />

                  <div className="flex items-center justify-start gap-3 mb-3 mt-0">
                    <div className="flex items-center bg-[#f0f4ff] rounded p-0.5 mt-1 border border-blue-50">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.cartId || item.id, -1)
                        }
                        className="w-5 h-5 flex items-center justify-center bg-transparent text-[#6b7280] hover:text-[#374151] transition-colors"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5px]" />
                      </button>
                      <span className="w-6 text-center font-bold text-[12px] text-[#111827]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.cartId || item.id, 1)
                        }
                        className="w-5 h-5 flex items-center justify-center bg-transparent text-[#6b7280] hover:text-[#374151] transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5px]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[#6b7280] font-medium text-[11px]">
                        @ {formatPrice(item.price)}
                      </span>
                      {item.basePrice && item.basePrice !== item.price && (
                        <span className="text-gray-400 text-[10px] line-through">
                          {formatPrice(item.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveModifierItemId(item.cartId || item.id);
                        setIsModifiersOpen(true);
                      }}
                      className="flex-1 py-1 rounded-md bg-[#edf6f1] text-[#357252] hover:bg-[#d6efe6] text-[10px] font-bold transition-colors"
                    >
                      Modifiers
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFromCart(item.cartId || item.id)
                      }
                      className="flex-1 py-1 rounded-md bg-red-50 text-[#ef4444] hover:bg-red-100 text-[10px] font-bold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Area */}
      <div className="p-3 sm:p-4 border-t border-gray-100 bg-white shrink-0 mt-auto">
        <div className="space-y-[4px] text-[12px] mb-4">
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Items</span>
            <span className="text-gray-700">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400 font-medium">
            <span>Subtotal</span>
            <span className="text-gray-700">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="font-black text-gray-900 text-[15px] sm:text-[16px]">
            Total
          </span>
          <span className="font-black text-gray-900 text-[15px] sm:text-[16px]">
            {formatPrice(total)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (cartItems.length > 0) {
                dispatch(
                  saveToPendingOrdersThunk({
                    tableName: selectedTable?.name || undefined,
                  }),
                );
                toast.success("Order saved to Pending!");
              }
            }}
            disabled={cartItems.length === 0}
            className="flex-1 bg-[#fffbe6] text-[#b8860b] font-bold py-2 md:py-2.5 rounded-[6px] flex flex-col items-center justify-center gap-[4px] hover:bg-[#fff7d1] transition-colors shadow-[0_1px_2px_rgba(184,134,11,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="w-[16px] h-[16px] stroke-[2px]" />
            <span className="text-[10px] uppercase font-black tracking-tight">
              Pay Later
            </span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex-1 bg-[#1eb589] hover:bg-[#159a72] text-white font-bold py-2 md:py-2.5 rounded-[6px] flex items-center justify-center gap-1.5 text-[14px] transition-colors shadow-[0_1px_2px_rgba(30,181,137,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0}
          >
            Pay →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex shrink-0 h-full">
        <CartContent />
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="p-0 w-full sm:w-[400px] bg-white border-l-0 flex flex-col"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <CartContent />
          </div>
        </SheetContent>
      </Sheet>

      <TableModal open={isTableModalOpen} onOpenChange={setIsTableModalOpen} />
      <ItemModifiersModal
        open={isModifiersOpen}
        onOpenChange={setIsModifiersOpen}
      />
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
      />
    </>
  );
}
