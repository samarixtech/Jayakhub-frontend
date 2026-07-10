import axios from "axios";
import { toast } from "react-hot-toast";
// import https from "https"; // Removed for edge compatibility

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SERVER_BASE_URL = process.env.NEXT_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const AUTH_COOKIE_NAMES = ["token", "role", "planKeywords", "isExpired", "isCancelled", "restaurantId", "planCheckedAt"];

// Set alongside the cleared auth cookies (short-lived) so that even when a
// session gets killed purely server-side — during SSR/a Server Action, with
// no client JS around to show a toast immediately — proxy.ts can still see
// it on the very next request and tell the login page to show one.
export const SESSION_EXPIRED_FLAG_COOKIE = "authSessionExpired";

// Backend signals a killed/expired session (e.g. user deactivated from User
// Management) with { meta: { status: 403, message: "Session Expired" } } —
// sometimes as a real HTTP 403, sometimes embedded in an HTTP 200 body.
export function isSessionExpiredPayload(data: any): boolean {
  return (
    !!data?.meta &&
    data.meta.status === 403 &&
    /session\s*expired/i.test(data.meta.message || "")
  );
}

// Clears every auth cookie server-side (inside a Server Action's request
// lifecycle) so the *next* request proxy.ts sees has no token — its existing
// route guard then redirects to /login on its own.
async function clearServerAuthCookies() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    for (const name of AUTH_COOKIE_NAMES) {
      cookieStore.delete(name);
    }
    cookieStore.set(SESSION_EXPIRED_FLAG_COOKIE, "1", { path: "/", maxAge: 15 });
  } catch {
    // Not in a request context (e.g. build time) — nothing to clear.
  }
}

const agent =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? new (require("https").Agent)({
        rejectUnauthorized: process.env.NODE_ENV === "production",
      })
    : undefined;

const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 40000,
  httpsAgent: agent,
} as any);

// Helper function to get token from document.cookie (client-side only)
function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// Interceptor to attach token from cookies (client-side)
api.interceptors.request.use(
  (config) => {
    // On client side, read token from document.cookie
    if (typeof window !== "undefined") {
      const token = getClientToken();
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Handle FormData content type
    if (config.data instanceof FormData && config.headers) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Client-side helper: clears auth cookies in the browser and hard-redirects
// to /login. A hard navigation (not router.push) so proxy.ts sees a fresh
// request and adds the correct [country]/[language] prefix itself.
let clientSessionExpiredHandled = false;

function handleClientSessionExpired() {
  if (typeof window === "undefined" || clientSessionExpiredHandled) return;
  clientSessionExpiredHandled = true;
  AUTH_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
  toast.error("Session Expired");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1200);
}

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (isSessionExpiredPayload(response.data)) {
      handleClientSessionExpired();
    }
    return response;
  },
  (error) => {
    if (isSessionExpiredPayload(error.response?.data)) {
      handleClientSessionExpired();
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized request. Redirecting to login...");
          break;
        case 403:
          console.error(
            "Forbidden: You don't have permission to access this resource",
          );
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error(
            "API Error:",
            error.response.status,
            error.response.data,
          );
      }
    } else if (error.request) {
      console.error(
        "No response received from server. Please check your connection.",
      );
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Helper function to get token for server-side (Next.js cookies)
export async function getServerToken(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value || null;
  } catch {
    return null;
  }
}

// Cache server instances per token to reuse HTTP connections instead of
// opening a new socket on every server action call.
const serverInstanceCache = new Map<string, ReturnType<typeof axios.create>>();

export async function serverApi() {
  const token = await getServerToken();
  const cacheKey = token ?? "__no_token__";

  if (serverInstanceCache.has(cacheKey)) {
    return serverInstanceCache.get(cacheKey)!;
  }

  const instance = axios.create({
    baseURL: SERVER_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  instance.interceptors.response.use(
    async (response) => {
      if (isSessionExpiredPayload(response.data)) {
        await clearServerAuthCookies();
        serverInstanceCache.delete(cacheKey);
      }
      return response;
    },
    async (error) => {
      if (isSessionExpiredPayload(error.response?.data)) {
        await clearServerAuthCookies();
        serverInstanceCache.delete(cacheKey);
      }
      if (error.response && error.response.status !== 401) {
        console.error("API Error:", error.response.status, error.response.data);
      }
      return Promise.reject(error);
    },
  );

  serverInstanceCache.set(cacheKey, instance);
  return instance;
}

export default api;
