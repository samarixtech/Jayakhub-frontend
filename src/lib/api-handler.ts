// @/lib/api-handler.ts

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export async function handleApiRequest<T>(
  requestFn: () => Promise<any>,
): Promise<ActionResponse<T>> {
  try {
    const response = await requestFn();

    // Adjust these keys based on your actual Backend JSON structure
    return {
      success: true,
      message: response.data?.meta?.message || "Success",
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    const message =
      error.response?.data?.meta?.message ||
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    return {
      success: false,
      message,
      errors: error.response?.data?.errors, // For validation errors
    };
  }
}
