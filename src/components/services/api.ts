import axios from "axios";

const API_BASE_URL = "http://192.168.100.9:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {};
    }

    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized request. Redirecting to login...");
          localStorage.removeItem("token");
          // window.location.href = "/login";
          break;

        case 403:
          console.error(
            "Forbidden: You don't have permission to access this resource"
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
            error.response.data
          );
      }
    } else if (error.request) {
      console.error(
        "No response received from server. Please check your connection."
      );
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
