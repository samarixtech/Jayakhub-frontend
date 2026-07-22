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

    // x-forwarded-for is a hop-by-hop list ("client, proxy1, proxy2, ..."):
    // each proxy APPENDS the IP of whoever connected to it. Behind a single
    // trusted reverse proxy directly in front of the app (e.g. an AWS ALB,
    // with no CDN/other proxy in the chain), the LAST entry is the one that
    // proxy itself observed and can be trusted — earlier entries can be
    // freely set by the client and must not be trusted for anything
    // security-sensitive (geolocation-based pricing, fraud checks, etc.).
    const parts = holder
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const trustedIp = parts[parts.length - 1];

    // Ignore internal loopback addresses and empty strings
    if (trustedIp && trustedIp !== "::1" && trustedIp !== "127.0.0.1") {
      return trustedIp;
    }
  }

  return null;
}
