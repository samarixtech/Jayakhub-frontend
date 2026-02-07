"use server";

import { serverApi } from "@/components/services/api";

// CREATE CUSTOMER ADDRESS ACTION
export async function createUserAddress(data: {
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
}) {
  try {
    const api = await serverApi();
    const response = await api.post("/create-user-address", data);
    return response.data;
  } catch (error: any) {
    console.error("Create Address Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create address",
    );
  }
}

// GET CUSTOMER ADDRESS ACTION
export async function getUserAddresses(): Promise<{
  data: {
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
  }[];
}> {
  try {
    const api = await serverApi();
    const response = await api.get("/user-address");
    return response.data as {
      data: {
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
      }[];
    };
  } catch (error: any) {
    console.error("Get Addresses Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch addresses",
    );
  }
}
// UPDATE CUSTOMER ADDRESS ACTION
export async function updateUserAddress(
  id: string,
  data: {
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
  },
) {
  try {
    const api = await serverApi();
    const response = await api.put(`/update-user-address/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update Address Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update address",
    );
  }
}

// DELETE CUSTOMER ADDRESS ACTION
export async function deleteUserAddress(id: string) {
  try {
    const api = await serverApi();
    const response = await api.delete(`/delete-user-address/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Address Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete address",
    );
  }
}
