"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface SearchParams {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export interface PaginationParams {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface GlobalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  searchParams?: SearchParams;
  paginationParams?: PaginationParams;
}

export default function GlobalTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  searchParams,
  paginationParams,
}: GlobalTableProps<T>) {
  return (
    <div className="space-y-4">
      {searchParams && (
        <div className="flex items-center justify-between px-1">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchParams.placeholder || "Search..."}
              value={searchParams.searchTerm}
              onChange={(e) => searchParams.onSearchChange(e.target.value)}
              className="pl-9 bg-white border-gray-200 rounded-full"
            />
          </div>
        </div>
      )}

      <div className="rounded-md border-none">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={`font-semibold text-gray-600 ${col.headerClassName || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50/50"
                      : "hover:bg-gray-50/50"
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className={col.className || ""}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                          ? (item[col.accessorKey] as React.ReactNode)
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginationParams && paginationParams.totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    paginationParams.onPageChange(
                      paginationParams.currentPage - 1,
                    )
                  }
                  className={`text-gray-400 border-none p-2 cursor-pointer ${
                    paginationParams.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-transparent hover:text-gray-600"
                  }`}
                />
              </PaginationItem>

              {Array.from(
                { length: paginationParams.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => paginationParams.onPageChange(page)}
                    isActive={paginationParams.currentPage === page}
                    className={`w-9 h-9 rounded-full font-bold border-none cursor-pointer ${
                      paginationParams.currentPage === page
                        ? "bg-emerald-bg text-white hover:bg-[#1B4332] hover:text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    paginationParams.onPageChange(
                      paginationParams.currentPage + 1,
                    )
                  }
                  className={`text-gray-400 border-none p-2 cursor-pointer ${
                    paginationParams.currentPage === paginationParams.totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-transparent hover:text-gray-600"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
