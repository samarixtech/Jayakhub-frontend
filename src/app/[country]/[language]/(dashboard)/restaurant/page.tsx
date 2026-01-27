import { redirect } from "next/navigation";

export default async function RestaurantDashboardPage({
  params,
}: {
  params: Promise<{ country: string; language: string }>;
}) {
  const { country, language } = await params;
  // TODO: Add logic to check if onboarding is complete. 
  // For now, matching previous behavior which showed validation, we redirect to onboarding.
  redirect(`/${country}/${language}/restaurant/onboarding`);
}
