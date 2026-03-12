"use server";
import { serverApi } from "@/components/services/api";
import { revalidatePath } from "next/cache";
import {
  updateProfileSchema,
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/schemas/profile";
import { validateSchema } from "@/lib/validator";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

// ==================== SET NEW PASSWORD (GOOGLE LOGIN) ====================
export async function setNewPasswordAction(
  password: string,
): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.post("/set-new-password", { password });
  }, "Password set successfully");
}

// ==================== GET USER PROFILE ====================
export async function getProfile(): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/me");
    },
    "Profile fetched successfully",
    async (data) => {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const role = cookieStore.get("role")?.value;

      if (role && data && typeof data === "object") {
        return { ...data, role };
      }
      return data;
    },
  );
}

// ==================== UPDATE USER PROFILE ====================
export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResponse> {
  const payload = {
    name: formData.get("name")?.toString() || "",
    lastName: formData.get("lastName")?.toString() || undefined,
    phone: formData.get("phone")?.toString() || "",
  };
  const validation = validateSchema(
    updateProfileSchema.omit({ avatar: true }),
    payload,
  );
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      const avatar = formData.get("avatar");

      // 1. ALWAYS send JSON first to update text fields properly
      // This bypasses FormData stringification and satisfies backend's strict numeric type requirement for phone
      const profileResult = await api.put("/update-profile", {
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        phone: Number(formData.get("phone")?.toString().replace(/\D/g, "")),
      });

      // 2. If an avatar is present, send a SECOND request via FormData (WITHOUT text fields)
      // This prevents the backend from validating a stringified phone number during file upload
      if (avatar && avatar instanceof File && avatar.size > 0) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatar);
        return api.put("/update-profile", avatarFormData);
      }

      return profileResult;
    },
    "Profile updated successfully",
    async (data) => {
      // Revalidate to force a rerender and refresh data on client
      revalidatePath("/", "layout");

      // Harmonize role field with getProfile (ensure it's a string from cookies)
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const role = cookieStore.get("role")?.value;

      const user = data?.user || data;
      if (role && user && typeof user === "object") {
        return { ...data, user: { ...user, role } };
      }
      return data;
    },
  );
}

// ==================== CHANGE PASSWORD ====================
export async function changePasswordAction(
  data: ChangePasswordInput,
): Promise<ActionResponse> {
  const validation = validateSchema(changePasswordSchema, data);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.put("/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    },
    "Password updated successfully",
    (result) => {
      revalidatePath("/");
      return result;
    },
  );
}

// ==================== UPLOAD KYC ====================
export async function uploadKycAction(
  formData: FormData,
): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.post("/kyc", formData);
    },
    "Document uploaded successfully",
    (data) => {
      revalidatePath("/");
      return data;
    },
  );
}

// ==================== GET KYC STATUS ====================
export async function getKycStatus(): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.get("/kyc/me");
  }, "KYC status fetched");
}

// ==================== GET ALL CARDS ====================
export async function getMyCardsAction(): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.get("/cards/me");
  }, "Cards fetched successfully");
}

// ==================== DELETE CARD ====================
export async function deleteCardAction(id: string): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.delete(`/cards/${id}`);
    },
    "Card deleted successfully",
    () => revalidatePath("/"),
  );
}
