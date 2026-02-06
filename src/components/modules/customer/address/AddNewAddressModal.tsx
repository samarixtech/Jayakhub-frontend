"use client";

import React, { useState, useCallback, useEffect } from "react";
import { GlobalModal } from "@/components/common/GlobalModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Crosshair, Loader2 } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { toast } from "react-hot-toast";
import {
  createUserAddress,
  updateUserAddress,
} from "@/app/actions/customer/address";
import { Switch } from "@/components/ui/switch";

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

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

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

  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const isMapInteraction = React.useRef(false);

  // Google Maps State
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

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
    }
  }, [open, addressToEdit]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Forward Geocoding (Address -> Coordinates)
  useEffect(() => {
    if (isMapInteraction.current) {
      isMapInteraction.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (
        !window.google ||
        !window.google.maps ||
        (!formData.street && !formData.city)
      )
        return;

      const addressComponents = [
        formData.street,
        formData.city,
        formData.state,
        formData.zip,
        formData.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (!addressComponents) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: addressComponents }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const pos = { lat: location.lat(), lng: location.lng() };
          setCenter(pos);
          setMarkerPosition(pos);
          // Don't pan here if you want to avoid jumping while typing,
          // but panning is usually expected.
          // map?.panTo(pos);
        }
      });
    }, 1000); // 1-second debounce

    return () => clearTimeout(timer);
  }, [
    formData.street,
    formData.city,
    formData.state,
    formData.zip,
    formData.country,
  ]);

  // Reverse Geocoding
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        // Initialize fields
        let streetNumber = "";
        let route = "";
        let locality = "";
        let sublocality = "";
        let state = "";
        let country = "";
        let zip = "";

        // Iterate through all results to fill missing details
        results.forEach((result) => {
          result.address_components.forEach((component) => {
            const types = component.types;

            if (!streetNumber && types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (!route && types.includes("route")) {
              route = component.long_name;
            }
            if (!locality && types.includes("locality")) {
              locality = component.long_name;
            }
            if (!sublocality && types.includes("sublocality")) {
              sublocality = component.long_name;
            }
            if (!state && types.includes("administrative_area_level_1")) {
              state = component.long_name;
            }
            if (!country && types.includes("country")) {
              country = component.long_name;
            }
            if (!zip && types.includes("postal_code")) {
              zip = component.long_name;
            }
          });
        });

        // Set City: Prioritize Locality (City) over Sublocality (Area/District)
        const city = locality || sublocality;

        // Construct street address
        let street = `${streetNumber} ${route}`.trim();
        if (!street && results[0]?.formatted_address) {
          street = results[0].formatted_address.split(",")[0];
        }

        setFormData((prev) => ({
          ...prev,
          street,
          city: city || prev.city, // Keep previous city if new one is empty
          state,
          country,
          zip,
        }));
        toast.success("Address updated!");
      } else {
        console.error("Geocoder failed due to: " + status);
        toast.error("Could not fetch address details.");
      }
    });
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };
        setMarkerPosition(newPos);
        setCenter(newPos); // Optional: pan to click

        isMapInteraction.current = true; // Set flag to prevent forward geocode loop
        reverseGeocode(lat, lng);
      }
    },
    [reverseGeocode],
  );

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      const toastId = toast.loading("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setMarkerPosition(pos);
          map?.panTo(pos);
          isMapInteraction.current = true; // Treated as map interaction
          reverseGeocode(pos.lat, pos.lng);
          toast.success("Location found!", { id: toastId });
        },
        () => {
          toast.error("Error: The Geolocation service failed.", {
            id: toastId,
          });
        },
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveAddress = async () => {
    // Basic validation
    if (!formData.street || !formData.city || !formData.country) {
      toast.error("Please fill in all required fields (Street, City, Country)");
      return;
    }

    const label = addressType === "Other" ? otherLabel : addressType;
    if (!label) {
      toast.error("Please provide a label for the address");
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

      if (addressToEdit?.id) {
        await updateUserAddress(addressToEdit.id, payload);
        toast.success("Address updated successfully!");
      } else {
        await createUserAddress(payload);
        toast.success("Address saved successfully!");
      }

      onOpenChange(false);
      // Optional: Trigger a refresh or callback if needed
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      className="max-w-[700px] p-0 overflow-hidden"
    >
      <div className="flex flex-col h-[800px] max-h-[90vh] -mt-4 bg-white">
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-8 pt-5 border-b border-gray-100 bg-white shrink-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {addressToEdit ? "Edit Address" : "Add New Address"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-6">
            {/* Map Placeholder */}
            <div className="relative w-full h-60 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker position={markerPosition} />
                </GoogleMap>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  {loadError ? "Error loading maps" : "Loading Map..."}
                </div>
              )}

              <Button
                type="button"
                variant="secondary"
                onClick={handleLocateMe}
                className="absolute top-4 right-4 bg-white hover:bg-gray-50 text-emerald-800 shadow-md gap-2 rounded-full font-bold text-xs h-9 px-4 z-10"
              >
                <Crosshair size={14} className="text-emerald-600" />
                Locate Me
              </Button>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 shadow-sm border border-gray-100 pointer-events-none">
                Tap on map to pin location
              </div>
            </div>

            <form className="space-y-5">
              {/* Address Label */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-gray-900">
                  Address Label
                </Label>
                <div className="flex gap-3">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type as any)}
                      className={`
                    px-6 py-2.5 rounded-full text-sm font-bold transition-all flex-1
                    ${
                      addressType === type
                        ? "bg-[#1E4D3B] text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {addressType === "Other" && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                      placeholder="e.g. Grandma's House"
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                      autoFocus
                      value={otherLabel}
                      onChange={(e) => setOtherLabel(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Street Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="street"
                  className="text-sm font-bold text-gray-900"
                >
                  Street Address
                </Label>
                <Input
                  id="street"
                  placeholder="e.g. 123 Main St"
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>

              {/* Apartment */}
              <div className="space-y-2">
                <Label
                  htmlFor="apt"
                  className="text-sm font-bold text-gray-900"
                >
                  Apartment, Suite, Unit, etc. (Optional)
                </Label>
                <Input
                  id="apt"
                  placeholder="e.g. Apt 4B"
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                  value={formData.apt}
                  onChange={handleInputChange}
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm font-bold text-gray-900"
                  >
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Baghdad"
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-sm font-bold text-gray-900"
                  >
                    State / Province
                  </Label>
                  <Input
                    id="state"
                    placeholder="e.g. Al Mansour"
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Zip & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="zip"
                    className="text-sm font-bold text-gray-900"
                  >
                    Zip / Postal Code
                  </Label>
                  <Input
                    id="zip"
                    placeholder="e.g. 10011"
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm font-bold text-gray-900"
                  >
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="Iraq"
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 text-base"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-gray-900">
                    Set as Active Address
                  </Label>
                  <p className="text-xs text-gray-500">
                    Use this address for your order
                  </p>
                </div>
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, status: checked }))
                  }
                  className="data-[state=checked]:bg-[#1E4D3B]"
                />
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label
                  htmlFor="note"
                  className="text-sm font-bold text-gray-900"
                >
                  Note to Courier (Optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="e.g. Ring the doorbell, leave at front desk..."
                  className="min-h-[100px] rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-emerald-500/20 resize-none text-base"
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </div>
            </form>
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
            Cancel
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
                {addressToEdit ? "Updating..." : "Saving..."}
              </>
            ) : addressToEdit ? (
              "Update Address"
            ) : (
              "Save Address"
            )}
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
