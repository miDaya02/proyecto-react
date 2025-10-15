"use client";

type PaginatorProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
}: PaginatorProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="paginator-container">
      <button
        className="paginator-btn-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        &lt;
      </button>
      
      <span className="paginator-info">
        {currentPage} de {totalPages}
      </span>

      <button
        className="paginator-btn-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        &gt;
      </button>
    </div>
  );
}