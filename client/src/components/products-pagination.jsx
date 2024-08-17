"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductsPagination = ({ total_pages }) => {
  const pathname = usePathname();
  const search_params = useSearchParams();
  const current_page = parseInt(search_params.get("page", 10) || 1);

  const create_query_string = useCallback(
    (name, value) => {
      const params = new URLSearchParams(search_params);
      params.set(name, value);

      return params.toString();
    },
    [search_params]
  );

  const renderPageButton = (pageNumber) => (
    <PaginationItem>
      <PaginationLink
        size="icon_responsive"
        href={`${pathname}?${create_query_string("page", pageNumber)}`}
        key={pageNumber}
        isActive={current_page === pageNumber}
      >
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );

  const renderPageButtons = () => {
    const buttons = [];
    const showEllipsis = total_pages > current_page + 3;

    // Previous 3 buttons
    for (let i = Math.max(1, current_page - 3); i < current_page; i++) {
      buttons.push(renderPageButton(i));
    }

    // Current page
    buttons.push(renderPageButton(current_page));

    // Next 2 buttons
    for (
      let i = current_page + 1;
      i <= Math.min(total_pages, current_page + 2);
      i++
    ) {
      buttons.push(renderPageButton(i));
    }

    // Ellipsis and last page button
    if (showEllipsis) {
      buttons.push(
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
      buttons.push(renderPageButton(total_pages));
    }

    return buttons;
  };

  return (
    <Pagination>
      <PaginationContent>
        {current_page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${pathname}?${create_query_string(
                "page",
                current_page - 1
              )}`}
            />
          </PaginationItem>
        )}

        {renderPageButtons()}

        {current_page < total_pages && (
          <PaginationItem>
            <PaginationNext
              href={`${pathname}?${create_query_string(
                "page",
                current_page + 1
              )}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default ProductsPagination;
