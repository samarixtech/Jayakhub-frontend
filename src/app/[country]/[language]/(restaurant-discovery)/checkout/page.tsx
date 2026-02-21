import { Suspense } from "react";
import CheckoutView from "@/components/modules/checkout/CheckoutView";
import CheckoutSkeleton from "@/components/skeletons/CheckoutSkeleton";

const CheckoutPage = () => {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutView />
    </Suspense>
  );
};

export default CheckoutPage;
