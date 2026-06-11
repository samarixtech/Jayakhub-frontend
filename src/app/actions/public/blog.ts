"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export type ApiBlogPost = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  image: string;
  content: string;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogsData = {
  items: ApiBlogPost[];
  total: number;
};

function resolveImage(image: string, baseUrl: string): string {
  return image.startsWith("/")
    ? `${baseUrl.replace(/\/$/, "")}${image}`
    : image;
}

export async function getBlogBySlugAction(
  slug: string,
): Promise<ActionResponse<ApiBlogPost>> {
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";
  const api = await serverApi();
  return responseHandler(
    async () => api.get(`/blog/${slug}`),
    undefined,
    async (data: ApiBlogPost) => ({
      ...data,
      image: resolveImage(data.image, imageBaseUrl),
    }),
  );
}

export async function getBlogsAction(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<ActionResponse<BlogsData>> {
  const { page = 1, limit = 20, category, search } = params || {};

  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  searchParams.append("limit", limit.toString());
  if (category) searchParams.append("category", category);
  if (search) searchParams.append("search", search);

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

  const api = await serverApi();
  return responseHandler(
    async () => api.get(`/blog?${searchParams.toString()}`),
    undefined,
    async (data: BlogsData) => ({
      ...data,
      items: data.items.map((post) => ({
        ...post,
        image: resolveImage(post.image, imageBaseUrl),
      })),
    }),
  );
}
