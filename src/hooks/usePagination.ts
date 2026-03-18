// CREATED BY MUHAMMAD SHOAIB 3-18-2026
import { useState, useCallback } from "react";

export interface PaginationState {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps = {}) {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    totalCount: 0,
    totalPages: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 })); // Reset to page 1 on limit change
  }, []);

  const updatePaginationMeta = useCallback(
    (meta: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    }) => {
      setPagination({
        page: meta.page,
        limit: meta.limit,
        totalCount: meta.totalCount,
        totalPages: meta.totalPages,
      });
    },
    [],
  );

  return {
    page: pagination.page,
    limit: pagination.limit,
    totalCount: pagination.totalCount,
    totalPages: pagination.totalPages,
    handlePageChange,
    handleLimitChange,
    updatePaginationMeta,
  };
}
