import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalModal } from "@/components/common/GlobalModal";
import AddNewAddressModal from "@/components/modules/customer/address/AddNewAddressModal";

interface CheckoutDeliveryAddressProps {
  selectedAddress: any;
  savedAddresses: any[];
  setSelectedAddress: (addr: any) => void;
  fetchAddresses: () => void;
}

export const CheckoutDeliveryAddress = ({
  selectedAddress,
  savedAddresses,
  setSelectedAddress,
  fetchAddresses,
}: CheckoutDeliveryAddressProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddNewAddressModalOpen, setIsAddNewAddressModalOpen] =
    useState(false);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="text-[#346853]" size={20} />
        <h3 className="font-bold text-lg text-gray-900">Delivery Address</h3>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">
            {selectedAddress ? selectedAddress.label : "No Address Selected"}
          </h4>
          <p className="text-sm text-gray-500">
            {selectedAddress
              ? `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.stateProvince}`
              : "Please select or add an address."}
          </p>
          {selectedAddress?.noteToCourier && (
            <p className="text-xs text-gray-400 mt-1">
              Note: {selectedAddress.noteToCourier}
            </p>
          )}
        </div>
      </div>

      <GlobalModal
        trigger={
          <Button
            className="w-full mt-4 bg-[#346853] hover:bg-[#2a5443] text-white"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Change
          </Button>
        }
        title="Select Delivery Address"
        description="Choose where you want your order delivered."
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                selectedAddress?.id === addr.id
                  ? "border-[#346853] bg-[#346853]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedAddress(addr);
                setIsAddressModalOpen(false);
              }}
            >
              <div
                className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedAddress?.id === addr.id
                    ? "border-[#346853]"
                    : "border-gray-300"
                }`}
              >
                {selectedAddress?.id === addr.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#346853]" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{addr.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {addr.streetAddress}, {addr.city}, {addr.stateProvince}
                </p>
              </div>
            </div>
          ))}
          {savedAddresses.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No addresses found.
            </p>
          )}

          {/* Add New Address Button */}
          <button
            onClick={() => {
              setIsAddressModalOpen(false); // Close selection modal
              setIsAddNewAddressModalOpen(true); // Open add modal
            }}
            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-500 hover:text-[#346853] hover:border-[#346853] hover:bg-gray-50 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Add New Address</span>
          </button>
        </div>
      </GlobalModal>

      <AddNewAddressModal
        open={isAddNewAddressModalOpen}
        onOpenChange={(open) => {
          setIsAddNewAddressModalOpen(open);
          if (!open) {
            // Refresh list when closed
            fetchAddresses();
            setIsAddressModalOpen(true);
          }
        }}
      />
    </div>
  );
};
