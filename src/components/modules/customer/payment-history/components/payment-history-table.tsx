import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { generateInvoicePDF } from "@/lib/utils/InvoicePDF";
import { useTranslations } from "next-intl";
import { formatOrderDateTime } from "@/lib/utils/date";
import { useCLC } from "@/context/CLCContext";

interface PaymentHistoryTableProps {
  orders: any[];
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
  startIndex: number;
  itemsPerPage: number;
  userEmail: string;
  userName: string;
}

export function PaymentHistoryTable({
  orders,
  loading,
  activeTab,
  setActiveTab,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  startIndex,
  itemsPerPage,
  userEmail,
  userName,
}: PaymentHistoryTableProps) {
  const t = useTranslations("CustomerDashboard.Billing");
  const { formatPrice, currency } = useCLC();
  const currentOrders = orders;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns: Column<any>[] = [
    {
      header: t("table_description"),
      headerClassName:
        "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[200px]",
      className: "py-4",
      cell: (order) => {
        const firstItem =
          order.items && order.items.length > 0 ? order.items[0] : null;
        let imageUrl = null;
        if (firstItem?.image) {
          imageUrl = firstItem.image.startsWith("http")
            ? firstItem.image
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${firstItem.image.replace(/\\/g, "/")}`;
        }

        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100">
                <Image
                  width={36}
                  height={36}
                  src={imageUrl}
                  alt={firstItem?.name || "Item"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-[#1E293B] text-[15px] line-clamp-1">
                {firstItem?.name || t("order_component")}
                {order.items?.length > 1 &&
                  ` +${order.items.length - 1} ${t("more")}`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: t("table_date"),
      headerClassName:
        "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[150px]",
      cell: (order) => (
        <span className="text-[15px] font-medium text-[#64748B]">
          {formatOrderDateTime(order.orderDate, order.orderTime)}
        </span>
      ),
    },
    {
      header: t("table_method"),
      headerClassName:
        "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[120px]",
      cell: (order) => {
        const method =
          order.paymentMethod?.toLowerCase() === "card"
            ? t("visa")
            : order.paymentMethod?.toLowerCase() === "cod"
              ? t("cash")
              : order.paymentMethod;
        const details =
          order.paymentDetails?.cardNumber &&
          order.paymentDetails?.cardNumber !== "N/A"
            ? ` •• ${order.paymentDetails.cardNumber.slice(-4)}`
            : "";

        return (
          <span className="text-[15px] font-medium text-[#4B5563]">
            {method}
            {details}
          </span>
        );
      },
    },
    {
      header: t("table_amount"),
      headerClassName:
        "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[100px]",
      cell: (order) => {
        const isRefund = order.status === "refunded";
        return (
          <span
            className={`text-[15px] font-black ${isRefund ? "text-[#10b981]" : "text-[#1E293B]"}`}
          >
            {isRefund ? "+" : ""}
            {formatPrice(order.totalAmount || 0)}
          </span>
        );
      },
    },
    {
      header: t("table_receipt"),
      headerClassName:
        "text-[10px] font-bold tracking-wider text-[#64748B] uppercase text-right w-[80px]",
      className: "text-right",
      cell: (order) =>
        order.status !== "refunded" && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              generateInvoicePDF(order, userEmail, userName, currency);
            }}
            className="h-[26px] px-3 rounded-md border border-gray-200 text-[#1E293B] font-bold text-[10px] hover:bg-gray-50 flex items-center justify-center ml-auto shadow-sm"
          >
            <span>{t("pdf")}</span>
          </Button>
        ),
    },
  ];

  return (
    <Card className="rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-100 pt-6 pb-6 px-8 flex flex-row items-center justify-between">
        <CardTitle className="text-[16px] font-bold text-[#1E293B]">
          {t("transactions")}
        </CardTitle>
        <div className="flex items-center gap-2">
          {["All", "Cards", "Cash"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-sm ${
                activeTab === tab
                  ? "bg-[#f0fdf4] text-[#10b981] border border-[#10b981]"
                  : "text-[#6B7280] bg-white hover:text-[#374151] border border-gray-100"
              }`}
            >
              {tab === "All"
                ? t("all")
                : tab === "Cards"
                  ? t("cards")
                  : t("cash")}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative pb-16 overflow-x-auto w-full">
        <div className="min-w-[600px]">
          <GlobalTable
            data={currentOrders}
            columns={columns}
            loading={loading}
            emptyMessage={t("no_transactions")}
            rowClassName={(order) =>
              order.status === "refunded" ? "bg-[#f0fdf4]" : ""
            }
          />
        </div>

        {/* pagination */}
        {!loading && orders.length > 0 && (
          <div className="absolute bottom-5 left-8 right-8 flex flex-col sm:flex-row sm:items-center justify-between pointer-events-none gap-4">
            <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
              {t("showing")} {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, totalCount)} {t("of")}{" "}
              {totalCount}
            </span>

            {totalPages > 1 && (
              <div className="pointer-events-auto">
                <GlobalPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
