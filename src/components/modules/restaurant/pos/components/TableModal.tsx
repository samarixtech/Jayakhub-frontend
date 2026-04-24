"use client";
import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlobalModal } from "@/components/common/GlobalModal";
import { CircleCheck } from "lucide-react";
import { getTablesAction } from "@/app/actions/restaurant/tables";
import { getTableStatusesFromDB, saveTableStatusToDB } from "@/lib/indexedDB";
import toast from "react-hot-toast";
import { usePOS } from "@/context/POSContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface TableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface CombinedTable {
  id: string;
  originalId: string;
  name: string;
  seats: number;
  status: string;
  details: string;
}

export default function TableModal({ open, onOpenChange }: TableModalProps) {
  const { setSelectedTable } = usePOS();
  const pendingOrders = useSelector(
    (state: RootState) => state.cart.pendingOrders,
  );
  const [tables, setTables] = useState<CombinedTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTablesAndStatus();
    }
  }, [open]);

  const fetchTablesAndStatus = async () => {
    setIsLoading(true);
    try {
      const [apiRes, dbStatuses] = await Promise.all([
        getTablesAction(),
        getTableStatusesFromDB(),
      ]);

      if (apiRes.success && apiRes.data) {
        const apiTables = apiRes.data;
        const normalized: CombinedTable[] = apiTables.map((t: any) => {
          const dbStatus = dbStatuses.find((s) => s.id === t.id);

          let status = "Available";
          if (dbStatus) {
            status = dbStatus.status;
          } else if (
            t.status &&
            t.status !== "Available" &&
            t.status !== "available" &&
            t.status !== 1
          ) {
            status = "Pay Pending";
          }

          return {
            id: t.name || t.id,
            originalId: t.id,
            name: t.name || t.id,
            seats: t.seats || t.capacity || 0,
            status: status,
            details:
              status === "Pay Pending"
                ? "Pay Pending"
                : `${t.seats || t.capacity || 0} Seats`,
          };
        });
        setTables(normalized);
      } else {
        toast.error("Failed to load tables");
      }
    } catch (error) {
      toast.error("An error occurred loading tables");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableClick = async (table: CombinedTable) => {
    if (table.status === "Available" || table.status === "Pay Pending") {
      const newStatus = "Selected";

      // Update local state for immediate UI feedback
      setTables((prev) =>
        prev.map((t) => {
          if (t.originalId === table.originalId) {
            return { ...t, status: newStatus };
          }
          if (t.status === "Selected") {
            return { ...t, status: "Available" };
          }
          return t;
        }),
      );

      // Persist selection to DB
      try {
        const currentStatuses = (await getTableStatusesFromDB()) || [];
        const promises = currentStatuses
          .filter((s) => s.status === "Selected")
          .map((s) => saveTableStatusToDB({ id: s.id, status: "Available" }));
        await Promise.all(promises);

        // Save new selection
        await saveTableStatusToDB({
          id: table.originalId,
          status: newStatus,
        });

        // Update Global Context
        setSelectedTable({
          id: table.originalId,
          name: table.name,
          status: newStatus,
        });

        toast.success(`Table ${table.name} selected`);
        // Close modal after selection
        onOpenChange(false);
      } catch (err) {
        console.error("Failed to save table status", err);
        toast.error("Failed to save table selection");
      }
    } else {
      toast.error(
        `Table ${table.name} is ${table.status} and cannot be selected`,
      );
    }
  };

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle
      className="sm:max-w-[720px] p-0 flex flex-col gap-0 overflow-hidden bg-white border-none shadow-xl rounded-[16px] text-left"
    >
      <DialogHeader className="px-6 py-[18px] border-b border-gray-100 flex flex-row items-center justify-between text-left">
        <DialogTitle className="text-[20px] font-black tracking-tight text-[#111827]">
          Select Table
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col flex-1 p-6">
        {/* Legend */}
        <div className="flex items-center gap-[18px] mb-[30px]">
          <div className="flex items-center gap-[6px]">
            <div className="w-[18px] h-[12px] rounded-[4px] bg-[#9df3c4]"></div>
            <span className="text-[14px] font-extrabold text-[#3e5648]">
              Available
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="w-[18px] h-[12px] rounded-[4px] bg-[#ffadad]"></div>
            <span className="text-[14px] font-extrabold text-[#3e5648]">
              Occupied
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <div className="w-[18px] h-[12px] rounded-[4px] bg-[#ffd066]"></div>
            <span className="text-[14px] font-extrabold text-[#3e5648]">
              Pay Pending
            </span>
          </div>
        </div>

        {/* Table Grid */}
        {isLoading ? (
          <div className="grid grid-cols-4 gap-[20px] min-h-[200px] max-h-[400px] overflow-y-auto pr-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center justify-center h-[130px] rounded-[16px] border border-gray-100 bg-gray-50/50 animate-pulse"
              >
                <div className="h-6 w-12 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="flex flex-1 items-center justify-center min-h-[200px] text-gray-400 font-medium">
            No tables found
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-[20px] min-h-[200px] max-h-[400px] overflow-y-auto pr-2">
            {tables.map((table) => {
              const isPending = pendingOrders.some(
                (order) => order.tableName === table.name,
              );
              const displayStatus = isPending ? "Pay Pending" : table.status;
              const displayDetails = isPending ? "Pay Pending" : table.details;

              let bgClass = "";
              let borderClass = "";
              let titleClass = "";
              let detailsClass = "";

              if (displayStatus === "Pay Pending") {
                bgClass = "bg-[#fffcf7]";
                borderClass = "border-[#ffd98a]";
                titleClass = "text-[#cc7c50]";
                detailsClass = "text-[#cc7c50] font-[800]";
              } else if (displayStatus === "Selected") {
                bgClass = "bg-[#357252]";
                borderClass = "border-transparent";
                titleClass = "text-white";
                detailsClass = "text-[#759885] font-[800]";
              } else if (displayStatus === "Occupied") {
                bgClass = "bg-[#fff5f5]";
                borderClass = "border-[#ffadad]";
                titleClass = "text-[#d65555]";
                detailsClass = "text-[#d65555] font-[800]";
              } else {
                // Available
                bgClass = "bg-[#f5fdf7]";
                borderClass = "border-[#bbf4d4]";
                titleClass = "text-[#1b2d22]";
                detailsClass = "text-[#8ea89a] font-[800]";
              }

              return (
                <button
                  key={table.originalId}
                  onClick={() => handleTableClick(table)}
                  className={`relative flex flex-col items-center justify-center h-[130px] rounded-[16px] border ${bgClass} ${borderClass} transition-colors hover:opacity-90`}
                >
                  {displayStatus === "Selected" && (
                    <div className="absolute top-[10px] right-[10px]">
                      <CircleCheck className="w-[16px] h-[16px] text-white stroke-[2px]" />
                    </div>
                  )}
                  <span
                    className={`text-[24px] font-black tracking-tight leading-none mb-[8px] ${titleClass}`}
                  >
                    {table.name}
                  </span>
                  <span className={`text-[13px] ${detailsClass}`}>
                    {displayDetails}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </GlobalModal>
  );
}
