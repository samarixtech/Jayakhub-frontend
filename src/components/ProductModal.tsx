"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Minus, X, Check, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

interface ProductModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const { currency } = useCLC();
  const t = useTranslations("Cart");

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedVariations([]);
      setSpecialInstructions("");
      calculateTotal(1, []);
    }
  }, [item]);

  const calculateTotal = (qty: number, vars: any[]) => {
    if (!item) return;
    const discountAmount = item.discount ? parseFloat(item.discount) : 0;
    const basePrice = item.price || item.basePrice || 0;
    const varsPrice = vars.reduce(
      (acc, v) => acc + (v.price || v.additionalPrice || 0),
      0,
    );
    const unitPrice = Math.max(0, basePrice + varsPrice - discountAmount);
    setTotalPrice(unitPrice * qty);
  };

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    calculateTotal(newQty, selectedVariations);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      calculateTotal(newQty, selectedVariations);
    }
  };

  const toggleVariation = (variation: any) => {
    const exists = selectedVariations.find(
      (v) => v.name === variation.name && v.groupName === variation.groupName,
    );
    let newVars;
    if (exists) {
      newVars = selectedVariations.filter(
        (v) =>
          !(v.name === variation.name && v.groupName === variation.groupName),
      );
    } else {
      newVars = selectedVariations.filter(
        (v) => v.groupName !== variation.groupName,
      );
      newVars = [...newVars, variation];
    }
    setSelectedVariations(newVars);
    calculateTotal(quantity, newVars);
  };

  const handleAddToCartClick = () => {
    const unitPrice =
      (item.price || item.basePrice || 0) +
      selectedVariations.reduce(
        (acc, v) => acc + (v.price || v.additionalPrice || 0),
        0,
      );

    onAddToCart({
      ...item,
      quantity,
      selectedVariations,
      specialInstructions,
      price: unitPrice,
      totalPrice,
    });
  };

  if (!item) return null;

  const itemImage = item.imageUrl || item.image;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full sm:max-w-[440px] max-h-[85vh] sm:max-h-[88vh] flex flex-col p-0 overflow-hidden gap-0 border-0 rounded-2xl shadow-2xl"
      >
        <div className="sr-only">
          <DialogTitle>{item.name}</DialogTitle>
        </div>

        {/* Header Image */}
        <div className="relative h-44 sm:h-48 w-full bg-gray-100 flex items-center justify-center p-4 shrink-0 border-b border-gray-100">
          {itemImage ? (
            <Image
              width={300}
              height={300}
              src={itemImage}
              alt={item.name}
              className="max-h-full max-w-full h-auto w-auto object-contain mx-auto"
            />
          ) : item.itemImages && item.itemImages.length > 0 ? (
            <div className="flex items-center justify-center gap-3">
              {item.itemImages.slice(0, 3).map((imgUrl: string, idx: number) => (
                <div key={idx} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-gray-50">
                  <Image src={imgUrl} alt={item.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <UtensilsCrossed className="w-14 h-14 text-gray-300" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-thumb-gray-200">
          {/* Title & Description */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {item.name}
            </h2>
            <div className="flex flex-col items-end shrink-0">
              {item.discount && parseFloat(item.discount) > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-400 line-through">
                    {currency}
                    {(item.price || item.basePrice || 0).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">
                    -{currency} {parseFloat(item.discount).toFixed(0)}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold text-primary">
                {currency}
                {Math.max(
                  0,
                  (item.price || item.basePrice || 0) -
                    (item.discount ? parseFloat(item.discount) : 0),
                ).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Included Items Section for Deals */}
          {((item.dealItems && item.dealItems.length > 0) || (item.dealData?.items && item.dealData.items.length > 0)) && (() => {
            const list = item.dealItems || (item.dealData?.items || []).map((di: any) => ({
              id: di.itemId || di.id,
              name: di.item?.name || di.name || "Item",
              image: di.item?.image || di.image || "",
              basePrice: Number(di.item?.basePrice || di.basePrice || 0),
              description: di.item?.description || di.description || "",
            }));

            return (
              <div className="mb-6 bg-orange-50/70 border border-orange-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
                    Items Included in this Deal
                  </h3>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    {list.length} Items
                  </span>
                </div>

                <div className="space-y-2.5">
                  {list.map((dealItem: any, index: number) => (
                    <div
                      key={dealItem.id || index}
                      className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border border-gray-100">
                        {dealItem.image ? (
                          <Image
                            src={dealItem.image}
                            alt={dealItem.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <UtensilsCrossed className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 truncate">
                          {dealItem.name}
                        </h4>
                        {dealItem.description && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {dealItem.description}
                          </p>
                        )}
                      </div>
                      {dealItem.basePrice > 0 && (
                        <span className="text-xs font-semibold text-gray-500 shrink-0">
                          {currency} {dealItem.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Add Extra Section */}
          {item.variantGroups && item.variantGroups.length > 0 && (
            <div className="mb-8 space-y-6">
              {(item.variantGroups || []).map(
                (group: any, groupIndex: number) => (
                  <div key={group.id || groupIndex}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">
                        {group.groupName}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {t("optional")}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {(group.variants || []).map(
                        (variation: any, index: number) => {
                          const isSelected = !!selectedVariations.find(
                            (v) =>
                              v.name === variation.name &&
                              v.groupName === group.groupName,
                          );

                          // Ensure price exists even if 0
                          const price =
                            variation.price || variation.additionalPrice || 0;

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between cursor-pointer group"
                              onClick={() =>
                                toggleVariation({
                                  ...variation,
                                  groupName: group.groupName,
                                  groupId: group.id || group._id,
                                })
                              }
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? "bg-primary border-primary"
                                      : "border-gray-300 group-hover:border-primary"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check
                                      size={12}
                                      className="text-white"
                                      strokeWidth={3}
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-base ${isSelected ? "text-gray-900 font-medium" : "text-gray-700"}`}
                                >
                                  {variation.name}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {currency}
                                {price.toFixed(2)}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Special Instructions (Hidden for Deals) */}
          {!item.isDeal && !(item.dealItems && item.dealItems.length > 0) && !item.dealData && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">
                {t("specialInstructions")}
              </h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder={t("specialInstructionsPlaceholder")}
                className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none bg-gray-50/50"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 drop-shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center bg-[#F3F4F6] rounded-lg h-12 px-2 shrink-0">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-full flex items-center justify-center text-gray-600 disabled:opacity-40 hover:text-black transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-8 h-full flex items-center justify-center text-gray-600 hover:text-black transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCartClick}
              className="flex-1 h-12 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-between px-6 hover:bg-[#e85a2a] transition-colors active:scale-[0.98]"
            >
              <span className="hidden sm:block">{t("addToCart")}</span>
              <span>
                {currency}
                {totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
