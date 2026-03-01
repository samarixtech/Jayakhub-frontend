import { useRouter, useParams } from "next/navigation";
import useLocale from "@/hooks/useLocals";

export interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(userRole: string, onNavigate?: () => void) {
  const router = useRouter();
  const { country: localeCountry, language: localeLanguage } = useLocale();
  const params = useParams();

  const country = (params?.country as string) || localeCountry || "pk";
  const language = (params?.language as string) || localeLanguage || "en";

  const handleNotificationClick = (notification: Notification) => {
    // Determine route based on notification content
    const title = notification.title.toLowerCase();
    const body = notification.body.toLowerCase();

    let path = "";
    const isRestaurant = userRole === "restaurant_owner";
    const basePath = `/${country}/${language}/${isRestaurant ? "restaurant" : "customer"}`;

    if (
      title.includes("rating") ||
      title.includes("review") ||
      body.includes("rating") ||
      body.includes("review")
    ) {
      // Navigate to reviews page
      path = isRestaurant ? `${basePath}/reviews` : `${basePath}/orders`; // Customers usually see reviews on their past orders
    } else if (
      title.includes("order") ||
      body.includes("order") ||
      title.includes("accepted") ||
      title.includes("rejected")
    ) {
      // Navigate to orders page
      path = isRestaurant ? `${basePath}/orders` : `${basePath}/order-history`;
    }

    if (path) {
      router.push(path);
      if (onNavigate) {
        onNavigate(); // Close the dropdown/panel
      }
    }
  };

  return { handleNotificationClick };
}
