"use server";

import { serverApi } from "@/components/services/api";
import { ActionResponse } from "@/lib/utils/response-handler";

export interface OnboardingPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  latitude: string;
  longitude: string;
  type: string;
  description: string;
  websiteUrl?: string;
  timezone?: string;
  schedules: string;
  ownerPhone: string;
  ownerName: string;
  accountHolderName: string;
  accountType: string;
  bankName: string;
  iban: string;
  // Profile / banner images
  profileImageBase64?: string;
  profileImageName?: string;
  profileImageType?: string;
  bannerImageBase64?: string;
  bannerImageName?: string;
  bannerImageType?: string;
  // KYC document
  kycDocumentType?: string;
  kycDocumentBase64?: string;
  kycDocumentName?: string;
  kycDocumentFileType?: string;
  // Business document (food license etc.)
  docDocumentType?: string;
  docDocumentBase64?: string;
  docDocumentName?: string;
  docDocumentFileType?: string;
}

export async function registerRestaurantOnboardingAction(
  payload: OnboardingPayload,
): Promise<ActionResponse> {
  try {
    const { default: NodeFormData } = await import("form-data");
    const sendData = new NodeFormData();

    // Text fields
    sendData.append("name", payload.name);
    sendData.append("email", payload.email);
    sendData.append("phone", payload.phone);
    sendData.append("address", payload.address);
    sendData.append("country", payload.country);
    sendData.append("latitude", payload.latitude);
    sendData.append("longitude", payload.longitude);
    sendData.append("type", payload.type);
    sendData.append("description", payload.description);
    if (payload.websiteUrl) sendData.append("websiteUrl", payload.websiteUrl);
    if (payload.timezone) sendData.append("timezone", payload.timezone);
    sendData.append("schedules", payload.schedules);
    sendData.append("ownerPhone", payload.ownerPhone);
    sendData.append("ownerName", payload.ownerName);
    sendData.append("accountHolderName", payload.accountHolderName);
    sendData.append("accountType", payload.accountType);
    sendData.append("bankName", payload.bankName);
    sendData.append("iban", payload.iban);

    // Profile image
    if (payload.profileImageBase64) {
      const buffer = Buffer.from(payload.profileImageBase64, "base64");
      sendData.append("profileImage", buffer, {
        filename: payload.profileImageName || "profile.jpg",
        contentType: payload.profileImageType || "image/jpeg",
        knownLength: buffer.length,
      });
    }

    // Banner image
    if (payload.bannerImageBase64) {
      const buffer = Buffer.from(payload.bannerImageBase64, "base64");
      sendData.append("bannerImage", buffer, {
        filename: payload.bannerImageName || "banner.jpg",
        contentType: payload.bannerImageType || "image/jpeg",
        knownLength: buffer.length,
      });
    }

    // KYC document
    if (payload.kycDocumentBase64 && payload.kycDocumentType) {
      sendData.append("documentType", payload.kycDocumentType);
      const buffer = Buffer.from(payload.kycDocumentBase64, "base64");
      sendData.append("documentFile", buffer, {
        filename: payload.kycDocumentName || "kyc_document",
        contentType: payload.kycDocumentFileType || "application/octet-stream",
        knownLength: buffer.length,
      });
    }

    // Business document
    if (payload.docDocumentBase64 && payload.docDocumentType) {
      sendData.append("documentType", payload.docDocumentType);
      const buffer = Buffer.from(payload.docDocumentBase64, "base64");
      sendData.append("documentFile", buffer, {
        filename: payload.docDocumentName || "business_document",
        contentType: payload.docDocumentFileType || "application/octet-stream",
        knownLength: buffer.length,
      });
    }

    const api = await serverApi();
    const response = await api.post("/onboarding/register", sendData, {
      headers: sendData.getHeaders(),
    });

    console.log(response);


    return {
      success: true,
      message: response?.data?.meta?.message || "Application Submitted Successfully!",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Onboarding Error:", error?.response?.data || error.message);
    return {
      success: false,
      message:
        error?.response?.data?.meta?.message ||
        error?.response?.data?.message ||
        "Failed to submit application",
      errors: error?.response?.data?.errors || [],
    };
  }
}
