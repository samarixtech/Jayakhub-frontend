"use server";
import { serverApi } from "@/components/services/api";
import { revalidatePath } from "next/cache";
import {
  updateProfileSchema,
  changePasswordSchema,
  addCardSchema,
  ChangePasswordInput,
  AddCardInput,
} from "@/lib/schemas/profile";
import { validateSchema } from "@/lib/validator";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

// ==================== GET USER PROFILE ====================
export async function getProfile(): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.get("/me");
  }, "Profile fetched successfully");
}

// ==================== UPDATE USER PROFILE ====================
export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResponse> {
  const payload = {
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
  };
  const validation = validateSchema(
    updateProfileSchema.omit({ avatar: true }),
    payload,
  );
  if (!validation.success) {
    return {
      success: false,
      message: "Validation Validation failed",
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.put("/update-profile", formData);
    },
    "Profile updated successfully",
    (data) => {
      revalidatePath("/");
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

// ==================== ADD CARD ====================
export async function addCardAction(
  data: AddCardInput,
): Promise<ActionResponse> {
  const validation = validateSchema(addCardSchema, data);
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
      return api.post("/cards", data);
    },
    "Card saved successfully",
    () => revalidatePath("/"),
  );
}

// ==================== GET ALL CARDS ====================
export async function getMyCardsAction(): Promise<ActionResponse> {
  return responseHandler(async () => {
    const api = await serverApi();
    return api.get("/cards/me");
  }, "Cards fetched successfully");
}

// ==================== UPDATE CARD ====================
export async function updateCardAction(
  id: string,
  data: AddCardInput,
): Promise<ActionResponse> {
  const validation = validateSchema(addCardSchema, data);
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
      return api.put(`/cards/${id}`, data);
    },
    "Card updated successfully",
    () => revalidatePath("/"),
  );
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
