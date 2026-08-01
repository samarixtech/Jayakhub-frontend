"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderSummary from "@/components/modules/checkout/OrderSummary";
import {
  getProfile,
  getMyCardsAction,
} from "@/app/actions/customer/userprofile";
import {
  getUserAddresses,
  getDeliveryChargeEstimateAction,
} from "@/app/actions/customer/address";
import { CheckoutPromoBanner } from "./components/CheckoutPromoBanner";
import { CheckoutLoginForm } from "./components/CheckoutLoginForm";
import { CheckoutPersonalDetails } from "./components/CheckoutPersonalDetails";
import { CheckoutDeliveryAddress } from "./components/CheckoutDeliveryAddress";
import { CheckoutPaymentMethod } from "./components/CheckoutPaymentMethod";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store/store";
import { clearCart, clearRestaurantCart, clearUnavailableItems } from "@/redux/slices/cartSlice";
import { setSelectedRestaurantMeta } from "@/redux/slices/discoverySlice";
import { createOrderAction } from "@/app/actions/customer/order";
import { toast } from "react-hot-toast";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

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
  const unavailableItems = useSelector(
    (state: RootState) => state.cart.unavailableItems,
  );
  const selectedRestaurantMeta = useSelector((state: RootState) => state.discovery.selectedRestaurantMeta);
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantIdParam = searchParams.get("restaurantId");

  // Filter cart items specifically for the active restaurant being checked out
  const activeCart = useMemo(() => {
    if (restaurantIdParam) {
      const filtered = cart.filter(
        (item) => item.restaurantId === restaurantIdParam,
      );
      if (filtered.length > 0) return filtered;
    }
    if (cart.length > 0) {
      const firstResId = cart[0]?.restaurantId;
      if (firstResId) {
        return cart.filter((item) => item.restaurantId === firstResId);
      }
    }
    return cart;
  }, [cart, restaurantIdParam]);

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
  const [couponCode, setCouponCode] = useState("");
  const [couponFinalTotal, setCouponFinalTotal] = useState<number | null>(null);
  const [estimatedDeliveryCharge, setEstimatedDeliveryCharge] = useState<number | null>(null);
  const [isEstimatingDelivery, setIsEstimatingDelivery] = useState(false);

  const { country, currencyCode } = useCLC();
  const t = useTranslations("Checkout");

  // ACTIONS
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error(t("selectAddressError"));
      return;
    }
    if (activeCart.length === 0) {
      toast.error(t("cartEmpty"));
      return;
    }

    setIsPlacingOrder(true);

    // Prepare Payload
    const targetRestaurantId =
      restaurantIdParam || activeCart[0]?.restaurantId || "";
    const fullAddress = `${selectedAddress.streetAddress}, ${selectedAddress.city}, ${selectedAddress.stateProvince}`;

    // Calculate total amount
    const subtotal = activeCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = estimatedDeliveryCharge ?? (selectedRestaurantMeta?.deliveryFee ?? 0);
    const totalAmount = couponFinalTotal ?? (subtotal + deliveryFee);

    const payload = {
      paymentMethod: paymentMethod as any,
      restaurantId: targetRestaurantId,
      items: (Array.isArray(activeCart) ? activeCart : []).map((item) => {
        const variantGroupIds =
          (Array.isArray(item.selectedVariations) ? item.selectedVariations : []).map((v: any) => v.groupId).filter(Boolean);
        const variantOptionNames =
          (Array.isArray(item.selectedVariations) ? item.selectedVariations : []).map((v: any) => v.name).filter(Boolean);

        const itemPayload: any = {
          itemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        };

        if (variantGroupIds.length > 0) {
          itemPayload.variantGroupIds = variantGroupIds;
          itemPayload.variantOptionNames = variantOptionNames;
        }

        return itemPayload;
      }),
      fullAddress,
      discount: 0.0,
      totalAmount,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      currency: currencyCode,
      couponCode: couponCode || undefined,
    };

    const clearOrderedCart = () => {
      if (targetRestaurantId) {
        dispatch(clearRestaurantCart(targetRestaurantId));
      } else {
        dispatch(clearCart());
      }
      dispatch(clearUnavailableItems());
    };

    try {
      const res: any = await createOrderAction(payload);

      const isSuccess =
        (res?.meta?.status === 200 || res?.meta?.status === 201 || res?.success === true) &&
        res?.meta?.status !== 400 &&
        res?.meta?.status !== 422 &&
        res?.meta?.status !== 500;

      if (isSuccess) {
        if (paymentMethod === "cod") {
          // COD Success
          toast.success(t("orderPlacedSuccess"));
          clearOrderedCart();
          const orderId = res.data?.orderId || "new";
          router.push(`/order-confirmation/${orderId}`);
        } else {
          if (res.data?.url) {
            clearOrderedCart();
            window.location.assign(res.data.url);
          } else if (res.success || res.meta?.status === 200) {
            // Successful charge with saved card
            toast.success(t("paymentSuccess"));
            clearOrderedCart();
            const orderId = res.data?.orderId || "new";
            router.push(`/order-confirmation/${orderId}`);
          } else {
            const errMsg =
              res.meta?.message ||
              res.data?.message ||
              res.message ||
              t("stripeUrlNotFound");
            toast.error(errMsg);
          }
        }
      } else {
        const errorMsg =
          res?.meta?.message ||
          res?.data?.message ||
          res?.message ||
          (typeof res?.error === "string" ? res.error : undefined) ||
          t("placeOrderFailed");
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Place order error:", error);
      toast.error(error?.message || t("placeOrderFailed"));
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchAddresses = async (autoSelectLatest = false) => {
    try {
      const addressRes: any = await getUserAddresses();
      if (addressRes && addressRes.success && Array.isArray(addressRes.data)) {
        setSavedAddresses(addressRes.data);

        if (autoSelectLatest && addressRes.data.length > 0) {
          const latest = addressRes.data[addressRes.data.length - 1] || addressRes.data[0];
          setSelectedAddress(latest);
        } else if (!selectedAddress && addressRes.data.length > 0) {
          const defaultAddr = addressRes.data.find((addr: any) => addr.status);
          setSelectedAddress(defaultAddr || addressRes.data[0]);
        } else if (selectedAddress) {
          const updated = addressRes.data.find((addr: any) => addr.id === selectedAddress.id);
          if (updated) {
            setSelectedAddress(updated);
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
      if (cardsRes.success && cardsRes.data) {
        setSavedCards(cardsRes.data);
      } else if (cardsRes.meta?.status === 200 && cardsRes.data) {
        setSavedCards(cardsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch cards", error);
    }
  };

  useEffect(() => {
    if (selectedRestaurantMeta && !selectedRestaurantMeta.deliveryFee) {
      try {
        const saved = localStorage.getItem("selectedRestaurantMeta");
        if (saved) dispatch(setSelectedRestaurantMeta(JSON.parse(saved)));
      } catch { }
    }
  }, []);

  // Fetch delivery charge estimate whenever selectedAddress changes
  useEffect(() => {
    if (!selectedAddress) return;

    const latRaw = selectedAddress.latitude ?? selectedAddress.lat ?? selectedAddress.location?.lat;
    const lngRaw = selectedAddress.longitude ?? selectedAddress.lng ?? selectedAddress.location?.lng;

    if (latRaw == null || lngRaw == null) return;

    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    const code = (
      selectedAddress.countryCode ||
      (selectedAddress.country && selectedAddress.country.length === 2
        ? selectedAddress.country
        : null) ||
      country ||
      "PK"
    ).toUpperCase();

    if (!isNaN(lat) && !isNaN(lng)) {
      setIsEstimatingDelivery(true);
      getDeliveryChargeEstimateAction(lat, lng, code)
        .then((res) => {
          if (res.success && res.data) {
            const raw = res.data;
            const chargeVal =
              raw?.data?.deliveryCharge ??
              raw?.deliveryCharge ??
              raw?.data?.data?.deliveryCharge ??
              raw?.data?.delivery_charge ??
              raw?.delivery_charge ??
              raw?.data?.deliveryFee ??
              raw?.deliveryFee;

            if (chargeVal !== undefined && chargeVal !== null) {
              const parsed = Number(chargeVal);
              if (!isNaN(parsed)) {
                setEstimatedDeliveryCharge(parsed);
              }
            }
          }
        })
        .catch((err) => {
          console.error("Failed to estimate delivery charge", err);
        })
        .finally(() => {
          setIsEstimatingDelivery(false);
        });
    }
  }, [selectedAddress, country]);

  // Check auth status and fetch profile & addresses
  useEffect(() => {
    const init = async () => {
      // Try to fetch profile to check auth status
      try {
        const profileRes: any = await getProfile();
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
                <BreadcrumbLink href="/">{t("breadcrumbHome")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/restaurants">{t("breadcrumbRestaurants")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-gray-900">
                  {t("breadcrumbCheckout")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t("heading")}
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
                        {t("specialInstructions")}
                      </h3>
                    </div>
                    <textarea
                      className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary resize-none"
                      placeholder={t("specialInstructionsPlaceholder")}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                {(() => {
                  const currentSubtotal = activeCart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                  );
                  const currentDeliveryFee =
                    estimatedDeliveryCharge ?? (selectedRestaurantMeta?.deliveryFee ?? 0);
                  return (
                    <OrderSummary
                      subtotal={currentSubtotal}
                      deliveryFee={currentDeliveryFee}
                      total={currentSubtotal + currentDeliveryFee}
                      cartItems={activeCart}
                      unavailableItems={unavailableItems}
                      onPlaceOrder={handlePlaceOrder}
                      isPlacingOrder={isPlacingOrder}
                      isEstimatingDelivery={isEstimatingDelivery}
                      couponCode={couponCode}
                      setCouponCode={setCouponCode}
                      onCouponApplied={(finalTotal) => setCouponFinalTotal(finalTotal)}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
