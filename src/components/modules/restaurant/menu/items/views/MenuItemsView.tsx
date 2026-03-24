"use client";
import { useTranslations } from "next-intl";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import GlobalTable from "@/components/common/GlobalTable";
import { AddItemModal } from "../components/AddItemModal";
import Image from "next/image";
import Link from "next/link";
import { useMenuItems } from "../hooks/useMenuItems";
import { MenuItemsStats } from "../components/MenuItemsStats";
import { MenuItemsFilters } from "../components/MenuItemsFilters";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { useCLC } from "@/context/CLCContext";

export default function MenuItemsView() {
  const { formatPrice } = useCLC();

  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    deleteId,
    setDeleteId,
    isAddModalOpen,
    setIsAddModalOpen,
    isPending,
    isDeleting,
    isUpdatingStatus,
    fetchMenu,
    confirmDelete,
    toggleStatus,
    filteredItems,
    dynamicFilters,
    stats,
    page,
    totalPages,
    handlePageChange,
  } = useMenuItems();

  const t = useTranslations("RestaurantDashboard.Menu.Items.views");

  const columns = [
    {
      header: t("columns.item"),
      accessorKey: "name",
      cell: (item: any) => {
        const rawImage = item.itemImage || item.image;
        const imageUrl = rawImage
          ? rawImage.startsWith("http")
            ? rawImage
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${rawImage}`
          : null;
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  width={200}
                  height={200}
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <Typography className="font-medium text-gray-900">
                {item.name || "N/A"}
              </Typography>
              <Typography className="text-gray-400 text-xs line-clamp-1">
                {item.description || "N/A"}
              </Typography>
            </div>
          </div>
        );
      },
    },
    {
      header: t("columns.category"),
      accessorKey: "category",
      cell: (item: any) => (
        <div className="text-left">
          <Badge
            variant="outline"
            className="font-semibold rounded-md border text-[10px] px-2 py-0.5 shadow-none uppercase bg-white border-gray-200 text-gray-700"
          >
            {item.category || "N/A"}
          </Badge>
        </div>
      ),
    },
    {
      header: t("columns.price"),
      accessorKey: "basePrice",
      cell: (item: any) => (
        <div className="text-left font-medium text-gray-700 font-mono">
          {formatPrice(item.basePrice) || "N/A"}
        </div>
      ),
    },
    {
      header: t("columns.status"),
      accessorKey: "isAvailable",
      cell: (item: any) => (
        <div className="text-left">
          <Switch
            checked={item.isAvailable}
            disabled={isUpdatingStatus}
            onCheckedChange={() =>
              toggleStatus(item.id || item._id, item.isAvailable)
            }
            className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200 cursor-pointer data-[state=checked]:hover:bg-emerald-600 data-[state=unchecked]:hover:bg-gray-300"
          />
        </div>
      ),
    },
    {
      header: t("columns.actions"),
      cell: (item: any) => (
        <div className="flex items-center justify-start gap-2">
          <Link href={`/restaurant/menu/items/${item.id || item._id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(item.id || item._id)}
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-bg hover:bg-emerald-bg-hover text-white gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t("addNewTitle")}
        </Button>
      </div>

      <MenuItemsStats stats={stats} />

      <MenuItemsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={dynamicFilters}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Card className="border-none shadow-sm overflow-hidden bg-white p-4">
        <GlobalTable
          data={filteredItems}
          columns={columns}
          loading={isPending}
          emptyMessage={t("noItems")}
        />
        <div className="mt-4">
          <GlobalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>

      <DeleteConfirmationModal
        open={!!deleteId}
        onOpenChange={(open: boolean) => !open && setDeleteId(null)}
        title={t("deleteTitle")}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <AddItemModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onImportSuccess={fetchMenu}
      />
    </div>
  );
}
