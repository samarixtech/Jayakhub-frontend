import { headers } from "next/headers";

// HELPER FUNCTION TO GET CLIENT IP ADDRESS
export default async function getClientIp() {
  const headersList = await headers();

  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim(); // first IP is client
  }

  if (realIp) {
    return realIp;
  }

  return null;
}
