import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    message?: string;
    className?: string; // Additional classes for the container
}

export default function EmptyState({
    icon: Icon,
    title,
    message,
    className = "",
}: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 text-center min-h-[300px] w-full h-full ${className}`}
        >
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center  ">
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 stroke-[1.5px]" />
            </div>
            <h3 className="text-[16px] sm:text-[18px] font-bold text-gray-800 mb-1 sm:mb-2 tracking-tight">
                {title}
            </h3>
            {message && (
                <p className="text-[13px] sm:text-[14px] font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {message}
                </p>
            )}
        </div>
    );
}
