import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: number[] = [];

    if (totalPages <= 3) {
    // If less than or equal to 3 pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    else if (currentPage <= 2) {
    // Near start → always show 1,2,3
      pages.push(1, 2, 3);
    }
    else if (currentPage >= totalPages - 1) {
    // Near end → show last 3 pages
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }
    else {
    // Middle → currentPage -1, currentPage, currentPage +1
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between border-t border-white/10 mt-8 w-full">
      <div className="flex flex-1 flex-col sm:flex-row justify-between items-center">
        <div className="mb-3 sm:mb-0">
          <p className="text-sm text-gray-600">
            Prikazano
            {" "}
            <span className="font-medium">{start}</span>
            {" "}
            do
            {" "}
            {" "}
            <span className="font-medium">{end}</span>
            {" "}
            od
            {" "}
            <span className="font-medium">{totalCount}</span>
            {" "}
            rezultata
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <nav aria-label="Pagination" className="flex items-center gap-2 w-full sm:w-auto">
            {/* First Page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center flex-1 sm:w-10 h-10 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer transition duration-300"
            >
              <ChevronsLeft />
            </button>

            {/* Prev */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center flex-1 sm:w-10 h-10 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer transition duration-300"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((p, i) => (
              <button
                key={i}
                onClick={() => handlePageClick(p)}
                // disabled={p === "..."}
                aria-current={p === currentPage ? "page" : undefined}
                className={clsx(
                  "flex items-center justify-center flex-1 sm:w-10 h-10 rounded-full text-sm font-semibold cursor-pointer transition duration-300",
                  currentPage === p
                    ? "bg-primary text-white ring-2"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200",
                )}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center flex-1 sm:w-10 h-10 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer transition duration-300"
            >
              <ChevronRight size={18} />
            </button>

            {/* Last Page */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center flex-1 sm:w-10 h-10 rounded-full text-gray-600 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer transition duration-300"
            >
              <ChevronsRight />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
