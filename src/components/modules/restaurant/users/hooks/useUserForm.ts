"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useServerAction } from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import {
  createRestaurantUserAction,
  updateRestaurantUserAction,
  getRestaurantUserByIdAction,
} from "@/app/actions/restaurant/users";


export function useUserForm({
  mode = "add",
  userId,
}: {
  mode?: "add" | "edit";
  userId?: string;
}) {
  const router = useRouter();

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Security
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { execute: fetchUser } = useServerAction(getRestaurantUserByIdAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      const user = data?.data || data;
      if (user) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setIsActive(user.status);
        setRole(user.role ? user.role.toUpperCase() : "");
      }
    },
    onError: () => toast.error("Failed to fetch user details"),
  });

  useEffect(() => {
    if (mode === "edit" && userId) {
      fetchUser(userId);
    }
  }, [mode, userId]);

  const { execute: createUser, isPending: isCreating } = useServerAction(
    createRestaurantUserAction,
    {
      onSuccess: () => {
        router.push("/restaurant/users");
      },
    },
  );

  const { execute: updateUser, isPending: isUpdating } = useServerAction(
    updateRestaurantUserAction,
    {
      onSuccess: () => {
        router.push("/restaurant/users");
      },
    },
  );

  const handleSave = () => {
    if (!firstName || !lastName || !email || !role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      role: role.toLowerCase(),
      status: isActive,
      ...(password ? { password } : {}),
    };

    if (mode === "edit" && userId) {
      updateUser({ ...payload, id: userId });
    } else {
      createUser(payload as any);
    }
  };

  return {
    state: {
      firstName,
      lastName,
      email,
      isActive,
      role,
      password,
      confirmPassword,
    },
    actions: {
      setFirstName,
      setLastName,
      setEmail,
      setIsActive,
      setRole,
      setPassword,
      setConfirmPassword,
      handleSave,
    },
    status: {
      isCreating,
      isUpdating,
    },
  };
}
