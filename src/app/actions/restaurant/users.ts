"use server";

import api from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  status: boolean;
}

export async function createRestaurantUserAction(
  payload: CreateUserPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  // API expects payload + restaurantId
  return responseHandler(
    async () =>
      api.post("/create-restaurant-user", { ...payload, restaurantId }),
    "User created successfully",
    async (data) => {
      revalidatePath("/restaurant/users");
      return data;
    },
  );
}

export async function getRestaurantUsersAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => api.get("/get-user-restaurant", { data: { restaurantId } }),
    "Users fetched successfully",
    async (data) => data,
  );
}

interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  status: boolean;
}

export async function updateRestaurantUserAction(
  payload: UpdateUserPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () =>
      api.put(`/update-restaurant-user/${payload.id}`, {
        ...payload,
        restaurantId,
      }),
    "User updated successfully",
    async (data) => {
      revalidatePath("/restaurant/users");
      return data;
    },
  );
}

export async function getRestaurantUserByIdAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => api.get(`/get-restaurant-user/${id}`),
    "User fetched successfully",
    async (data) => data,
  );
}

export async function deleteRestaurantUserAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => api.delete(`/delete-restaurant-user/${id}`),
    "User deleted successfully",
    async (data) => {
      revalidatePath("/restaurant/users");
      return data;
    },
  );
}
