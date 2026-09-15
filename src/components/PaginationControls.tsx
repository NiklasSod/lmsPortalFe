import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'

interface PaginationControlsProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

const PaginationControls = ({
  page,
  pageCount,
  onPageChange,
}: PaginationControlsProps) => {
  if (pageCount <= 1) return null

  return (
    <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary text-body border-secondary"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ArrowLeft size={14} />
      </button>

      {Array.from({ length: pageCount }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`btn btn-sm ${
              pageNumber === page
                ? 'btn-secondary text-white'
                : 'btn-outline-secondary text-body border-secondary'
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        className="btn btn-sm btn-outline-secondary text-body border-secondary"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default PaginationControls
