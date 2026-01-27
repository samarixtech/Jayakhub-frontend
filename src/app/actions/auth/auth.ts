"use server";
import api from "@/components/services/api";
import { UserRole } from "@/config/role-map.config";
import { cookies } from "next/headers";

interface ApiResponse {
  meta: {
    status: number;
    message?: string;
  };
  data: {
    identifier: string;
    message?: string;
  };
}

export interface VerifyOtpState {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: {
      role: string;
      id: string;
      email: string;
    };
  };
}

export interface ResendOtpState {
  success: boolean;
  message?: string;
}

export interface RegisterActionState {
  success: boolean;
  message?: string;
  data?: {
    email: string;
    message?: string;
  };
}

export interface ForgotPasswordState {
  success: boolean;
  message?: string;
  data?: {
    email: string;
  };
}

export interface ResetPasswordState {
  success: boolean;
  message?: string;
}

// ==================== LOGIN ACTION ====================
export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<ApiResponse>("/login", {
      identifier: email,
      password,
    });
    console.log(response);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          data?: { message?: string };
          meta?: { message?: string };
        };
      };
    };

    return {
      success: false,
      message:
        err.response?.data?.data?.message ||
        err.response?.data?.meta?.message ||
        "Login failed",
    };
  }
}

// ==================== VERIFY OTP ACTION ====================
export async function verifyOtpAction(payload: { email: string; otp: string }) {
  try {
    const response = await api.post<ApiResponse>("/verify-otp", {
      identifier: payload.email,
      otp: payload.otp,
    });

    const cookieStore = await cookies();
    const data = response.data.data;

    if (data?.accessToken) {
      cookieStore.set("token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (data.user?.role) {
        cookieStore.set("role", data.user.role, { path: "/" });
      }
    }

    return {
      success: true,
      data: data,
      message: response.data.meta?.message || "Verification successful",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { meta?: { message?: string } };
      };
    };

    return {
      success: false,
      message: err.response?.data?.meta?.message || "Verification failed",
    };
  }
}

// ==================== RESEND OTP ACTION ====================
export async function resendOtpAction(email: string): Promise<ResendOtpState> {
  try {
    const response = await api.post<ApiResponse>("/resend-otp", {
      identifier: email,
    });

    return {
      success: true,
      message: response.data?.meta?.message || "OTP resent successfully",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { meta?: { message?: string } };
      };
    };

    return {
      success: false,
      message: err.response?.data?.meta?.message || "Failed to resend code",
    };
  }
}

// ==================== REGISTER ACTION ====================
export async function registerAction(
  _: unknown,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  try {
    const response = await api.post<ApiResponse>("/register", {
      name,
      email,
      password,
      phone,
      role: "customer",
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.meta?.message || "Registration successful",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          data?: { message?: string };
          meta?: { message?: string };
        };
      };
    };

    return {
      success: false,
      message:
        err.response?.data?.data?.message ||
        err.response?.data?.meta?.message ||
        "Registration failed",
    };
  }
}

// ==================== FORGOT PASSWORD ACTION ====================
export async function forgotPasswordAction(
  _: unknown,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  try {
    const response = await api.post<ApiResponse>("/forgot-password", {
      identifier: email,
    });

    return {
      success: true,
      message: response.data?.meta?.message || "Reset code sent!",
      data: { email },
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { meta?: { message?: string } };
      };
    };

    return {
      success: false,
      message: err.response?.data?.meta?.message || "Failed to send reset code",
    };
  }
}

// ==================== RESET PASSWORD ACTION (UPDATE/SET NEW PASSWORD) ====================
export async function resetPasswordAction(payload: {
  password: string;
}): Promise<ResetPasswordState> {
  try {
    const response = await api.post<ApiResponse>("/set-new-password", {
      password: payload.password,
    });

    return {
      success: true,
      message: response.data?.meta?.message || "Password updated successfully!",
    };
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { meta?: { message?: string } };
      };
    };
    console.log(err);

    return {
      success: false,
      message:
        err.response?.data?.meta?.message || "Reset failed. Please try again.",
    };
  }
}

// ==================== RESTAURANT REGISTER ACTION ====================
export async function registerRestaurantAction(
  _: unknown,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  try {
    const response = await api.post<ApiResponse>("/register", {
      name,
      email,
      password,
      phone,
      role: "restaurant-owner",
    });

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.meta?.message || "Restaurant registration successful",
    };
  } catch (error: unknown) {
    const err = error as any;
    return {
      success: false,
      message:
        err.response?.data?.data?.message ||
        err.response?.data?.meta?.message ||
        "Registration failed",
    };
  }
}

// ==================== GOOGLE AUTH ACTION ====================
export async function googleAuthAction(payload: {
  email: string;
  name: string;
  picture: string;
  token: string;
}) {
  try {
    const response = await api.post("/google-auth", payload);
    const responseData = response.data;

    // Based on your JSON example, successful login is status 200
    if (responseData.meta.status === 200 || responseData.meta.status === 201) {
      const { accessToken, user } = responseData.data;

      if (accessToken && user?.role) {
        const cookieStore = await cookies();

        // Set secure HttpOnly cookie
        cookieStore.set("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        // Set role cookie (useful for middleware/client checks)
        cookieStore.set("role", user.role, { path: "/" });

        return {
          success: true,
          role: user.role as UserRole, // customer or restaurant_owner
        };
      }
    }
    return {
      success: false,
      message: responseData.meta.message || "Auth failed",
    };
  } catch (error: any) {
    return { success: false, message: "Internal Server Error" };
  }
}
