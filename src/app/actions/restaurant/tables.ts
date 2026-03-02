"use server";

import { serverApi } from "@/components/services/api";

export async function getTablesAction() {
    try {
        const api = await serverApi();
        const response = await api.get("/table-list") as any;
        return { success: true, data: response.data?.data || [] };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.message || error.message || "Failed to fetch tables",
            data: [],
        };
    }
}

export async function addTableAction(data: { name: string; seats: number }) {
    try {
        const api = await serverApi();
        const response = await api.post("/table-add", data) as any;
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.message || "Failed to add table",
        };
    }
}

export async function updateTableAction(id: string, data: { name: string; seats: number }) {
    try {
        const api = await serverApi();
        const response = await api.put(`/table-update/${id}`, data) as any;
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.message || "Failed to update table",
        };
    }
}

export async function deleteTableAction(id: string) {
    try {
        const api = await serverApi();
        const response = await api.delete(`/table-delete/${id}`) as any;
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.message || "Failed to delete table",
        };
    }
}
