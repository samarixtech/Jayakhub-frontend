"use client";

import React from "react";
import { Play } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

interface CreateTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateTicketDialog = ({ open, onOpenChange }: CreateTicketDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 rounded-2xl gap-0">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-[18px] font-bold text-[#1a1a1a]">Create New Ticket</DialogTitle>
                    <DialogDescription className="sr-only">Fill out the form below to submit a new support ticket.</DialogDescription>
                </DialogHeader>

                {/* Form */}
                <div className="px-6 py-4 space-y-5">
                    {/* Subject */}
                    <div>
                        <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">Subject</label>
                        <input
                            type="text"
                            placeholder="Brief summary of your issue"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">Priority</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors bg-white appearance-none cursor-pointer">
                            <option>Medium</option>
                            <option>High</option>
                            <option>Low</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">Category</label>
                        <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors bg-white appearance-none cursor-pointer">
                            <option>General Inquiry</option>
                            <option>Technical Issue</option>
                            <option>Billing</option>
                            <option>Feature Request</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">Description</label>
                        <textarea
                            placeholder="Describe your issue in detail..."
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 pb-6 pt-2 flex-row justify-end gap-3 border-t border-gray-100 mt-1">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2 bg-[#346853] hover:bg-[#2a5644] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors"
                    >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Submit Ticket
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTicketDialog;
