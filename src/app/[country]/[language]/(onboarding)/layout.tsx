"use client";

// The layout no longer enforces UI structure (Card/Header/Stepper) because
// the RestaurantOnboardingView wizard manages its own UI and State.
// This prevents the "double header/stepper" issue.

export default function RestaurantOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
