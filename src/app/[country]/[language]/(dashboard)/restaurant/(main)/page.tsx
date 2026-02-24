import { redirect } from "next/navigation";

export default async function RestaurantDashboardPage({
  params,
}: {
  params: Promise<{ country: string; language: string }>;
}) {
  const { country, language } = await params;
  // TODO: Add logic to check if onboarding is complete.
  redirect(`/${country}/${language}/restaurant/onboarding`);
}
