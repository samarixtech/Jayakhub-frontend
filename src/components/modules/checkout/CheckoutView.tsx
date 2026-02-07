"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Banknote,
  MapPin,
  User,
  Circle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import OrderSummary from "@/components/modules/checkout/OrderSummary";
import Header from "@/components/restaurants/Header";
import { getProfile } from "@/app/actions/customer/userprofile";
import { getUserAddresses } from "@/app/actions/customer/address";
import AddNewAddressModal from "@/components/modules/customer/address/AddNewAddressModal";
import { GlobalModal } from "@/components/common/GlobalModal";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import { clearCart } from "@/redux/slices/cartSlice";
import { createOrderAction } from "@/app/actions/customer/order";
import { toast } from "react-hot-toast";

// Mock Social Icons (replace with actual assets if available)
const SocialButton = ({
  icon,
  text,
  bg = "bg-white",
  textCol = "text-gray-900",
  border = "border-gray-200",
}: any) => (
  <button
    className={`w-full h-12 flex items-center justify-center gap-3 rounded-lg border ${border} ${bg} ${textCol} font-bold text-sm hover:opacity-90 transition-opacity`}
  >
    <span>{icon}</span> {text}
  </button>
);

const CheckoutView = () => {
  // --- Redux ---
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  // --- State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe",
  ); // Default to stripe
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddNewAddressModalOpen, setIsAddNewAddressModalOpen] =
    useState(false);

  // --- Actions ---
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);

    // Prepare Payload
    const restaurantId = cart[0].restaurantId || ""; // Assuming all items from same restaurant
    const fullAddress = `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.stateProvince}`;

    // Calculate total amount
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = 10; // Fixed for now, should come from somewhere
    const totalAmount = subtotal + deliveryFee;

    const payload = {
      paymentMethod,
      restaurantId,
      items: cart.map((item) => ({
        itemName: item.name,
        itemPrice: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      fullAddress,
      discount: 0.0,
      totalAmount,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
    };

    try {
      const res: any = await createOrderAction(payload);
      console.log("Order Response:", res);

      if (res.meta?.status === 200 || res.success) {
        if (paymentMethod === "cod") {
          // COD Success
          toast.success("Order placed successfully!");
          dispatch(clearCart());
          // Redirect to order status page (simulated)
          // Ideally we'd have the order ID to redirect to /order/[id]
          // For now, redirecting to home or a generic success page?
          // User requested: "redirect to order summary page just like given screenshot"
          // Assuming this means the "Order Journey" page which likely takes an ID.
          // Let's assume response.data.orderId exists.
          const orderId = res.data?.orderId || "new";
          router.push(
            `/${userProfile?.country || "US"}/${userProfile?.language || "en"}/order-confirmation/${orderId}`,
          );
        } else {
          // Stripe Success
          if (res.data?.url) {
            window.open(res.data.url, "_blank");
          } else {
            toast.error("Stripe URL not found.");
          }
        }
      } else {
        toast.error(res.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const addressRes: any = await getUserAddresses();
      console.log("Address Res:", addressRes);
      if (addressRes && addressRes.data) {
        setSavedAddresses(addressRes.data);

        // Only set default if one isn't already selected, or validify selection
        if (!selectedAddress) {
          const defaultAddr = addressRes.data.find((addr: any) => addr.status);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr);
          } else if (addressRes.data.length > 0) {
            setSelectedAddress(addressRes.data[0]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  // Check auth status and fetch profile & addresses
  useEffect(() => {
    const init = async () => {
      // 1. Try to fetch profile to check auth status
      try {
        const profileRes: any = await getProfile();
        console.log("Profile Res:", profileRes);

        if (profileRes.success && profileRes.data) {
          setIsLoggedIn(true);
          setUserProfile(profileRes.data);
          // Only fetch addresses if logged in
          await fetchAddresses();
        } else if (profileRes.meta?.status === 200 && profileRes.data) {
          // Fallback for different structure
          setIsLoggedIn(true);
          setUserProfile(profileRes.data.data || profileRes.data);
          await fetchAddresses();
        } else {
          // If profile fetch fails or returns non-success, assume not logged in
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setIsLoggedIn(false);
      }

      setLoading(false);
    };

    init();
  }, []); // Run once on mount

  if (loading) return <CheckoutSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="py-10 px-4 md:px-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Finalize Your Order
          </h1>

          {/* Promo Banner if logged in */}
          {!isLoggedIn && (
            <div className="w-full bg-[#346853] rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">
                  Sign up to get free delivery on
                </h2>
                <h2 className="text-2xl font-bold">your first order</h2>
              </div>
              {/* Simple Logo Placeholder */}
              <div className="flex items-center gap-2 mt-4 md:mt-0 relative z-10">
                {/* Replace with actual Logo */}
                <div className="text-right">
                  <h3 className="font-black text-xl tracking-tight">
                    JAYAK HUB
                  </h3>
                  <p className="text-[10px] tracking-widest opacity-80">
                    Iraq's Premier Food Delivery Platform
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Forms or Login Prompt */}
            <div className="lg:col-span-8 space-y-6">
              {!isLoggedIn ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                    <User className="w-10 h-10 text-[#346853]" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Login to Place Order
                    </h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Please sign in or create an account to proceed with your
                      order and manage your delivery details.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => router.push("/login")}
                      className="bg-[#346853] hover:bg-[#2a5443] text-white px-8 rounded-full font-bold h-12"
                    >
                      Login / Sign Up
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="text-[#346853]" size={20} />
                      <h3 className="font-bold text-lg text-gray-900">
                        Personal Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Email
                        </label>
                        <Input
                          defaultValue={
                            userProfile?.email || "shoaib.dev510@gmail.com"
                          }
                          value={userProfile?.email}
                          className="h-11 bg-white"
                          readOnly={!!userProfile?.email}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Full Name
                        </label>
                        <Input
                          defaultValue={userProfile?.name || "Muhammad Shoaib"}
                          value={userProfile?.name}
                          className="h-11 bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          {/* <div className="h-11 w-20 flex items-center justify-center border rounded-md bg-gray-50 text-sm font-medium text-gray-600">
                            +63
                          </div> */}
                          <Input
                            defaultValue={userProfile?.phone || "912 345 6789"}
                            value={userProfile?.phone}
                            className="h-11 bg-white flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="text-[#346853]" size={20} />
                      <h3 className="font-bold text-lg text-gray-900">
                        Delivery Address
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {selectedAddress
                            ? selectedAddress.label
                            : "No Address Selected"}
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
                              <p className="font-bold text-gray-900 text-sm">
                                {addr.label}
                              </p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                {addr.streetAddress}, {addr.city},{" "}
                                {addr.stateProvince}
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
                          <span className="font-bold text-sm">
                            Add New Address
                          </span>
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

                  {/* Payment Method */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Banknote className="text-[#346853]" size={20} />
                      <h3 className="font-bold text-lg text-gray-900">
                        Payment Method
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div
                        onClick={() => setPaymentMethod("stripe")}
                        className={`border p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "stripe" ? "border-[#346853] bg-[#346853]/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-4">
                          <CreditCard
                            className={
                              paymentMethod === "stripe"
                                ? "text-[#346853]"
                                : "text-gray-400"
                            }
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              Credit Card / Stripe
                            </p>
                            <p className="text-xs text-gray-500">
                              Secure payment via Stripe
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "stripe" ? (
                          <CheckCircle2 className="text-[#346853] fill-[#346853]/20" />
                        ) : (
                          <Circle className="text-gray-300" />
                        )}
                      </div>

                      <div
                        onClick={() => setPaymentMethod("cod")}
                        className={`border p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#346853] bg-[#346853]/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-4">
                          <Banknote
                            className={
                              paymentMethod === "cod"
                                ? "text-[#346853]"
                                : "text-gray-400"
                            }
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              Cash on Delivery
                            </p>
                            <p className="text-xs text-gray-500">
                              Pay when food arrives
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "cod" ? (
                          <CheckCircle2 className="text-[#346853] fill-[#346853]/20" />
                        ) : (
                          <Circle className="text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="font-bold text-lg text-gray-900">
                        Special Instructions
                      </h3>
                    </div>
                    <textarea
                      className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#346853] resize-none"
                      placeholder="e.g. No onions, please. Knock twice."
                    />
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <OrderSummary
                  subtotal={cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  )}
                  deliveryFee={10}
                  tax={0}
                  total={
                    cart.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0,
                    ) + 10
                  }
                  cartItems={cart}
                  onPlaceOrder={handlePlaceOrder}
                  isPlacingOrder={isPlacingOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
