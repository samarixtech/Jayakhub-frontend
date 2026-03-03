"use client";
import OrdersStats from "../components/OrdersStats";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";
import OrderDetailsSheet from "../components/OrderDetailsSheet";
import { useOrders } from "../hooks/useOrders";

const OrdersView = () => {
  const {
    stats,
    loading,
    activeTab,
    setActiveTab,
    selectedOrder,
    isSheetOpen,
    setIsSheetOpen,
    currentPage,
    setCurrentPage,
    paginatedOrders,
    totalPages,
    handleStatusUpdate,
    handleOrderClick,
    liveOrdersCount,
    pastOrdersCount,
    filteredOrders,
  } = useOrders();

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <OrdersStats stats={stats} loading={loading} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <OrdersFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onPageReset={() => setCurrentPage(1)}
          liveOrdersCount={liveOrdersCount}
          pastOrdersCount={pastOrdersCount}
          filteredOrdersCount={filteredOrders.length}
        />

        <div className="p-0">
          <OrdersTable
            data={paginatedOrders}
            onViewOrder={handleOrderClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>
      </div>

      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default OrdersView;
