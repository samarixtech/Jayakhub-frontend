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

interface MenuItemPayload {
  name: string;
  description: string;
  category: string;
  basePrice: string;
  itemImage: string;
  isAvailable: string;
  isVeg: string;
  dietaryType: string;
  variantGroups: string;
  variations: string;
  discount: string;
  imageBase64?: string;
  imageName?: string;
  imageType?: string;
  id?: string;
}

async function buildMenuFormData(payload: MenuItemPayload, restaurantId: string) {
  const { default: NodeFormData } = await import("form-data");
  const sendData = new NodeFormData();

  sendData.append("restaurantId", restaurantId);
  sendData.append("name", payload.name);
  sendData.append("description", payload.description);
  sendData.append("category", payload.category);
  sendData.append("basePrice", payload.basePrice);
  sendData.append("isAvailable", payload.isAvailable);
  sendData.append("isVeg", payload.isVeg);
  sendData.append("dietaryType", payload.dietaryType);
  sendData.append("variantGroups", payload.variantGroups);
  sendData.append("variations", payload.variations);
  sendData.append("discount", payload.discount);

  if (payload.imageBase64) {
    const buffer = Buffer.from(payload.imageBase64, "base64");
    sendData.append("itemImage", buffer, {
      filename: payload.imageName || "item.jpg",
      contentType: payload.imageType || "image/jpeg",
      knownLength: buffer.length,
    });
  } else if (payload.itemImage) {
    sendData.append("itemImage", payload.itemImage);
  }

  if (payload.id) {
    sendData.append("id", payload.id);
  }

  return sendData;
}

export async function createItemAction(
  payload: MenuItemPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    async (api, restaurantId) => {
      const sendData = await buildMenuFormData(payload, restaurantId);
      return api.post("/item-add", sendData, { headers: sendData.getHeaders() });
    },
    "Item created successfully",
    "/restaurant/menu/items",
  );
}

export async function getMenuItemsAction({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
} = {}): Promise<ActionResponse> {
  return executeRestaurantAction((api, restaurantId) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && category !== "All Items" && { category }),
    });
    return api.get(`/item-menu?${queryParams.toString()}`);
  }, "Menu fetched successfully");
}

export async function updateItemAction(
  payload: MenuItemPayload,
): Promise<ActionResponse> {
  return executeRestaurantAction(
    async (api, restaurantId) => {
      const sendData = await buildMenuFormData(payload, restaurantId);
      return api.put("/update-item", sendData, { headers: sendData.getHeaders() });
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

export async function updateMenuItemStatusAction(payload: {
  id: string;
  isAvailable: boolean;
}): Promise<ActionResponse> {
  return executeRestaurantAction(
    (api, restaurantId) =>
      api.put("/update-item", { ...payload, restaurantId }),
    "Item status updated successfully",
    "/restaurant/menu/items",
  );
}
