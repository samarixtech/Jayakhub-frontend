"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";
import { cookies } from "next/headers";

export async function getNotifications(): Promise<ActionResponse> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return {
            success: false,
            message: "Unauthorized",
            data: [],
        };
    }

    return responseHandler(
        async () => {
            const api = await serverApi();
            return api.get("/notifications");
        },
        "Notifications fetched successfully"
    );
}
