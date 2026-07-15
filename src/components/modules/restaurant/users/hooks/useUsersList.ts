"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getRestaurantUsersAction,
  deleteRestaurantUserAction,
} from "@/app/actions/restaurant/users";

function formatLastActive(value: string | undefined, never: string): string {
  if (!value) return never;
  const date = new Date(value);
  if (isNaN(date.getTime())) return never;
  return format(date, "dd MMM yyyy, hh:mm a");
}

export function useUsersList() {
  const t = useTranslations("RestaurantDashboard.Users");
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [users, setUsers] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { execute: fetchUsers, isPending } = useServerAction(
    getRestaurantUsersAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const userList = data?.data || data;
        if (Array.isArray(userList)) {
          const mappedUsers = userList.map((u: any) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role ? u.role.toUpperCase() : "CASHIER",
            status: u.status,
            lastActive: formatLastActive(u.lastActive, t("list.never")),
            avatar: "",
            isMe: !!u.isMe,
          }));
          setUsers(mappedUsers);
        }
      },
    },
  );

  const { execute: deleteUser, isPending: isDeleting } = useServerAction(
    deleteRestaurantUserAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchUsers();
      },
    },
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = () => {
    if (deleteId) {
      deleteUser(deleteId);
    }
  };

  const filteredUsers =
    selectedFilter === "ALL"
      ? users
      : users.filter((user) => user.role === selectedFilter);

  const filters = [
    { label: t("filters.allUsers"), value: "ALL", count: users.length },
    {
      label: t("filters.admin"),
      value: "ADMIN",
      count: users.filter((u) => u.role === "ADMIN").length,
    },
    {
      label: t("filters.manager"),
      value: "MANAGER",
      count: users.filter((u) => u.role === "MANAGER").length,
    },
    {
      label: t("filters.cashier"),
      value: "CASHIER",
      count: users.filter((u) => u.role === "CASHIER").length,
    },
    {
      label: t("filters.kitchen"),
      value: "KITCHEN",
      count: users.filter((u) => u.role === "KITCHEN").length,
    },
  ];

  return {
    users,
    filteredUsers,
    filters,
    selectedFilter,
    setSelectedFilter,
    isPending,
    deleteId,
    setDeleteId,
    isDeleting,
    confirmDelete,
  };
}
