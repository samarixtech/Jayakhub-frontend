"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { toast } from "react-hot-toast";
import { useServerAction } from "@/hooks/use-server-action";
import {
  getRestaurantUsersAction,
  deleteRestaurantUserAction,
} from "@/app/actions/restaurant/users";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersListView() {
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
          // Map API response to UI model
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
    },
  );

  const { execute: deleteUser, isPending: isDeleting } = useServerAction(
    deleteRestaurantUserAction,
    {
      onSuccess: () => {
        setDeleteId(null);
        fetchUsers(); // Refresh list
      },
      onError: (err) => toast.error(err.message || "Failed to delete user"),
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

  // Dynamic Filters
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
      label: "Kitchen", // Assuming KITCHEN is a role based on previous mock data, adjust if needed
      value: "KITCHEN",
      count: users.filter((u) => u.role === "KITCHEN").length,
    },
    {
      label: "Cashier",
      value: "CASHIER",
      count: users.filter((u) => u.role === "CASHIER").length,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4">
      {/* Top Bar: Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filters (Pills) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar w-full sm:w-auto">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              onClick={() => setSelectedFilter(filter.value)}
              className={`
                rounded-full px-4 h-9 border
                ${
                  selectedFilter === filter.value
                    ? "bg-[#1F4D36] text-white border-[#1F4D36] hover:bg-[#183d2b] hover:text-white"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              {filter.label}
              <Badge
                variant="secondary"
                className={`
                  ml-2 px-1.5 py-0 text-[10px] h-5 min-w-[20px] flex items-center justify-center rounded-full
                  ${
                    selectedFilter === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Actions (Bell + Add User) */}
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="w-5 h-5" />
          </Button>
          <LocalizedLink href="/restaurant/users/new">
            <Button className="bg-[#1F4D36] hover:bg-[#183d2b] text-white gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </LocalizedLink>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-xs uppercase w-[300px] pl-6">
                User
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase">
                Role
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase">
                Last Active
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              // Skeleton Loader
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-48 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-5 w-10 bg-gray-200 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-gray-500"
                >
                  No users found in this category.
                </TableCell>
              </TableRow>
            ) : (
              // User List
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-gray-50 hover:bg-gray-50/50 group"
                >
                  {/* User Column */}
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-100 bg-gray-50 text-gray-500">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="font-medium text-gray-600 text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Typography className="font-semibold text-gray-900 text-sm">
                          {user.name}
                        </Typography>
                        <Typography className="text-gray-400 text-xs">
                          {user.email}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role Column */}
                  <TableCell>
                    <span className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={user.status}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200"
                      />
                    </div>
                  </TableCell>

                  {/* Last Active Column */}
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {user.lastActive}
                    </span>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {/* Using LocalizedLink for navigation */}
                      <LocalizedLink href={`/restaurant/users/${user.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </LocalizedLink>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(user.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination Footer */}
      <div className="px-2">
        <Typography className="text-sm text-gray-500">
          Showing 1-{filteredUsers.length} of {users.length}
        </Typography>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
