"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/modules/checkout/OrderSummary";
import {
  getProfile,
  getMyCardsAction,
} from "@/app/actions/customer/userprofile";
import { getUserAddresses } from "@/app/actions/customer/address";
import { CheckoutPromoBanner } from "./components/CheckoutPromoBanner";
import { CheckoutLoginForm } from "./components/CheckoutLoginForm";
import { CheckoutPersonalDetails } from "./components/CheckoutPersonalDetails";
import { CheckoutDeliveryAddress } from "./components/CheckoutDeliveryAddress";
import { CheckoutPaymentMethod } from "./components/CheckoutPaymentMethod";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import { clearCart } from "@/redux/slices/cartSlice";
import { createOrderAction } from "@/app/actions/customer/order";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CheckoutView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]); // New state for cards
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod" | string>(
    "cod",
  );

  const { country, language } = useLocale();

  // ACTIONS
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
    const restaurantId = cart[0].restaurantId || "";
    const fullAddress = `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.stateProvince}`;

    // Calculate total amount
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = 10;
    const totalAmount = subtotal + deliveryFee;

    const payload = {
      paymentMethod: paymentMethod as any,
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
          const orderId = res.data?.orderId || "new";
          router.push(`/${country}/${language}/order-confirmation/${orderId}`);
        } else {
          if (res.data?.url) {
            window.location.assign(res.data.url);
          } else if (res.success || res.meta?.status === 200) {
            // Successful charge with saved card
            toast.success("Payment successful!");
            dispatch(clearCart());
            const orderId = res.data?.orderId || "new";
            router.push(
              `/${country}/${language}/order-confirmation/${orderId}`,
            );
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

  // Fetch Saved Cards
  const fetchCards = async () => {
    try {
      const cardsRes: any = await getMyCardsAction();
      console.log("Cards Res:", cardsRes);
      if (cardsRes.success && cardsRes.data) {
        setSavedCards(cardsRes.data);
      } else if (cardsRes.meta?.status === 200 && cardsRes.data) {
        setSavedCards(cardsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch cards", error);
    }
  };

  // Check auth status and fetch profile & addresses
  useEffect(() => {
    const init = async () => {
      // Try to fetch profile to check auth status
      try {
        const profileRes: any = await getProfile();
        console.log("Profile Res:", profileRes);

        if (profileRes.success && profileRes.data) {
          setIsLoggedIn(true);
          setUserProfile(profileRes.data);
          // Only fetch addresses if logged in
          await fetchAddresses();
          await fetchCards();
        } else if (profileRes.meta?.status === 200 && profileRes.data) {
          // Fallback
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
  }, []);

  if (loading) return <CheckoutSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/restaurants">Restaurants</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-gray-900">
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Finalize Your Order
          </h1>

          {/* Promo Banner if logged in */}
          {!isLoggedIn && <CheckoutPromoBanner />}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Forms or Login Prompt */}
            <div className="lg:col-span-8 space-y-6">
              {!isLoggedIn ? (
                <CheckoutLoginForm />
              ) : (
                <>
                  <CheckoutPersonalDetails userProfile={userProfile} />

                  <CheckoutDeliveryAddress
                    selectedAddress={selectedAddress}
                    savedAddresses={savedAddresses}
                    setSelectedAddress={setSelectedAddress}
                    fetchAddresses={fetchAddresses}
                  />

                  <CheckoutPaymentMethod
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    savedCards={savedCards}
                  />

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
