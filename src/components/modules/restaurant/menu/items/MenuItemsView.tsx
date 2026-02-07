"use client";
import {
  Search,
  Plus,
  Utensils,
  CheckCircle,
  PauseCircle,
  Shapes,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { Typography } from "@/components/ui/typography";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getMenuItemsAction,
  getAllCategoriesAction,
  deleteMenuItemAction,
} from "@/app/actions/restaurant/menu";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Data for stats
const STATS = [
  {
    label: "Total Items",
    value: "0",
    icon: Utensils,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Active",
    value: "0",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    label: "Inactive",
    value: "0",
    icon: PauseCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    label: "Categories",
    value: "0",
    icon: Shapes,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

export default function MenuItemsView() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { execute: fetchCategories } = useServerAction(getAllCategoriesAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      const categoriesData = data && data.data ? data.data : data;
      if (Array.isArray(categoriesData)) {
        const categoryNames = categoriesData
          .map((cat: any) => cat.categoryName || cat.name)
          .filter(Boolean);
        setCategories(categoryNames);
      }
    },
  });

  const { execute: fetchMenu, isPending } = useServerAction(
    getMenuItemsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data) => {
        if (data && Array.isArray(data)) {
          setItems(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      },
    },
  );

  const { execute: deleteItem, isPending: isDeleting } = useServerAction(
    deleteMenuItemAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchMenu(); // Refresh list
      },
      onError: (err) => toast.error(err || "Failed to delete item"),
    },
  );

  const confirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  console.log("items", items);

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Items" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dynamic Filters
  const dynamicFilters = [
    { label: "All Items", count: items.length },
    ...categories.map((cat) => ({
      label: cat,
      count: items.filter((i) => i.category === cat).length,
    })),
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <LocalizedLink href="/restaurant/menu/items/new">
          <Button className="bg-emerald-bg hover:bg-emerald-bg-hover text-white gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Item
          </Button>
        </LocalizedLink>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <Card
            key={idx}
            className="p-4 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 border-none shadow-sm h-full"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgColor}`}
            >
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
            <div className="flex flex-col items-center sm:items-start justify-center min-w-0 w-full sm:w-auto">
              <Typography
                variant="h3"
                className="font-bold text-gray-900 text-xl sm:text-2xl leading-none mb-1 text-center sm:text-left"
              >
                {/* Simple stat calculation based on loaded items for now */}
                {stat.label === "Total Items"
                  ? items.length
                  : stat.label === "Active"
                    ? items.filter((i) => i.isAvailable).length
                    : stat.label === "Inactive"
                      ? items.filter((i) => !i.isAvailable).length
                      : stat.value}
              </Typography>
              <Typography
                variant="p"
                className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide truncate text-center sm:text-left w-full"
              >
                {stat.label}
              </Typography>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input - Full width on mobile */}
        <div className="relative w-full sm:w-[250px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 h-10 shadow-sm rounded-lg w-full"
          />
        </div>

        {/* Filter Badges - Wrapping on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          {dynamicFilters.map((filter) => (
            <Badge
              key={filter.label}
              variant={
                selectedCategory === filter.label ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(filter.label)}
              className={`h-9 px-4 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                selectedCategory === filter.label
                  ? "bg-emerald-bg hover:bg-emerald-bg-hover text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 text-xs opacity-80 ${
                  selectedCategory === filter.label
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-semibold text-gray-500 text-xs uppercase w-[300px]">
                  Item
                </TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase text-center">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                // Skeleton Loader
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-48 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-6 w-20 bg-gray-100 rounded-md mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-5 w-12 bg-gray-100 rounded ml-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 w-10 bg-gray-200 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                        <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-500"
                  >
                    No items found. Click "Add New Item" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const rawImage = item.itemImage || item.image;
                  const imageUrl = rawImage
                    ? rawImage.startsWith("http")
                      ? rawImage
                      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${rawImage}`
                    : null;
                  console.log("Image Debug:", {
                    original: rawImage,
                    constructed: imageUrl,
                    baseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
                  });

                  return (
                    <TableRow
                      key={item.id || item._id}
                      className="border-gray-50 hover:bg-gray-50/50 group"
                    >
                      {/* Item Column */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {imageUrl ? (
                              <img
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
                              {item.name}
                            </Typography>
                            <Typography className="text-gray-400 text-xs line-clamp-1">
                              {item.description}
                            </Typography>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Column */}
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="font-semibold rounded-md border text-[10px] px-2 py-0.5 shadow-none uppercase bg-white border-gray-200 text-gray-700"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>

                      {/* Price Column */}
                      <TableCell className="text-right font-medium text-gray-700 font-mono">
                        ${item.basePrice}
                      </TableCell>

                      {/* Status Column */}
                      <TableCell className="text-center">
                        <Switch
                          checked={item.isAvailable}
                          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200"
                        />
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <LocalizedLink
                            href={`/restaurant/menu/items/${item.id || item._id}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </LocalizedLink>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item.id || item._id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
