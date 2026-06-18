"use server";

import { cookies } from "next/headers";

/**
 * Get the current authentication token from session cookies.
 * This is used for server-side and client-side operations.
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}
