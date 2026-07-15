import SocketProvider from "@/components/providers/SocketProvider";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const restaurantId = cookieStore.get("restaurantId")?.value || "";

  return (
    <SocketProvider token={token} restaurantId={restaurantId}>
      {children}
    </SocketProvider>
  );
}
