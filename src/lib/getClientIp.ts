import { headers } from "next/headers";

/**
 * Robustly identify the client's IP address across different hosting environments.
 * It checks standard and platform-specific headers (Cloudflare, Vercel, Hostinger proxies).
 *
 * @param customHeaders Optional headers to use (e.g. from Middleware request)
 */
export default async function getClientIp(customHeaders?: Headers) {
  // If headers are passed (middle-ware), use them. Otherwise, fall back to next/headers
  const headersList = customHeaders || (await headers());

  const ipHolders = [
    headersList.get("cf-connecting-ip"), // Cloudflare
    headersList.get("x-client-ip"), // Alternative proxy header
    headersList.get("x-real-ip"), // Standard Proxy / Nginx
    headersList.get("x-forwarded-for"), // Standard LB header (comma list)
    headersList.get("true-client-ip"), // Akamai / Cloudflare
    headersList.get("x-cluster-client-ip"), // Localized proxy header
    headersList.get("forwarded-for"), // Generic fallback
  ];

  for (const holder of ipHolders) {
    if (!holder) continue;

    // x-forwarded-for can be a list: "client, proxy1, proxy2"
    const firstIp = holder.split(",")[0].trim();

    // Ignore internal loopback addresses and empty strings
    if (firstIp && firstIp !== "::1" && firstIp !== "127.0.0.1") {
      return firstIp;
    }
  }

  return null;
}
