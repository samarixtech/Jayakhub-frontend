"use client";
import {
  Home,
  Briefcase,
  Users,
  Pencil,
  Trash2,
  Plus,
  Bell,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import AddNewAddressModal from "./AddNewAddressModal";
import {
  getUserAddresses,
  deleteUserAddress,
} from "@/app/actions/customer/address";
import { toast } from "react-hot-toast";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { GlobalModal } from "@/components/common/GlobalModal";

interface Address {
  id: string;
  label: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  status: boolean;
  latitude: number | string;
  longitude: number | string;
  noteToCourier: string;
}

export default function CustomerAddressView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getUserAddresses();
      if (response && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const getIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("home"))
      return {
        icon: <Home className="h-5 w-5 text-emerald-600" />,
        bg: "bg-emerald-50",
      };
    if (lowerLabel.includes("work") || lowerLabel.includes("office"))
      return {
        icon: <Briefcase className="h-5 w-5 text-blue-600" />,
        bg: "bg-blue-50",
      };
    if (lowerLabel.includes("family") || lowerLabel.includes("parent"))
      return {
        icon: <Users className="h-5 w-5 text-purple-600" />,
        bg: "bg-purple-50",
      };
    return {
      icon: <MapPin className="h-5 w-5 text-gray-600" />,
      bg: "bg-gray-50",
    };
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    const toastId = toast.loading("Deleting address...");
    try {
      await deleteUserAddress(addressToDelete.id);
      await fetchAddresses();
      toast.success("Address deleted successfully", { id: toastId });
      setDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      toast.error("Failed to delete address", { id: toastId });
    }
  };

  // Pagination Data
  const paginatedAddresses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return addresses.slice(startIndex, startIndex + itemsPerPage);
  }, [addresses, currentPage]);

  const totalPages = Math.ceil(addresses.length / itemsPerPage);

  // Table Columns Configuration
  const columns: Column<Address>[] = [
    {
      header: "Type",
      cell: (address) => {
        const { icon, bg } = getIcon(address.label);
        return (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}
          >
            {icon}
          </div>
        );
      },
    },
    {
      header: "Label",
      cell: (address) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm">
            {address.label}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">{address.city}</span>
        </div>
      ),
    },
    {
      header: "Full Address",
      cell: (address) => {
        const fullAddress = `${address.streetAddress}, ${address.apartment ? address.apartment + ", " : ""}${address.city}, ${address.stateProvince} ${address.zipCode}`;
        return (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {fullAddress}
          </p>
        );
      },
    },
    {
      header: "Status",
      cell: (address) =>
        address.status && (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg">
            Active
          </Badge>
        ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (address) => (
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(address);
            }}
            className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(address);
            }}
            className="h-9 w-9 rounded-full text-red-300 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <Typography
              variant="h2"
              className="text-[#1F2937] font-black text-2xl tracking-tight"
            >
              Addresses
            </Typography>
            <Typography variant="p" className="text-gray-500 text-sm mt-1">
              Manage your delivery locations
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 bg-white"
            >
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              onClick={handleAddNew}
              className="rounded-full bg-emerald-bg hover:bg-emerald-bg text-white h-11 px-6 shadow-sm transition-all"
            >
              <Plus className="h-5 w-5" /> Add New
            </Button>
          </div>
        </header>

        {/* Address Table Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <GlobalTable
              data={paginatedAddresses}
              columns={columns}
              loading={loading}
              emptyMessage='No addresses found. Click "Add New" to create one.'
              paginationParams={{
                currentPage,
                totalPages,
                onPageChange: setCurrentPage,
              }}
            />
          </CardContent>
        </Card>

        {/* Add New Address Modal */}
        <AddNewAddressModal
          open={isAddModalOpen}
          onOpenChange={(open) => {
            setIsAddModalOpen(open);
            if (!open) {
              setEditingAddress(null); // Clear editing state on close
              fetchAddresses(); // Refresh list on close
            }
          }}
          addressToEdit={editingAddress}
        />

        {/* Delete Confirmation Modal */}
        <GlobalModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          title="Delete Address"
          description="Are you sure you want to delete this address? This action cannot be undone."
          trigger={<></>} // No external trigger needed as it's controlled by state
        >
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
}
