"use client";

import React, { useState, useEffect } from "react";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  createUserAddress,
  updateUserAddress,
} from "@/app/actions/customer/address";

import {
  useAddressGeocoding,
  defaultCenter,
} from "@/hooks/useAddressGeocoding";
import { AddressMap } from "./components/AddressMap";
import { AddressForm } from "./components/AddressForm";
import { useTranslations } from "next-intl";

interface Address {
  id: string;
  label: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  noteToCourier: string;
  latitude: number | string;
  longitude: number | string;
  status: boolean;
}

interface AddNewAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  addressToEdit?: Address | null;
}

export default function AddNewAddressModal({
  open,
  onOpenChange,
  trigger,
  addressToEdit,
}: AddNewAddressModalProps) {
  const [addressType, setAddressType] = useState<"Home" | "Work" | "Other">(
    "Home",
  );
  const [otherLabel, setOtherLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations('CustomerDashboard.MyAddress');

  const [formData, setFormData] = useState({
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    note: "",
    status: true,
  });

  const {
    isLoaded,
    loadError,
    center,
    setCenter,
    markerPosition,
    setMarkerPosition,
    onLoad,
    onUnmount,
    handleMapClick,
    handleLocateMe,
    autoDetectLocation,
  } = useAddressGeocoding(formData, setFormData);

  // Populate form for Edit Mode
  useEffect(() => {
    if (open && addressToEdit) {
      setFormData({
        street: addressToEdit.streetAddress || "",
        apt: addressToEdit.apartment || "",
        city: addressToEdit.city || "",
        state: addressToEdit.stateProvince || "",
        zip: addressToEdit.zipCode || "",
        country: addressToEdit.country || "",
        note: addressToEdit.noteToCourier || "",
        status: addressToEdit.status ?? true,
      });

      // Handle Label
      if (["Home", "Work"].includes(addressToEdit.label)) {
        setAddressType(addressToEdit.label as "Home" | "Work");
      } else {
        setAddressType("Other");
        setOtherLabel(addressToEdit.label);
      }

      // Handle Map Position
      const lat = Number(addressToEdit.latitude);
      const lng = Number(addressToEdit.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const pos = { lat, lng };
        setCenter(pos);
        setMarkerPosition(pos);
      }
    } else if (open && !addressToEdit) {
      // Reset form for Add Mode
      setFormData({
        street: "",
        apt: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        note: "",
        status: true,
      });
      setAddressType("Home");
      setOtherLabel("");
      setCenter(defaultCenter);
      setMarkerPosition(defaultCenter);
      autoDetectLocation();
    }
  }, [open, addressToEdit, setCenter, setMarkerPosition, autoDetectLocation]);

  const handleSaveAddress = async () => {
    if (!formData.street || !formData.city || !formData.country) {
      toast.error(t("toast_fill_required"));
      return;
    }

    const label = addressType === "Other" ? otherLabel : addressType;
    if (!label) {
      toast.error(t("toast_provide_label"));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        label,
        streetAddress: formData.street,
        apartment: formData.apt,
        city: formData.city,
        stateProvince: formData.state,
        zipCode: formData.zip,
        country: formData.country,
        noteToCourier: formData.note,
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        status: formData.status,
      };

      const res = addressToEdit?.id
        ? await updateUserAddress(addressToEdit.id, payload)
        : await createUserAddress(payload);

      if (!res.success) {
        toast.error(res.message || t("toast_save_failed"));
        return;
      }

      toast.success(addressToEdit?.id ? t("toast_updated") : t("toast_saved"));
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || t("toast_save_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      isOutsideDisabled={true}
      trigger={trigger}
      className="max-w-[700px] p-0 overflow-hidden"
    >
      <div className="flex flex-col h-[800px] max-h-[90vh] -mt-4 bg-white">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-8 pt-5 border-b border-gray-100 bg-white shrink-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {addressToEdit ? t('edit_address') : t('add_new_address')}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-6">
            <AddressMap
              isLoaded={isLoaded}
              loadError={loadError}
              center={center}
              markerPosition={markerPosition}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onMapClick={handleMapClick}
              onLocateMe={handleLocateMe}
            />

            <AddressForm
              formData={formData}
              setFormData={setFormData}
              addressType={addressType}
              setAddressType={setAddressType}
              otherLabel={otherLabel}
              setOtherLabel={setOtherLabel}
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-100 bg-white shrink-0 mt-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-full font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSaveAddress}
            disabled={loading}
            className="flex-1 h-12 rounded-full font-bold bg-[#346853] hover:bg-[#2a5443] text-white shadow-lg shadow-emerald-900/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {addressToEdit ? t('updating') : t('saving')}
              </>
            ) : addressToEdit ? (
              t('update_address')
            ) : (
              t('save_address')
            )}
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
