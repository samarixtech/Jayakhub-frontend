"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(token?: string, role?: string) {
  if (!token) return;

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  if (role) {
    cookieStore.set("role", role, { path: "/" });
  }
}
