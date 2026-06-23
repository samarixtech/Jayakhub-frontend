"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getRestaurantUsersAction,
  deleteRestaurantUserAction,
} from "@/app/actions/restaurant/users";

export function useUsersList() {
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
            lastActive: u.lastActive || "Never",
            avatar: "",
          }));
          setUsers(mappedUsers);
        }
      },
      onError: () => toast.error("Failed to fetch users"),
    },
  );

  const { execute: deleteUser, isPending: isDeleting } = useServerAction(
    deleteRestaurantUserAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchUsers();
      },
      onError: (err) => toast.error(err || "Failed to delete user"),
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
    { label: "All Users", value: "ALL", count: users.length },
    {
      label: "Admin",
      value: "ADMIN",
      count: users.filter((u) => u.role === "ADMIN").length,
    },
    {
      label: "Manager",
      value: "MANAGER",
      count: users.filter((u) => u.role === "MANAGER").length,
    },
    {
      label: "Cashier",
      value: "CASHIER",
      count: users.filter((u) => u.role === "CASHIER").length,
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
