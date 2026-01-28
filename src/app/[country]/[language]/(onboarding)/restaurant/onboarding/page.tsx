import { redirect } from "next/navigation";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ country: string; language: string }>;
}) {
  const { country, language } = await params;
  redirect(`/${country}/${language}/restaurant/onboarding/step-owner-info`);
}
