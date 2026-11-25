const TYPE_OPTIONS = ["All", "Exhibitor", "Competitor", "VIP"];
const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "CheckedIn", "Cancelled"];

export default function RegistrationFilters({
  searchInput,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
  disabled = false,
}) {
  const hasActiveFilters =
    searchInput.trim() !== "" ||
    (typeFilter && typeFilter !== "All") ||
    (statusFilter && statusFilter !== "All");

  return (
    <section
      aria-label="Registration Filters"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <label
            htmlFor="participant-search"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Search Participant
          </label>
          <input
            id="participant-search"
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search participant name..."
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="type-filter"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Registration Type
          </label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="status-filter"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "CheckedIn" ? "Checked In" : option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters || disabled}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear filters
          </button>
        </div>
      </div>
    </section>
  );
}