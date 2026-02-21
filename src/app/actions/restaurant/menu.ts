"use server";
import { executeRestaurantAction } from "@/lib/utils/execute-restaurant-action";

import { ActionResponse } from "@/lib/utils/response-handler";
import { BulkImportItem } from "@/types";

interface VariantOption {
  name: string;
  price: number;
}

interface CreateVariantGroupPayload {
  groupName: string;
  options: VariantOption[];
}

interface UpdateVariantGroupPayload {
  id: string;
  groupName: string;
  options: VariantOption[];
}

interface AddCategoryPayload {
  categoryName: string;
}

interface UpdateCategoryPayload {
  id: string;
  categoryName: string;
}

interface BulkImportPayload {
  items: Omit<BulkImportItem, "itemImage">[];
  itemImage: string[];
}

// interface CreateItemPayload {
//   name: string;
//   description: string;
//   basePrice: number | string;
//   dietaryType: string;
//   category: string;
//   variations: { name: string; additionalPrice: number }[];
//   itemImage?: string;
// }

// interface DeleteCategoryPayload {
//   id: string;
// }

// ==================== VARIATION ACTIONS ====================

export async function createVariantGroupAction(
  payload: CreateVariantGroupPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.post("/add-variant", {
        restaurantId,
        groupName: payload.groupName,
        options: payload.options,
      }),
    "Variant group created successfully",
    "/restaurant/menu/variants",
  );
}

export async function getVariantGroupsAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) => api.get(`/all-variant/${restaurantId}`),
    "Variants fetched successfully",
  );
}

export async function updateVariantGroupAction(
  payload: UpdateVariantGroupPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.put("/update-variant", { ...payload, restaurantId }),
    "Variant group updated successfully",
    "/restaurant/menu/variants",
  );
}

export async function deleteVariantGroupAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.delete(`/delete-group/${id}`),
    "Variant group deleted successfully",
    "/restaurant/menu/variants",
  );
}

// ==================== KEY CATEGORY ACTIONS ====================

export async function addCategoryAction(
  payload: AddCategoryPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.post("/add-category", {
        restaurantId,
        categoryName: payload.categoryName,
      }),
    "Category created successfully",
    "/restaurant/menu/categories",
  );
}

export async function deleteCategoryAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.delete(`/delete-category/${id}`),
    "Category deleted successfully",
    "/restaurant/menu/categories",
  );
}

export async function getAllCategoriesAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.get(`/allCategory`, { params: { restaurantId } }),
    "Categories fetched successfully",
  );
}

export async function updateCategoryAction(
  payload: UpdateCategoryPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.put("/update-category", { ...payload, restaurantId }),
    "Category updated successfully",
    "/restaurant/menu/categories",
  );
}

// ==================== ITEM ACTIONS ====================

export async function createItemAction(
  formData: FormData,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) => {
      formData.append("restaurantId", restaurantId);
      return api.post("/item-add", formData);
    },
    "Item created successfully",
    "/restaurant/menu/items",
  );
}

export async function getMenuItemsAction(): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) => api.get(`/item-menu/${restaurantId}`),
    "Menu fetched successfully",
  );
}

export async function updateItemAction(
  formData: FormData,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) => {
      formData.append("restaurantId", restaurantId);
      return api.put("/update-item", formData);
    },
    "Item updated successfully",
    "/restaurant/menu/items",
  );
}
export async function getMenuItemByIdAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.get(`/menu/${id}`),
    "Item fetched successfully",
  );
}

export async function deleteMenuItemAction(
  id: string,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api) => api.delete(`/item-delete/${id}`),
    "Item deleted successfully",
    "/restaurant/menu/items",
  );
}

// ==================== BULK IMPORT ACTIONS ====================

export async function bulkImportItemsAction(
  payload: BulkImportPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.post("/item-bulk", {
        restaurantId,
        items: payload.items,
        itemImage: payload.itemImage,
      }),
    "Items imported successfully",
    "/restaurant/menu/items",
  );
}
