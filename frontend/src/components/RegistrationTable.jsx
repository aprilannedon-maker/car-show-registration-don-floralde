import PaymentBadge from "./PaymentBadge";
import StatusBadge from "./StatusBadge";

function formatDate(dateString) {
  if (!dateString) return "—";
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPeso(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export default function RegistrationTable({
  items,
  isLoading,
  error,
  onRetry,
  onClearFilters,
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-700">
          Loading registrations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/60 p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-800">
          Cannot reach the API.
        </p>
        <p className="mt-1 text-xs text-red-700">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600/30"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-800">
          No registrations match your filters
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search query or resetting the active filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3">
              Registration No.
            </th>
            <th scope="col" className="px-4 py-3">
              Date
            </th>
            <th scope="col" className="px-4 py-3">
              Participant
            </th>
            <th scope="col" className="px-4 py-3">
              Car
            </th>
            <th scope="col" className="px-4 py-3">
              Type
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Fee / Paid
            </th>
            <th scope="col" className="px-4 py-3">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {items.map((item) => (
            <tr key={item.id} className="transition hover:bg-slate-50/80">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-900">
                {item.registrationNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                {formatDate(item.registrationDate)}
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-900">
                  {item.participantName}
                </div>
                <div className="text-xs text-slate-500">
                  {item.contactNumber}
                  {item.email ? ` • ${item.email}` : ""}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">
                  {item.carMakeModel}
                </div>
                <div className="font-mono text-xs text-slate-500">
                  {item.plateNumber}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-700">
                {item.registrationType}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                <div className="font-semibold text-slate-900">
                  {formatPeso(item.registrationFee)}
                </div>
                <div className="text-xs text-slate-500">
                  Paid: {formatPeso(item.amountPaid)}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <PaymentBadge paymentStatus={item.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}