"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

function resolveImage(image: string, baseUrl: string): string {
  return image && image.startsWith("/")
    ? `${baseUrl.replace(/\/$/, "")}${image}`
    : image;
}

export async function getWebappCampaignsAction(): Promise<ActionResponse> {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";
  const api = await serverApi();
  return responseHandler(
    async () => api.get("/marketing/campaigns/webapp"),
    undefined,
    async (data: any[]) =>
      Array.isArray(data)
        ? data.map((campaign) => ({
            ...campaign,
            image: resolveImage(campaign.image, imageBaseUrl),
          }))
        : data,
  );
}
