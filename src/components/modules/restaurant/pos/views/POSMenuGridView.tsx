"use client";
import Image from "next/image";
import { usePOS } from "@/context/POSContext";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import toast from "react-hot-toast";

export default function POSMenuGrid() {
  const { posItems, isPosLoading, setIsCartOpen, selectedTable } = usePOS();
  const dispatch = useDispatch<AppDispatch>();
  const { orderType, pendingOrders } = useSelector(
    (state: RootState) => state.cart,
  );

  if (isPosLoading) {
    return (
      <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 overflow-y-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[10px] overflow-hidden flex flex-col h-[150px]"
            >
              <Skeleton className="h-[90px] md:h-[100px] w-full rounded-none" />
              <div className="p-2 sm:p-2.5 flex flex-col gap-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posItems || posItems.length === 0) {
    return (
      <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 flex flex-col items-center justify-center w-full text-gray-400">
        <p className="text-sm font-medium">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 overflow-y-auto w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
        {posItems.map((item) => {
          const imageUrl = item.image?.startsWith("http")
            ? item.image
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.image?.replace(/\\/g, "/")}`;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (orderType === "Dine-In") {
                  if (!selectedTable) {
                    toast.error("Please select a table before adding items.");
                    setIsCartOpen(true);
                    return;
                  }

                  // Check if the current table is already pending an order
                  const isTablePending = pendingOrders.some(
                    (order) => order.tableName === selectedTable.name,
                  );

                  if (isTablePending) {
                    toast.error(
                      `Table ${selectedTable.name} already has a pending order.`,
                    );
                    return;
                  }

                  // Check if the table is fundamentally unavailable
                  if (
                    selectedTable.status === "Pay Pending" ||
                    selectedTable.status === "Occupied"
                  ) {
                    toast.error(
                      `Table ${selectedTable.name} is not available.`,
                    );
                    return;
                  }
                }

                dispatch(
                  addToCart({
                    id: item.id,
                    name: item.name,
                    description: item.description || "",
                    price: item.basePrice,
                    quantity: 1,
                    image: imageUrl,
                    variations: item.variations || [],
                    cashierItemId: item.id,
                    tableName: selectedTable?.name || "Table",
                    orderType: orderType,
                    paymentMethod: "Cash",
                  }),
                );
                // Auto-open cart on mobile when an item is added
                if (window.innerWidth < 1024) {
                  setIsCartOpen(true);
                }
              }}
              className="group bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden cursor-pointer flex flex-col hover:shadow-md hover:border-[#357252]/30 transition-all active:scale-95 duration-200 relative"
            >
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-[#357252] shadow-sm">
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              </div>

              <div className="h-[90px] md:h-[100px] w-full relative bg-gray-100 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="p-2 sm:p-2.5 flex flex-col gap-1">
                <h3 className="text-[11px] sm:text-[12px] font-extrabold text-[#333] leading-snug truncate group-hover:text-[#357252] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[#357252] font-black text-[11px] sm:text-[12px]">
                  ${Number(item.basePrice).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
