// page.tsx - Updated
"use client";
import { useState, useEffect } from "react";
import { MapPin, Plus, Shield, Globe, Sparkles } from "lucide-react";
import api from "@/components/services/api";
import AddressCard from "@/components/addresses/AddressCard";
import AddressForm from "@/components/addresses/AddressForm";
import SuccessErrorAlert from "@/components/addresses/SuccessErrorAlert";
import { Address, AddressFormData } from "@/components/addresses/type";

const defaultAddress: AddressFormData = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  area: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  isDefault: false,
  type: "home",
};

export default function MyAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<AddressFormData>(defaultAddress);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsFetching(true);
      const response = await api.get<{ data: any[] }>("/addresses");

      const transformedAddresses = (response.data?.data || []).map(
        (address) => ({
          ...address,
          fullName: address.fullName || "",
          phone: address.phone || "",
          addressLine1: address.addressLine1 || "",
          addressLine2: address.addressLine2 || "",
          city: address.city || "",
          area: address.area || "",
          postalCode: address.postalCode || "",
          latitude: address.latitude,
          longitude: address.longitude,
        })
      );

      setAddresses(transformedAddresses);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      showError("Unable to load addresses. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess({ show: true, message });
    setTimeout(() => setSuccess({ show: false, message: "" }), 3000);
  };

  const showError = (message: string) => {
    setError(message);
  };

  const handleFormSubmit = async (data: AddressFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        latitude: data.latitude?.trim() ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude?.trim()
          ? parseFloat(data.longitude)
          : undefined,
      };

      if (isEditing) {
        await api.put(`/addresses/${isEditing}`, payload);
        showSuccess("Address updated successfully");
        setIsEditing(null);
        setIsAdding(false);
      } else {
        await api.post("/addresses", payload);
        showSuccess("Address added successfully");
        setFormData(defaultAddress);
      }

      await fetchAddresses();
    } catch (error: any) {
      console.error("Failed to save address:", error);
      showError(
        error.response?.data?.message ||
          "Failed to save address. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      area: address.area || "",
      postalCode: address.postalCode || "",
      latitude: address.latitude?.toString() || "",
      longitude: address.longitude?.toString() || "",
      isDefault: address.isDefault,
      type: address.type,
    });
    setIsEditing(address.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/addresses/${id}`);
      showSuccess("Address deleted successfully");
      fetchAddresses();
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      showError("Failed to delete address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.put(`/addresses/${id}/default`);
      showSuccess("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      console.error("Failed to set default address:", error);
      showError("Failed to update default address. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData(defaultAddress);
  };

  const handleFormChange = (data: AddressFormData) => {
    setFormData(data);
    if (error) setError("");
  };

  if (isFetching) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50/30 via-white to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="max-w-6xl mx-auto flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-emerald-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">
              Loading your addresses...
            </p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50/30 via-white to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-linear-to-r from-emerald-50 to-blue-50 rounded-full border border-white shadow-sm mb-6 backdrop-blur-sm">
            <div className="p-1.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg">
              <MapPin className="text-white" size={16} />
            </div>
            <span className="text-sm font-semibold text-emerald-700">
              Shipping Addresses
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                My Addresses
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Manage your delivery addresses for seamless shipping and order
                fulfillment. Add, edit, or remove addresses with ease.
              </p>
            </div>

            {!isAdding && addresses.length > 0 && (
              <button
                onClick={() => setIsAdding(true)}
                className="relative group inline-flex items-center gap-3 px-6 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-emerald-700 rounded-xl group-hover:from-emerald-700 group-hover:to-emerald-800 transition-all"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Plus size={20} />
                  Add New Address
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Alerts */}
        <SuccessErrorAlert
          success={success}
          error={error}
          onErrorDismiss={() => setError("")}
        />

        {/* Add/Edit Address Form */}
        {isAdding && (
          <div className="mb-8">
            <AddressForm
              formData={formData}
              isEditing={isEditing}
              isLoading={isLoading}
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Addresses List */}
        {!isAdding && (
          <div className="space-y-8">
            {addresses.length === 0 ? (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 p-12 text-center shadow-xl">
                  <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                    <MapPin className="text-emerald-600" size={36} />
                  </div>
                  <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                    No addresses saved
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    Add your first address to make checkout faster and manage
                    deliveries easily.
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="relative group/btn inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-emerald-700 rounded-xl group-hover/btn:from-emerald-700 group-hover/btn:to-emerald-800 transition-all"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus size={20} />
                      Add Your First Address
                      <Sparkles size={16} />
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSetDefault={handleSetDefault}
                      isDeleting={deletingId === address.id}
                    />
                  ))}
                </div>

                {/* Add Address Button */}
                <div className="pt-8">
                  <button
                    onClick={() => setIsAdding(true)}
                    className="group w-full p-8 bg-linear-to-r from-white/80 to-emerald-50/30 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full group-hover:from-emerald-200 group-hover:to-emerald-100 transition-all duration-300 border border-emerald-100">
                        <Plus className="text-emerald-600" size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          Add Another Address
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Add a new shipping or billing address for different
                          locations
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-12 relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-linear-to-r from-emerald-50/80 to-blue-50/30 rounded-2xl border border-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-xl border border-emerald-100">
                <Shield className="text-emerald-700" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  Address Security & Privacy
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                    Protected
                  </span>
                </h4>
                <p className="text-sm text-gray-600">
                  Your address information is encrypted and stored securely with
                  AES-256 encryption. We never share your personal addresses
                  with third parties without your explicit consent. All data
                  handling complies with GDPR, CCPA, and global privacy
                  regulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-full"></div>
                <span className="font-medium">
                  {addresses.length} saved address
                  {addresses.length !== 1 ? "es" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-linear-to-br from-blue-500 to-blue-600 rounded-full"></div>
                <span className="font-medium">
                  {addresses.filter((a) => a.isDefault).length} default address
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Globe size={12} className="text-gray-500" />
              </div>
              <span className="font-medium">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
