import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

export const OrderPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: OrderPaginationProps) => {
  return (
    <div className="flex justify-center pt-4">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={`cursor-pointer border-none text-gray-400 hover:text-gray-600 hover:bg-transparent ${
                currentPage === 1 ? "pointer-events-none opacity-30" : ""
              }`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className={`w-8 h-8 rounded-full text-xs font-bold border-none cursor-pointer ${
                  currentPage === page
                    ? "bg-emerald-bg text-white hover:bg-emerald-bg"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={`cursor-pointer border-none text-gray-400 hover:text-gray-600 hover:bg-transparent ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-30"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
