import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  redirect(`/restaurant/onboarding/step-owner-info`);
}
