"use client";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsersList } from "../hooks/useUsersList";
import { UsersFilters } from "../components/UsersFilters";
import { UsersTable } from "../components/UsersTable";

export default function UsersListView() {
  const {
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
  } = useUsersList();

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4">
      <UsersFilters
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <UsersTable
          users={filteredUsers}
          isPending={isPending}
          onDelete={setDeleteId}
        />
      </Card>

      <div className="px-2">
        <Typography className="text-sm text-gray-500">
          Showing {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length} of{" "}
          {users.length}
        </Typography>
      </div>

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
