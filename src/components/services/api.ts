import axios from "axios";

const API_BASE_URL = "http://192.168.100.9:5000/api/v1";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
});

// Interceptor to attach token (client-only)
api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    // ⚠️ Only access sessionStorage if in browser
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
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
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            // window.location.href = "/login";
          }
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

api.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    if (typeof window !== "undefined") {
      // 1. CLIENT SIDE: Read from document.cookie
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      token = match ? decodeURIComponent(match[2]) : undefined;
    } else {
      // 2. SERVER SIDE: Dynamically import next/headers
      // This prevents the bundler from leaking server code to the client
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("token")?.value;
      } catch (e) {
        console.error("Failed to read cookies on server:", e);
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
export default api;
