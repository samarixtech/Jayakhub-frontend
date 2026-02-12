"use server";

import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";
import { ActionResponse } from "@/lib/utils/response-handler";

interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  status: boolean;
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

// ==================== CREATE RESTAURANT USER ACTIONS ====================
export async function createRestaurantUserAction(
  payload: CreateUserPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.post("/create-restaurant-user", { ...payload, restaurantId }),
    "User created successfully",
    "/restaurant/users",
  );
}

// ==================== GET RESTAURANT USERS ACTIONS ====================
export async function getRestaurantUsersAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.get("/get-user-restaurant", { params: { restaurantId } }),
    "Users fetched successfully",
  );
}

// ==================== UPDATE RESTAURANT USER ACTIONS ====================
export async function updateRestaurantUserAction(
  payload: UpdateUserPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.put(`/update-restaurant-user/${payload.id}`, {
        ...payload,
        restaurantId,
      }),
    "User updated successfully",
    "/restaurant/users",
  );
}

// ==================== GET RESTAURANT USER BY ID ACTIONS ====================
export async function getRestaurantUserByIdAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.get(`/get-restaurant-user/${id}`),
    "User fetched successfully",
  );
}

// ==================== DELETE RESTAURANT USER ACTIONS ====================
export async function deleteRestaurantUserAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.delete(`/delete-restaurant-user/${id}`),
    "User deleted successfully",
    "/restaurant/users",
  );
}
