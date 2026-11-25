import { useCallback, useEffect, useState } from "react";
import { getRegistrations, getSummary } from "../api/registrationsApi";
import { useDebounce } from "../hooks/useDebounce";
import KpiCards from "../components/KpiCards";
import RegistrationFilters from "../components/RegistrationFilters";
import RegistrationTable from "../components/RegistrationTable";
import Pagination from "../components/Pagination";

export default function RegistrationPage() {
  const [registrations, setRegistrations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(searchInput, 400);

  const loadSummary = useCallback(async () => {
    try {
      const summaryData = await getSummary();
      setSummary(summaryData);
    } catch {
      // Handled by main error state when API cannot be reached
    }
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRegistrations({
        participantName: debouncedSearch,
        type: typeFilter,
        status: statusFilter,
        page,
        pageSize,
      });

      setRegistrations(data.items ?? []);
      setPage(data.page ?? page);
      setPageSize(data.pageSize ?? pageSize);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      setRegistrations([]);
      setTotalCount(0);
      setTotalPages(0);
      setError(
        err?.message ||
          "Cannot reach the API. Please make sure the backend server is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, typeFilter, statusFilter, page, pageSize]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  function handleSearchChange(value) {
    setSearchInput(value);
    setPage(1);
  }

  function handleTypeChange(value) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePageSizeChange(newSize) {
    setPageSize(Number(newSize));
    setPage(1);
  }

  function handleClearFilters() {
    setSearchInput("");
    setTypeFilter("All");
    setStatusFilter("All");
    setPage(1);
  }

  function handleRetry() {
    loadSummary();
    loadRegistrations();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Autovista Events • Sorsogon City Coliseum
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Car Show 2027 — Registration Dashboard
          </h1>
        </header>

        <KpiCards summary={summary} />

        <RegistrationFilters
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
          disabled={loading}
        />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            Loading registrations...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        ) : registrations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              No registrations match your filters
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <RegistrationTable registrations={registrations} />
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          disabled={loading || Boolean(error)}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}