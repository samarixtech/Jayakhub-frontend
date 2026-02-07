"use server";

import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface VariantOption {
  name: string;
  price: number;
}

interface CreateVariantGroupPayload {
  groupName: string;
  options: VariantOption[];
}

export async function createVariantGroupAction(
  payload: CreateVariantGroupPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return {
      success: false,
      message: "Restaurant ID not found. Please log in again.",
    };
  }

  const apiPayload = {
    restaurantId,
    groupName: payload.groupName,
    options: payload.options,
  };

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.post("/add-variant", apiPayload);
    },
    "Variant group created successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/variants");
      return data;
    },
  );
}

export async function getVariantGroupsAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return {
      success: false,
      message: "Restaurant ID not found",
    };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get(`/all-variant`, { params: { restaurantId } });
    },
    "Variants fetched successfully",
    async (data) => data,
  );
}
interface UpdateVariantGroupPayload {
  id: string;
  groupName: string;
  options: VariantOption[];
}

export async function updateVariantGroupAction(
  payload: UpdateVariantGroupPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.put("/update-variant", { ...payload, restaurantId });
    },
    "Variant group updated successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/variants");
      return data;
    },
  );
}

export async function deleteVariantGroupAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.delete(`/delete-group/${id}`);
    },
    "Variant group deleted successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/variants");
      return data;
    },
  );
}

// ==================== KEY CATEGORY ACTIONS ====================

interface AddCategoryPayload {
  categoryName: string;
}

export async function addCategoryAction(
  payload: AddCategoryPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.post("/add-category", {
        restaurantId,
        categoryName: payload.categoryName,
      });
    },
    "Category created successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/categories");
      return data;
    },
  );
}

interface DeleteCategoryPayload {
  id: string;
}

export async function deleteCategoryAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.delete(`/delete-category/${id}`);
    },
    "Category deleted successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/categories");
      return data;
    },
  );
}

export async function getAllCategoriesAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get(`/allCategory`, { params: { restaurantId } });
    },
    "Categories fetched successfully",
    async (data) => data,
  );
}

interface UpdateCategoryPayload {
  id: string;
  categoryName: string;
}

export async function updateCategoryAction(
  payload: UpdateCategoryPayload,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.put("/update-category", { ...payload, restaurantId });
    },
    "Category updated successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/categories");
      return data;
    },
  );
}

// ==================== ITEM ACTIONS ====================

interface CreateItemPayload {
  name: string;
  description: string;
  basePrice: number | string;
  dietaryType: string;
  category: string;
  variations: { name: string; additionalPrice: number }[];
  itemImage?: string;
}

export async function createItemAction(
  formData: FormData,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  formData.append("restaurantId", restaurantId);

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.post("/item-add", formData);
    },
    "Item created successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/items");
      return data;
    },
  );
}

export async function getMenuItemsAction(): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/menu", { params: { restaurantId } });
    },
    "Menu fetched successfully",
    async (data) => data,
  );
}

export async function updateItemAction(
  formData: FormData,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  formData.append("restaurantId", restaurantId);

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.put("/update-item", formData);
    },
    "Item updated successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/items");
      return data;
    },
  );
}
export async function getMenuItemByIdAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get(`/menu/${id}`);
    },
    "Item fetched successfully",
    async (data) => data,
  );
}

export async function deleteMenuItemAction(
  id: string,
): Promise<ActionResponse> {
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get("restaurantId")?.value;

  if (!restaurantId) {
    return { success: false, message: "Restaurant ID not found" };
  }

  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.delete(`/item-delete/${id}`);
    },
    "Item deleted successfully",
    async (data) => {
      revalidatePath("/restaurant/menu/items");
      return data;
    },
  );
}
