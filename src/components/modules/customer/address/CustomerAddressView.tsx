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
import { useState, useEffect } from "react";
import AddNewAddressModal from "./AddNewAddressModal";
import {
  getUserAddresses,
  deleteUserAddress,
} from "@/app/actions/customer/address";
import { toast } from "react-hot-toast";

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <Typography
              variant="h2"
              className="text-[#1F2937] font-bold text-2xl tracking-tight"
            >
              My Addresses
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Type
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Label
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Full Address
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    // Skeleton Loader Rows
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                        </td>
                        <td className="px-8 py-6">
                          <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-16" />
                        </td>
                        <td className="px-8 py-6">
                          <div className="h-4 bg-gray-100 rounded w-48" />
                        </td>
                        <td className="px-8 py-6">
                          <div className="h-6 bg-gray-100 rounded w-16" />
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-3">
                            <div className="h-9 w-9 bg-gray-100 rounded-full" />
                            <div className="h-9 w-9 bg-gray-100 rounded-full" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : addresses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-8 py-10 text-center text-gray-500"
                      >
                        No addresses found. Click "Add New" to create one.
                      </td>
                    </tr>
                  ) : (
                    addresses.map((address) => {
                      const { icon, bg } = getIcon(address.label);
                      const fullAddress = `${address.streetAddress}, ${address.apartment ? address.apartment + ", " : ""}${address.city}, ${address.stateProvince} ${address.zipCode}`;

                      return (
                        <tr
                          key={address.id}
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Type Icon */}
                          <td className="px-8 py-6">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}
                            >
                              {icon}
                            </div>
                          </td>

                          {/* Label */}
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-sm">
                                {address.label}
                              </span>
                              <span className="text-xs text-gray-400 mt-0.5">
                                {address.city}
                              </span>
                            </div>
                          </td>

                          {/* Full Address */}
                          <td className="px-8 py-6">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              {fullAddress}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-8 py-6">
                            {address.status && (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                Active
                              </Badge>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(address)}
                                className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this address?",
                                    )
                                  ) {
                                    toast.promise(
                                      (async () => {
                                        await deleteUserAddress(address.id);
                                        fetchAddresses();
                                      })(),
                                      {
                                        loading: "Deleting...",
                                        success: "Address deleted successfully",
                                        error: "Failed to delete address",
                                      },
                                    );
                                  }
                                }}
                                className="h-9 w-9 rounded-full text-red-300 hover:text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
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
      </div>
    </div>
  );
}
