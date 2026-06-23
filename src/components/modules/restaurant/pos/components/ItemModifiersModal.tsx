"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { usePOS } from "@/context/POSContext";
import { useCLC } from "@/context/CLCContext";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateItemVariations } from "@/redux/slices/cartSlice";
import { RootState, AppDispatch } from "@/redux/store/store";
import { getItemVariantsAction } from "@/app/actions/restaurant/pos";
import { Loader2 } from "lucide-react";

interface ItemModifiersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VariantOption {
  name: string;
  price: number;
}

interface VariantGroup {
  id: string;
  groupName: string;
  options: VariantOption[];
}

// groupId → optionName
type SelectionMap = Record<string, string>;

export default function ItemModifiersModal({
  open,
  onOpenChange,
}: ItemModifiersModalProps) {
  const { activeModifierItemId } = usePOS();
  const { formatPrice } = useCLC();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const activeItem = cartItems.find(
    (i) => (i.cartId || i.id) === activeModifierItemId,
  );

  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<SelectionMap>({});

  useEffect(() => {
    if (!open || !activeItem) return;

    // Pre-populate from already-saved selections
    const saved: SelectionMap = {};
    const savedVariations: any[] = activeItem.selectedVariations || [];
    savedVariations.forEach((v: any) => {
      if (v.variantGroupId && v.name) saved[v.variantGroupId] = v.name;
    });
    setSelected(saved);

    const itemId = activeItem.cashierItemId || activeItem.id;
    setIsLoading(true);
    setVariants([]);

    getItemVariantsAction(String(itemId))
      .then((res) => {
        if (res.success && res.data?.variants) {
          setVariants(res.data.variants);
        }
      })
      .finally(() => setIsLoading(false));
  }, [open, activeModifierItemId]);

  const toggle = (groupId: string, optionName: string) => {
    setSelected((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === optionName ? "" : optionName,
    }));
  };

  const handleSave = () => {
    if (activeModifierItemId) {
      const selections: any[] = [];
      variants.forEach((group) => {
        const chosenName = selected[group.id];
        if (!chosenName) return;
        const option = group.options.find((o) => o.name === chosenName);
        if (option) {
          selections.push({
            variantGroupId: group.id,
            name: option.name,
            additionalPrice: option.price,
          });
        }
      });

      dispatch(
        updateItemVariations({
          id: activeModifierItemId.toString(),
          variations: selections,
        }),
      );
    }
    onOpenChange(false);
  };

  if (!activeItem) return null;

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="max-w-[450px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl text-left"
    >
      <DialogHeader className="px-5 py-5 border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[20px] font-black tracking-[-0.01em] text-[#111827]">
          {activeItem.name} — Variants
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 mb-6">
            <Loader2 className="w-6 h-6 animate-spin text-[#1eb589]" />
          </div>
        ) : variants.length > 0 ? (
          <div className="space-y-5 mb-6">
            {variants.map((group) => (
              <div key={group.id}>
                <p className="text-[11px] font-bold text-[#8ea89a] uppercase tracking-wider mb-2">
                  {group.groupName}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {group.options.map((option, i) => {
                    const isSelected = selected[group.id] === option.name;
                    return (
                      <button
                        key={i}
                        onClick={() => toggle(group.id, option.name)}
                        className={`flex flex-col items-center justify-center h-[76px] p-2 text-center border rounded-[8px] transition-colors ${
                          isSelected
                            ? "border-[#1eb589] bg-emerald-50/60 ring-1 ring-[#1eb589]"
                            : "border-gray-200 hover:border-[#1eb589] hover:bg-emerald-50/30"
                        }`}
                      >
                        <span className="text-[14px] font-semibold text-[#111827] capitalize">
                          {option.name}
                        </span>
                        {option.price > 0 && (
                          <span className="text-[13px] font-medium text-[#1eb589] mt-0.5">
                            +{formatPrice(option.price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 mb-6">
            <p className="text-gray-400 font-medium text-[14px]">
              No variants available for this item.
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-[#1eb589] hover:bg-[#159a72] text-white font-bold py-3.5 rounded-[8px] text-[16px] transition-colors"
        >
          Save
        </button>
      </div>
    </GlobalModal>
  );
}
