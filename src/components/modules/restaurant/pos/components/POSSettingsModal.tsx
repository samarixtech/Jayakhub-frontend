"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus, Loader2, Pencil } from "lucide-react";
import {
  getTablesAction,
  addTableAction,
  updateTableAction,
  deleteTableAction,
} from "@/app/actions/restaurant/tables";
import toast from "react-hot-toast";

interface POSSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function POSSettingsModal({
  open,
  onOpenChange,
}: POSSettingsModalProps) {
  const [tables, setTables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [newTableName, setNewTableName] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");

  // Fetch tables when modal opens
  useEffect(() => {
    if (open) {
      fetchTables();
      // Reset form when modal opens
      resetForm();
    }
  }, [open]);

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const res = await getTablesAction();
      if (res.success) {
        setTables(res.data);
      } else {
        toast.error(res.message || "Failed to load tables");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTableId(null);
    setNewTableName("");
    setNewTableSeats("");
  };

  const handleSaveTable = async () => {
    if (!newTableName || !newTableSeats) {
      toast.error("Please enter table name and seats");
      return;
    }

    const nameToSave = newTableName.trim();

    setIsSaving(true);
    try {
      if (editingTableId) {
        const res = await updateTableAction(editingTableId, {
          name: nameToSave,
          seats: parseInt(newTableSeats, 10),
        });
        if (res.success) {
          toast.success("Table updated successfully");
          resetForm();
          fetchTables();
        } else {
          toast.error(res.message || "Failed to update table");
        }
      } else {
        const res = await addTableAction({
          name: nameToSave,
          seats: parseInt(newTableSeats, 10),
        });
        if (res.success) {
          toast.success("Table added successfully");
          resetForm();
          fetchTables();
        } else {
          toast.error(res.message || "Failed to add table");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (table: any) => {
    setEditingTableId(table.id);
    setNewTableName(table.name || table.id);
    setNewTableSeats(table.seats || table.capacity || "");
  };

  const handleRemoveTable = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await deleteTableAction(id);
      if (res.success) {
        toast.success("Table removed successfully");
        if (editingTableId === id) resetForm();
        fetchTables();
      } else {
        toast.error(res.message || "Failed to remove table");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] p-0 overflow-hidden bg-white gap-0">
        <DialogHeader className="p-4 sm:p-5 border-b border-gray-100 bg-white">
          <DialogTitle className="text-[18px] sm:text-[20px] font-black text-[#1f2937]">
            POS Settings — Tables
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col bg-white">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="w-[100px]">Table</div>
            <div className="flex-1 text-center">Capacity</div>
            <div className="w-[70px] text-right">Actions</div>
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col w-full">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 bg-white"
                  >
                    <div className="w-[100px]">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-[60px]"></div>
                    </div>
                    <div className="w-[70px] flex justify-end">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-10"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tables.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400 font-medium">
                No tables found
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className={`flex items-center justify-between px-6 py-3.5 border-b border-gray-50 transition-colors ${editingTableId === table.id ? "bg-blue-50/50" : "bg-white"}`}
                >
                  <div className="w-[100px] font-black text-[#1f2937] text-[14px]">
                    {table.name || table.id}
                  </div>
                  <div className="flex-1 text-center font-semibold text-gray-500 text-[13px]">
                    {table.seats || table.capacity || 0} seats
                  </div>
                  <div className="w-[70px] flex justify-end gap-1">
                    <button
                      onClick={() => handleEditClick(table)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Pencil className="w-[16px] h-[16px]" />
                    </button>
                    <button
                      onClick={() => handleRemoveTable(table.id)}
                      disabled={deletingId === table.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      {deletingId === table.id ? (
                        <Loader2 className="w-[16px] h-[16px] animate-spin" />
                      ) : (
                        <Trash2 className="w-[16px] h-[16px]" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Table name (e.g. T13)"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-md text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]"
              />
              <input
                type="number"
                placeholder="Seats"
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(e.target.value)}
                className="w-[80px] h-10 px-3 bg-white border border-gray-200 rounded-md text-[13px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]"
              />
              {editingTableId && (
                <button
                  onClick={resetForm}
                  className="h-10 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-md text-[13px] font-bold transition-colors shadow-sm"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveTable}
                disabled={isSaving}
                className={`h-10 px-4 text-white rounded-md text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap disabled:opacity-75 disabled:cursor-not-allowed ${editingTableId ? "bg-[#357252] hover:bg-[#2a5a41]" : "bg-[#357252] hover:bg-[#2a5a41]"}`}
              >
                {isSaving ? (
                  <Loader2 className="w-[16px] h-[16px] stroke-[2.5px] animate-spin" />
                ) : editingTableId ? (
                  <Pencil className="w-[16px] h-[16px] stroke-[2.5px]" />
                ) : (
                  <Plus className="w-[16px] h-[16px] stroke-[2.5px]" />
                )}
                {editingTableId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
