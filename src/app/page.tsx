import { redirect } from "next/navigation";
import { detectLocationAction } from "@/app/actions/public/detect";

export default async function HomePage() {
  // Use the server action which handles cookies and API call
  const result = await detectLocationAction();

  let country = "pk"; // Default fallback
  let language = "en";

  if (result.success && result.data) {
    country = result.data.code.toLowerCase();
    language = result.data.language.toLowerCase();
  }

  console.log(
    "HomePage Redirecting to:",
    `/${country}/${language}/restaurants`,
  );

  redirect(`/${country}/${language}/restaurants`);
}
