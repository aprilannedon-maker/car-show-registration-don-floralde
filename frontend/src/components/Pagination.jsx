const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Pagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}) {
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem =
    totalCount === 0 ? 0 : Math.min(page * pageSize, totalCount);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pageNumbers.push(i);
  }

  return (
    <section
      aria-label="Pagination Controls"
      className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row"
    >
      <div className="text-xs font-medium text-slate-600 tabular-nums">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900">{totalCount}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled || page <= 1 || totalPages === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map((num) => {
            const isCurrent = num === page;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                disabled={disabled || isCurrent}
                aria-current={isCurrent ? "page" : undefined}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold tabular-nums transition ${
                  isCurrent
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                }`}
              >
                {num}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={disabled || page >= totalPages || totalPages === 0}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}