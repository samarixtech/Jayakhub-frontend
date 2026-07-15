"use server";

import { serverApi } from "@/components/services/api";

interface AddressPayload {
  label: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  noteToCourier: string;
  latitude: number;
  longitude: number;
  status: boolean;
}

interface AddressRecord {
  id: string;
  label: string;
  streetAddress: string;
  apartment: string;
  city: string;
  stateProvince: string;
  zipCode: string;
  country: string;
  status: boolean;
  latitude: number | string;
  longitude: number | string;
  noteToCourier: string;
}

// CREATE CUSTOMER ADDRESS ACTION
export async function createUserAddress(data: AddressPayload) {
  try {
    const api = await serverApi();
    const response = await api.post("/create-user-address", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Create Address Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create address",
    };
  }
}

// GET CUSTOMER ADDRESS ACTION
export async function getUserAddresses(): Promise<{
  success: boolean;
  data: AddressRecord[];
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get("/user-address");
    const resData = response.data as { data: AddressRecord[] };
    return { success: true, data: resData?.data || [] };
  } catch (error: any) {
    console.error("Get Addresses Error:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to fetch addresses",
    };
  }
}

// UPDATE CUSTOMER ADDRESS ACTION
export async function updateUserAddress(id: string, data: AddressPayload) {
  try {
    const api = await serverApi();
    const response = await api.put(`/update-user-address/${id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Update Address Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update address",
    };
  }
}

// DELETE CUSTOMER ADDRESS ACTION
export async function deleteUserAddress(id: string) {
  try {
    const api = await serverApi();
    const response = await api.delete(`/delete-user-address/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Delete Address Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete address",
    };
  }
}
