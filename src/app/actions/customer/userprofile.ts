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

export interface UpdateProfileInputData {
  name: string;
  lastName?: string;
  phone?: string;
  avatarBase64?: string;
  avatarName?: string;
}

// ==================== UPDATE USER PROFILE ====================
export async function updateProfileAction(
  payload: UpdateProfileInputData,
): Promise<ActionResponse> {
  const validation = validateSchema(
    updateProfileSchema.omit({ avatar: true }),
    payload,
  );
  if (!validation.success) {
    console.log("====================");
    console.log(validation.errors);
    return {
      success: false,
      message: validation.errors[0],
      errors: validation.errors,
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();

      const rawPhone = payload.phone?.replace(/\D/g, "");
      const updatePayload: any = {
        name: payload.name,
        lastName: payload.lastName,
      };
      if (rawPhone) {
        updatePayload.phone = Number(rawPhone);
      }

      console.log("update payload", updatePayload);

      const profileResult = await api.put("/update-profile", updatePayload);

      if (payload.avatarBase64) {
        const base64Data = payload.avatarBase64.split(",")[1];
        const mimeType = payload.avatarBase64
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const buffer = Buffer.from(base64Data, "base64");

        const { default: NodeFormData } = await import("form-data");
        const avatarFormData = new NodeFormData();
        avatarFormData.append("avatar", buffer, {
          filename: payload.avatarName || "avatar.jpg",
          contentType: mimeType || "image/jpeg",
          knownLength: buffer.length,
        });

        return api.put("/update-profile", avatarFormData, {
          headers: avatarFormData.getHeaders(),
        });
      }

      return profileResult;
    },
    "Profile updated successfully",
    async (data) => {
      revalidatePath("/", "layout");

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
export async function uploadKycAction(payload: {
  documentType: string;
  documentFile: string; // base64
  fileName: string;
  fileType: string;
}): Promise<ActionResponse> {
  return responseHandler(
    async () => {
      const { documentType, documentFile, fileName, fileType } = payload;

      if (!documentFile) {
        throw new Error("KYC Document (PDF or Image) is required");
      }

      const buffer = Buffer.from(documentFile, "base64");

      const { default: NodeFormData } = await import("form-data");
      const sendData = new NodeFormData();
      sendData.append("documentType", documentType);
      sendData.append("documentFile", buffer, {
        filename: fileName,
        contentType: fileType || "application/octet-stream",
        knownLength: buffer.length,
      });

      const api = await serverApi();
      return api.post("/kyc", sendData, {
        headers: sendData.getHeaders(),
      });
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
