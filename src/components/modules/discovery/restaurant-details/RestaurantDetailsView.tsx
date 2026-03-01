"use client";

import React from "react";
import ProductModal from "@/components/ProductModal";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import RestaurantSkeleton from "@/components/skeletons/RestaurantSkeleton";
import { ReviewsModal } from "@/components/common/ReviewsModal";
import { useRestaurantDetails } from "./useRestaurantDetails";
import { RestaurantHero } from "./components/RestaurantHero";
import { RestaurantMenu } from "./components/RestaurantMenu";

export default function RestaurantDetailsView() {
  const { state, actions } = useRestaurantDetails();

  if (state.isLoading) {
    return <RestaurantSkeleton />;
  }

  if (!state.restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans lg:p-10">
      <RestaurantHero
        restaurant={state.restaurant}
        bannerUrl={state.bannerUrl}
        profileUrl={state.profileUrl}
        reviewsData={state.reviewsData}
        onOpenReviews={() => actions.setIsReviewsModalOpen(true)}
      />

      <RestaurantMenu
        categories={state.categories}
        activeTab={state.activeTab}
        searchTerm={state.searchTerm}
        filteredItems={state.filteredItems}
        menuByCategories={state.menuByCategories}
        currency={state.currency}
        onCategoryClick={actions.scrollToCategory}
        onAddItem={actions.handleAddToCart}
        onItemClick={actions.setSelectedItem}
      />

      <FloatingCart
        itemCount={state.cart.length}
        totalPrice={state.totalCartPrice}
        restaurantName={state.restaurant.name || ""}
        onClick={() => actions.setIsCartOpen(true)}
      />

      <CartDrawer
        isOpen={state.isCartOpen}
        onClose={() => actions.setIsCartOpen(false)}
      />

      {state.selectedItem && (
        <ProductModal
          item={{
            ...state.selectedItem,
            productId: state.selectedItem.id,
            imageUrl: state.selectedItem.image
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${state.selectedItem.image.replace(/\\/g, "/")}`
              : "",
            price: state.selectedItem.basePrice,
          }}
          isOpen={!!state.selectedItem}
          onClose={() => actions.setSelectedItem(null)}
          onAddToCart={actions.handleAddToCartFromModal}
        />
      )}

      {state.reviewsData && (
        <ReviewsModal
          isOpen={state.isReviewsModalOpen}
          onClose={() => actions.setIsReviewsModalOpen(false)}
          restaurantName={
            state.reviewsData.restaurantName || state.restaurant.name
          }
          totalAverageRating={state.reviewsData.totalAverageRating || 0}
          totalRatingCount={state.reviewsData.totalRatingCount || 0}
          reviews={state.reviewsData.reviews || []}
        />
      )}
    </div>
  );
}
