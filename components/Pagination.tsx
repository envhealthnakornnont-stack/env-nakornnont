"use client";
import { usePagination } from "@/hook/usePagination";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  siblingCount = 1,
  onPageChange,
}) => {
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = itemsPerPage > 0
    ? Math.ceil(totalItems / itemsPerPage)
    : 1;

  // รับ list ของเลขหน้า + ellipsis
  const pages = usePagination({
    currentPage,
    totalItems,
    itemsPerPage,
    siblingCount,
  });
  
  // ถ้ามีแค่หน้าเดียว ไม่ต้องแสดง pagination
  if (totalPages <= 1) {
    return null;
  }

  const goTo = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className="join w-full justify-center"
      role="navigation"
      aria-label="Pagination Navigation"
    >
      {/* Prev */}
      <button
        type="button"
        className="join-item btn btn-sm sm:btn-md"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Prev
      </button>

      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="join-item btn btn-sm sm:btn-md btn-disabled cursor-default"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={`page-${p}`}
            type="button"
            className={`join-item btn btn-sm sm:btn-md ${currentPage === p ? "btn-primary" : ""}`}
            onClick={() => goTo(p)}
            aria-current={currentPage === p ? "page" : undefined}
            aria-label={
              currentPage === p
                ? `Page ${p}, current page`
                : `Go to page ${p}`
            }
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        className="join-item btn btn-sm sm:btn-md"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;