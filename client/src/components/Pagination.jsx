import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  const getPageNumbers = () => {
    const nums = [];
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(pages, page + delta);

    if (start > 1) {
      nums.push(1);
      if (start > 2) nums.push('...');
    }

    for (let i = start; i <= end; i++) {
      nums.push(i);
    }

    if (end < pages) {
      if (end < pages - 1) nums.push('...');
      nums.push(pages);
    }

    return nums;
  };

  return (
    <div className="pagination" id="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <HiChevronLeft />
      </button>

      {getPageNumbers().map((num, i) =>
        num === '...' ? (
          <span key={`dots-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
        ) : (
          <button
            key={num}
            className={`pagination-btn ${num === page ? 'active' : ''}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <HiChevronRight />
      </button>
    </div>
  );
}
