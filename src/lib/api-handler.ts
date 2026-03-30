/*
 * @DESC: API HANDLER IS USED HERE TO HANDLE THE API REQUESTS
 */

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

    return {
      success: true,
      message: response.data?.meta?.message || "Success",
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    // console.error("API Error:", error.message);

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
