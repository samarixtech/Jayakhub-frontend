"use server";
import api from "@/components/services/api";
import { cookies } from "next/headers";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/schemas/auth";
import { validateSchema } from "@/lib/validator";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

// ==================== LOGIN ACTION ====================
export async function loginAction(data: LoginInput): Promise<ActionResponse> {
  const validation = validateSchema(loginSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () =>
      api.post("/login", { identifier: data.email, password: data.password }),
    "Login successful",
    async (responseData: any) => {
      const userId =
        responseData?.id || responseData?.userId || responseData?.user?.id;
      if (userId) {
        const cookieStore = await cookies();
        cookieStore.set("tempUserId", userId, { path: "/" });
      }
      return { ...responseData, identifier: data.email };
    },
  );
}

// ==================== VERIFY OTP ACTION ====================
export async function verifyOtpAction(payload: {
  otp: string;
}): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("tempUserId")?.value;

  if (!userId) {
    return {
      success: false,
      message: "Session expired or missing. Please login again.",
    };
  }

  return responseHandler(
    async () => api.post("/verify-otp", { userId, otp: payload.otp }),
    "Verification successful",
    async (data: any) => {
      // Side effect: Set Cookies
      if (data?.accessToken) {
        const cookieStore = await cookies();
        cookieStore.set("token", data.accessToken, {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === "production" &&
            process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https"),
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        if (data.user?.role) {
          cookieStore.set("role", data.user.role, { path: "/" });
        }
      }
      cookieStore.delete("tempUserId"); // Clean up temp cookie
     

      return data;
    },
  );
}

// ==================== RESEND OTP ACTION ====================
export async function resendOtpAction(email: string): Promise<ActionResponse> {
  return responseHandler(
    async () => api.post("/resend-otp", { identifier: email }),
    "OTP resent successfully",
  );
}

// ==================== REGISTER ACTION ====================
export async function registerAction(
  data: RegisterInput,
): Promise<ActionResponse> {
  const validation = validateSchema(registerSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () =>
      api.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: Number(data.phone.replace(/\D/g, "")),
        role: "customer",
      }),
    "Registration successful",
    async (responseData: any) => {
      const userId =
        responseData?.id || responseData?.userId || responseData?.user?.id;
      if (userId) {
        const cookieStore = await cookies();
        cookieStore.set("tempUserId", userId, { path: "/" });
      }
      return { ...responseData, email: data.email };
    },
  );
}

// ==================== FORGOT PASSWORD ACTION ====================
export async function forgotPasswordAction(
  data: ForgotPasswordInput,
): Promise<ActionResponse> {
  const validation = validateSchema(forgotPasswordSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => api.post("/forgot-password", { identifier: data.email }),
    "Reset code sent!",
    () => ({ email: data.email }), // Pass back email for next step
  );
}

// ==================== RESET PASSWORD ACTION ====================
export async function resetPasswordAction(
  data: ResetPasswordInput,
): Promise<ActionResponse> {
  const validation = validateSchema(resetPasswordSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      success: false,
      message: "Session expired or invalid. Please verify OTP again.",
    };
  }

  return responseHandler(
    async () =>
      api.post(
        "/set-new-password",
        { password: data.password },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    "Password updated successfully!",
  );
}

// ==================== RESTAURANT REGISTER ACTION ====================
export async function registerRestaurantAction(
  data: RegisterInput & { role?: string },
): Promise<ActionResponse> {
  // Reuse register schema for basic fields, or define a new one if needed
  const validation = validateSchema(registerSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () =>
      api.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: Number(data.phone.replace(/\D/g, "")),
        role: "restaurant_owner",
      }),
    "Restaurant registration successful",
    async (responseData: any) => {
      const userId =
        responseData?.id || responseData?.userId || responseData?.user?.id;
      if (userId) {
        const cookieStore = await cookies();
        cookieStore.set("tempUserId", userId, { path: "/" });
      }
      return { ...responseData, email: data.email };
    },
  );
}

// ==================== GOOGLE AUTH ACTION ====================
export async function googleAuthAction(payload: {
  email: string;
  name: string;
  picture: string;
  token: string;
  role?: string; // This is already here, let's make sure it's used
}): Promise<ActionResponse> {
  return responseHandler(
    async () =>
      api.post("/google-auth", {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        token: payload.token,
        role: payload.role, // Explicitly ensure this is sent to your backend
      }),
    "Auth Successful",
    async (data: any) => {
      const { accessToken, user } = data;
      // The backend should return the actual assigned role
      const assignedRole = user?.role || payload.role;

      if (accessToken && assignedRole) {
        const cookieStore = await cookies();
        cookieStore.set("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
        cookieStore.set("role", assignedRole, { path: "/" });

        return { role: assignedRole };
      }
      return data;
    },
  );
}

// ==================== LOGOUT ACTION ====================
export async function logoutAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return responseHandler(
    async () => api.post("/logout", { refreshToken: token }),
    "Logged out successfully",
    async (data) => {
      cookieStore.delete("token");
      cookieStore.delete("role");
      return data;
    },
  );
}
