import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface DetectApiResponse {
  data: {
    country: string;
    code: string;
    language: string;
    isActive: boolean;
  };
}

export default async function HomePage() {
  const cookieStore = cookies();
  const countryCookie = (await cookieStore).get("USER_COUNTRY")?.value;
  const langCookie = (await cookieStore).get("NEXT_LOCALE")?.value;

  let country = "pakistan";
  let language = "en";

  // 1. Try Cookies first
  if (countryCookie && langCookie) {
    country = countryCookie.toLowerCase();
    language = langCookie.toLowerCase();
  } else {
    // 2. Try API if no cookies
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const res = await fetch("http://192.168.100.9:5000/api/v1/detect", {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = (await res.json()) as DetectApiResponse;
        if (json.data && json.data.isActive) {
          country = json.data.code.toLowerCase();
          language = (json.data.language || "en").toLowerCase();
        }
      }
    } catch (error) {
       // Ignore error, fallback will be used
       console.error("Locale detection failed, using fallback:", error);
    }
  }

  console.log("DEBUG: HomePage Redirecting to:", `/${country}/${language}/restaurants`);
  
  // 3. Redirect
  redirect(`/${country}/${language}/restaurants`);
}
