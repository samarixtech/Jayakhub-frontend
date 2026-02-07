"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Lock, User, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useServerAction } from "@/hooks/use-server-action";
import { useLocalizedRouter } from "@/hooks/use-localized-router";
import {
  createRestaurantUserAction,
  updateRestaurantUserAction,
  getRestaurantUserByIdAction,
} from "@/app/actions/restaurant/users";

const ROLES = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Kitchen", value: "KITCHEN" },
];

export default function UserFormView({
  mode = "add",
  userId,
}: {
  mode?: "add" | "edit";
  userId?: string;
}) {
  const router = useLocalizedRouter();

  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Security
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch User for Edit
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

  // Create Action
  const { execute: createUser, isPending: isCreating } = useServerAction(
    createRestaurantUserAction,
    {
      onSuccess: () => {
        router.push("/restaurant/users");
      },
      onError: (err) => toast.error(err || "Failed to create user"),
    },
  );

  // Update Action
  const { execute: updateUser, isPending: isUpdating } = useServerAction(
    updateRestaurantUserAction,
    {
      onSuccess: () => {
        router.push("/restaurant/users");
      },
      onError: (err) => toast.error(err || "Failed to update user"),
    },
  );

  const handleSave = () => {
    if (!firstName || !lastName || !email || !role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "add" && !password) {
      toast.error("Password is required for new users.");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      role: role.toLowerCase(),
      status: isActive,
      ...(password ? { password } : {}), // Only include password if provided
    };

    if (mode === "edit" && userId) {
      updateUser({ ...payload, id: userId });
    } else {
      createUser(payload as any); // Type assertion if needed or update payload type
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LocalizedLink href="/restaurant/users">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </LocalizedLink>
          <Typography variant="h2" className="text-xl font-bold text-gray-800">
            {mode === "add" ? "Add New User" : "Edit User"}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <LocalizedLink href="/restaurant/users">
            <Button variant="ghost" className="text-gray-500">
              Cancel
            </Button>
          </LocalizedLink>
          <Button
            onClick={handleSave}
            className="bg-[#1F4D36] hover:bg-[#183d2b] text-white font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <Typography
              variant="h3"
              className="text-lg font-semibold text-gray-900"
            >
              Personal Information
            </Typography>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Typography className="text-sm font-medium text-gray-600">
              {isActive ? "Active" : "Inactive"}
            </Typography>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>

        <Typography className="text-sm text-gray-500 mb-6">
          Basic identification details for this user.
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder="e.g. John"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 bg-gray-50/50 border-gray-200"
              placeholder="e.g. name@restaurant.com"
            />
          </div>
        </div>
      </Card>

      {/* Access & Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-gray-500" />
          <Typography
            variant="h3"
            className="text-lg font-semibold text-gray-900"
          >
            Access & Security
          </Typography>
        </div>
        <Typography className="text-sm text-gray-500 mb-6">
          Manage role permissions and login credentials.
        </Typography>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">Assigned Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      {/* Could check role icons here */}
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-gray-50/50 border-gray-200"
                  placeholder="Create password"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 bg-gray-50/50 border-gray-200"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
