"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X, Check } from "lucide-react";
import Image from "next/image";

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
    const basePrice = item.price || item.basePrice || 0;
    const varsPrice = vars.reduce(
      (acc, v) => acc + (v.additionalPrice || 0),
      0,
    );
    setTotalPrice((basePrice + varsPrice) * qty);
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
    const exists = selectedVariations.find((v) => v.name === variation.name);
    let newVars;
    if (exists) {
      newVars = selectedVariations.filter((v) => v.name !== variation.name);
    } else {
      newVars = [...selectedVariations, variation];
    }
    setSelectedVariations(newVars);
    calculateTotal(quantity, newVars);
  };

  const handleAddToCartClick = () => {
    const unitPrice =
      (item.price || item.basePrice || 0) +
      selectedVariations.reduce((acc, v) => acc + (v.additionalPrice || 0), 0);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0 border-0 rounded-2xl">
        <div className="sr-only">
          <DialogTitle>{item.name}</DialogTitle>
        </div>

        {/* Header Image */}
        <div className="relative h-48 w-full">
          <Image
            width={200}
            height={200}
            src={item.imageUrl || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-thumb-gray-200">
          {/* Title & Description */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {item.name}
            </h2>
            <span className="text-xl font-bold text-[#346853]">
              ${(item.price || item.basePrice || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Add Extra Section */}
          {item.variations && item.variations.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Add Extra</h3>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  Optional
                </span>
              </div>
              <div className="space-y-3">
                {item.variations.map((variation: any, index: number) => {
                  const isSelected = !!selectedVariations.find(
                    (v) => v.name === variation.name,
                  );

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleVariation(variation)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded border transition-colors flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#346853] border-[#346853]"
                              : "border-gray-300 group-hover:border-[#346853]"
                          }`}
                        >
                          {isSelected && (
                            <Check
                              size={14}
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
                        + ${variation.additionalPrice.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">
              Special Instructions
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="E.g. No onions, please"
              className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853] resize-none bg-gray-50/50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white drop-shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
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
              className="flex-1 h-12 bg-[#346853] text-white rounded-lg font-bold text-sm flex items-center justify-between px-6 hover:bg-[#2a5443] transition-colors active:scale-[0.98]"
            >
              <span className="hidden sm:block">Add to Cart</span>
              <span>${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
