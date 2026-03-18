// CREATED BY MUHAMMAD SHOAIB 3-18-2026
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface GlobalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const GlobalPagination: React.FC<GlobalPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and pages around current
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-3 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-all font-medium"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="flex items-center space-x-3">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex w-10 h-10 items-center justify-center text-gray-500"
            >
              <MoreHorizontal className="h-5 w-5" />
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all text-[15px] ${
                currentPage === page
                  ? "bg-[#2f6f52] text-white shadow-md font-medium"
                  : "bg-white border border-slate-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 transition-all font-medium"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
};
