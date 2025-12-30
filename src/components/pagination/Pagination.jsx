import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  showTotal = true,
  className = "",
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= 0) return [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    pages.push(1);

    let left = Math.max(2, currentPage - 1);
    let right = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      left = 2;
      right = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      left = Math.max(2, totalPages - 4);
      right = totalPages - 1;
    }

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 0 || !totalPages) return null;

  return (
    <nav className={`fz-shop-pagination ${className}`}>
      <ul className="page-numbers">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="page-number-btn"
          >
            <span aria-current="page" className="last-page">
              <i className="fa-light fa-angle-double-left"></i>
            </span>
          </button>
        </li>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="page-number-btn" style={{ cursor: 'default' }}>
                  ...
                </span>
              </li>
            );
          }

          return (
            <li key={page}>
              <button
                className={`page-number-btn ${currentPage === page ? 'current' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            disabled={currentPage === totalPages}
            className="page-number-btn"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span aria-current="page" className="last-page">
              <i className="fa-light fa-angle-double-right"></i>
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;