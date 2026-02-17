import axios from "axios";
import https from "https";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const agent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

// Server-side API wrapper that auto-attaches token from cookies
export async function serverApi() {
  const token = await getServerToken();

  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status !== 401) {
        console.error("API Error:", error.response.status, error.response.data);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export default api;
