export type ActionResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  suggestion?: string[];
  errors?: string[];
  statusCode?: number;
};

export async function responseHandler<T>(
  apiCall: () => Promise<any>,
  successMessage?: string,
  transformData?: (data: any) => T | Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const response = await apiCall();

    const responseData = response.data || response;

    // Check if meta.status exists (API convention in this project)
    if (responseData.meta && responseData.meta.status >= 400) {
      throw {
        response: {
          data: responseData,
        },
      };
    }

    const resolvedData = transformData
      ? await transformData(responseData.data)
      : responseData.data;

    return {
      success: true,
      message:
        responseData.meta?.message || successMessage || "Operation successful",
      data: resolvedData,
      suggestion: responseData.suggestion,
      statusCode: responseData.meta?.status || 200,
    };
  } catch (error: any) {
    if (error.response?.status !== 401) {
      console.error("Action Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        isSyntaxError: error instanceof SyntaxError,
      });
    }

    let message = "Something went wrong. Please try again.";
    let errors: string[] | undefined;
    let statusCode = 500;

    if (error.response?.data) {
      const errData = error.response.data;
      message = errData.meta?.message || errData.message || message;
      statusCode = errData.meta?.status || error.response.status || 500;

      // Suppress 401 error logging for public pages where auth is optional
      if (statusCode !== 401) {
        console.error(`[ResponseHandler] Error for URL: ${error.config?.url}`, {
          statusCode,
          message,
        });
      }

      // If there are detailed validation errors in data
      if (errData.data && typeof errData.data.message === "string") {
        message = errData.data.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
      errors,
      statusCode,
    };
  }
}
