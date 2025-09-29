import { useMemo } from "react";

export type PageItem = number | "ellipsis";

export interface UsePaginationParams {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  siblingCount?: number;
}

export function usePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  siblingCount = 1,
}: UsePaginationParams): PageItem[] {
  return useMemo<PageItem[]>(() => {
    const totalPages = itemsPerPage > 0
      ? Math.ceil(totalItems / itemsPerPage)
      : 1;

    const pages: PageItem[] = [];

    // ซ้ายสุด
    if (currentPage > siblingCount + 2) {
      pages.push(1, "ellipsis");
    } else {
      for (let i = 1; i <= Math.min(siblingCount + 2, totalPages); i++) {
        pages.push(i);
      }
    }

    // รอบ ๆ currentPage
    const start = Math.max(2, currentPage - siblingCount);
    const end   = Math.min(totalPages - 1, currentPage + siblingCount);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    // ขวาสุด
    if (currentPage < totalPages - siblingCount - 1) {
      pages.push("ellipsis", totalPages);
    } else {
      for (let i = Math.max(totalPages - siblingCount - 1, 2); i <= totalPages; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalItems, itemsPerPage, siblingCount]);
}
