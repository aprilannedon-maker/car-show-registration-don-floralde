import { useCallback, useEffect, useState } from "react";
import { getRegistrations, getSummary } from "../api/sample-data";
import KpiCards from "../components/KpiCards";
import Pagination from "../components/Pagination";
import RegistrationFilters from "../components/RegistrationFilters";
import RegistrationTable from "../components/RegistrationTable";
import { useDebounce } from "../hooks/useDebounce";

export default function RegistrationPage() {
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [registrationsData, setRegistrationsData] = useState({
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  const debouncedName = useDebounce(searchInput, 400);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleTypeChange = (value) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setTypeFilter("All");
    setStatusFilter("All");
    setPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    setReloadTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [listResult, summaryResult] = await Promise.all([
          getRegistrations({
            participantName: debouncedName,
            type: typeFilter,
            status: statusFilter,
            page,
            pageSize,
          }),
          getSummary(),
        ]);

        if (!active) return;
        setRegistrationsData(listResult);
        setSummary(summaryResult);
      } catch (err) {
        if (!active) return;
        setError(
          err?.message || "Cannot reach the API. Please try again later."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [debouncedName, typeFilter, statusFilter, page, pageSize, reloadTick]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                AutoVista Events • Sorsogon City Coliseum
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Car Show 2027 — Registration Dashboard
              </h1>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Staff Operations View
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <KpiCards summary={summary} isLoading={isLoading && !summary} />

        <RegistrationFilters
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
          disabled={isLoading}
        />

        <RegistrationTable
          items={registrationsData.items}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          onClearFilters={handleClearFilters}
        />

        <Pagination
          page={registrationsData.page}
          pageSize={registrationsData.pageSize}
          totalCount={registrationsData.totalCount}
          totalPages={registrationsData.totalPages}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
          disabled={isLoading}
        />
      </main>
    </div>
  );
}