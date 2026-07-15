"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity } from "@/redux/slices/cartSlice";
import { setSelectedRestaurantMeta } from "@/redux/slices/discoverySlice";

import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Info,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter, useParams } from "next/navigation";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { currency, country, language } = useCLC();
  const t = useTranslations("Cart");
  const cart = useSelector((state: RootState) => state.cart.items);
  const selectedRestaurantMeta = useSelector((state: RootState) => state.discovery.selectedRestaurantMeta);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();

  // View state: 'grouped' shows list of restaurants, 'detail' shows items for a specific restaurant
  const [viewMode, setViewMode] = useState<"grouped" | "detail">("grouped");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  // Group items by restaurant
  const groupedCart = useMemo(() => {
    const groups: Record<
      string,
      { name: string; image?: string; items: typeof cart }
    > = {};
    cart.forEach((item) => {
      const resId = item.restaurantId || "unknown";
      if (!groups[resId]) {
        groups[resId] = {
          name: item.restaurantName || t("unknownRestaurant"),
          image: item.restaurantImage,
          items: [],
        };
      }
      groups[resId].items.push(item);
    });
    return groups;
  }, [cart, t]);

  // If there's only one restaurant, or we are on a restaurant page, we might want to default to detail?
  // But per request: "DISPLAY A RESTAURANT ONLY IN CART WITH 'VIEW CART' BUTTON"
  // So we default to grouped unless specified.

  useEffect(() => {
    if (!isOpen) {
      setViewMode("grouped");
      setSelectedRestaurantId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedRestaurantMeta) {
      try {
        const saved = localStorage.getItem("selectedRestaurantMeta");
        if (saved) dispatch(setSelectedRestaurantMeta(JSON.parse(saved)));
      } catch {}
    }
  }, []);

  const hasItems = cart.length > 0;

  const currentGroup = selectedRestaurantId
    ? groupedCart[selectedRestaurantId]
    : null;
  const currentItems = currentGroup?.items || [];

  const subtotal = currentItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryFee = selectedRestaurantMeta?.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearRestaurantCart = (resId: string) => {
    const itemsToRemove = groupedCart[resId]?.items || [];
    itemsToRemove.forEach((item) => {
      dispatch(updateQuantity({ id: item.cartId || item.id, quantity: 0 }));
    });
    if (selectedRestaurantId === resId) {
      setViewMode("grouped");
      setSelectedRestaurantId(null);
    }
  };

  const handleCheckout = () => {
    const routeCountry = params?.country || country.toLowerCase();
    const routeLang = params?.language || language.toLowerCase();
    router.push(`/${routeCountry}/${routeLang}/checkout`);
    onClose();
  };

  const selectRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    setViewMode("detail");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-[400px] h-full bg-white z-9999 shadow-2xl
        transition-transform duration-300 transform flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              {viewMode === "detail" ? (
                <button
                  onClick={() => setViewMode("grouped")}
                  className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
              ) : (
                <ShoppingBag className="w-5 h-5 text-[#346853]" />
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {viewMode === "grouped" ? t("title") : currentGroup?.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {viewMode === "detail" && (
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">
                {t("itemsCount", { count: currentItems.length })}
              </p>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          {!hasItems ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">
                  {t("emptyTitle")}
                </p>
                <p className="text-sm mt-1 max-w-[200px] mx-auto">
                  {t("emptyMessage")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#346853] text-white text-sm font-bold rounded-lg hover:bg-[#2a5443] transition-colors"
              >
                {t("startBrowsing")}
              </button>
            </div>
          ) : viewMode === "grouped" ? (
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 mb-4">{t("restaurants")}</h3>
              {Object.entries(groupedCart || {}).map(([id, group]) => (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Restaurant Header */}
                  <div className="p-4 flex items-center gap-3 border-b border-gray-50 bg-gray-50/30">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0 shadow-sm border border-white">
                      <Image
                        width={100}
                        height={100}
                        src={group.image || "/images/placeholder-thumb.jpg"}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">
                        {group.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                        {t("itemsCount", { count: group.items.length })}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="p-4 space-y-4 max-h-[220px] overflow-y-auto scrollbar-hide bg-white">
                    {(group.items || []).map((item) => (
                      <div key={item.cartId || item.id} className="flex gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          <Image
                            width={100}
                            height={100}
                            src={
                              item.imageUrl || "/images/placeholder-thumb.jpg"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h5 className="font-medium text-gray-900 text-xs line-clamp-1">
                            {item.quantity}x {item.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            {item.discount && (
                              <span className="text-gray-400 line-through text-[10px]">
                                {currency} {(item.originalPrice || 0).toFixed(2)}
                              </span>
                            )}
                            <p className="font-bold text-[#346853] text-xs">
                              {currency} {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View Cart Button */}
                  <div className="p-3 bg-gray-50/30 border-t border-gray-50">
                    <button
                      onClick={() => selectRestaurant(id)}
                      className="w-full bg-[#346853] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#2a5443] transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      {t("viewCartBtn")}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* ITEMS LIST */}
              <div className="space-y-6">
                {(currentItems || []).map((item) => (
                  <div key={item.cartId || item.id} className="flex gap-4">
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        width={250}
                        height={250}
                        src={item.imageUrl || "/images/placeholder-thumb.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1 pr-2">
                          {item.name}
                        </h4>
                        {item.selectedVariations &&
                          item.selectedVariations.length > 0 && (
                            <p className="text-xs text-gray-500 mb-1">
                              {(item.selectedVariations || [])
                                .map((v: any) => v.name)
                                .join(", ")}
                            </p>
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.discount && (
                          <span className="text-gray-400 line-through text-xs">
                            {currency} {(item.originalPrice || 0).toFixed(2)}
                          </span>
                        )}
                        <p className="font-bold text-[#346853] text-sm">
                          {currency} {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-center">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartId || item.id,
                            item.quantity - 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-4 text-center font-bold text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.cartId || item.id,
                            item.quantity + 1,
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#346853] text-white hover:bg-[#2a5443] transition-colors shadow-sm shadow-[#346853]/20"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {hasItems && viewMode === "detail" && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span>{t("subtotal")}</span>
                <span className="font-medium text-gray-900">
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <div className="flex items-center gap-1">
                  <span>{t("deliveryFee")}</span>
                  <Info size={12} className="text-gray-400" />
                </div>
                <span className="font-medium text-[#346853]">
                  {currency} {deliveryFee.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 flex justify-between items-center border-t border-gray-50 mt-3">
                <span className="font-bold text-base text-gray-900">{t("total")}</span>
                <span className="font-bold text-xl text-gray-900">
                  {currency} {total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#346853] text-white py-4 px-6 rounded-xl font-bold flex justify-between items-center hover:bg-[#2a5443] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#346853]/20"
            >
              <span>{t("goToCheckout")}</span>
              <span>
                {currency} {total.toFixed(2)}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
