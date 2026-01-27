"use server";
import api from "@/components/services/api";
import { revalidatePath } from "next/cache";

// GET USER PROFILE ACTION
export async function getProfile() {
  try {
    const response = await api.get("/me");
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Failed to fetch profile",
    };
  }
}

// UPDATE USER PROFILE ACTION
export async function updateProfileAction(formData: FormData) {
  try {
    // We send the formData directly so Axios sets the correct 'multipart/form-data' boundary
    const response = await api.put("/update-profile", formData);

    revalidatePath("/");
    return {
      success: true,
      data: response.data.data,
      message: response.data.meta.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Update failed",
    };
  }
}

// CHANGE PASSWORD ACTION
export async function changePasswordAction(payload: {
  oldPassword: string;
  newPassword: string;
}) {
  try {
    // Standard PUT/POST request with JSON payload
    const response = await api.put("/change-password", payload);

    revalidatePath("/");

    return {
      success: true,
      data: response.data.data,
      message: response.data.meta?.message || "Password updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.meta?.message || "Failed to update password",
    };
  }
}

// UPLOAD KYC ACTION
export async function uploadKycAction(formData: FormData) {
  try {
    // The payload contains documentType and documentFile
    const response = await api.post("/kyc", formData);

    revalidatePath("/");

    return {
      success: true,
      data: response.data.data,
      message: response.data.meta?.message || "Document uploaded successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Upload failed",
    };
  }
}

// GET KYC STATUS ACTION
export async function getKycStatus() {
  try {
    const response = await api.get("/kyc/me");
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.meta?.message || "Failed to fetch KYC status",
    };
  }
}

// ADD CARD ACTION
export async function addCardAction(payload: {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  isDefault: boolean;
  cardType: string;
}) {
  try {
    const response = await api.post("/cards", payload);

    revalidatePath("/");
    return {
      success: true,
      message: response.data.meta?.message || "Card saved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Failed to save card",
    };
  }
}

// GET ALL CARDS ACTION
export async function getMyCardsAction() {
  try {
    const response = await api.get("/cards/me");
    return {
      success: true,
      data: response.data.data, // This is the array of cards
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Failed to fetch cards",
      data: [],
    };
  }
}

// UPDATE CARD ACTION
export async function updateCardAction(
  id: string,
  payload: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    isDefault: boolean;
    cardType: string;
  },
) {
  try {
    const response = await api.put(`/cards/${id}`, payload);
    revalidatePath("/");
    return {
      success: true,
      message: response.data.meta?.message || "Card updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Failed to update card",
    };
  }
}

// DELETE CARD ACTION
export async function deleteCardAction(id: string) {
  try {
    const response = await api.delete(`/cards/${id}`);

    revalidatePath("/");
    return {
      success: true,
      message: response.data.meta?.message || "Card deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.meta?.message || "Failed to delete card",
    };
  }
}
