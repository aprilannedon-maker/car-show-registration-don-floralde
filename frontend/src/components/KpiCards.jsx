import KpiCard from "./KpiCard";

function formatNumber(value) {
  return new Intl.NumberFormat("en-PH").format(Number(value) || 0);
}

function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export default function KpiCards({ summary, isLoading }) {
  const totalRegistrations = summary?.totalRegistrations ?? 0;
  const totalPayments = summary?.totalPayments ?? 0;
  const uncollectedPayments = summary?.uncollectedPayments ?? 0;
  const confirmed = summary?.confirmed ?? 0;
  const checkedIn = summary?.checkedIn ?? 0;
  const totalFees = summary?.totalFees ?? 0;

  const collectionRate =
    totalFees > 0 ? ((totalPayments / totalFees) * 100).toFixed(1) : "0.0";

  const cards = [
    {
      key: "totalRegistrations",
      label: "Total Registrations",
      value: isLoading ? "—" : formatNumber(totalRegistrations),
      subtitle: "All registered entries",
      accentClass: "text-slate-900",
    },
    {
      key: "totalPayments",
      label: "Total Payments",
      value: isLoading ? "—" : formatPeso(totalPayments),
      subtitle: `Collection rate: ${collectionRate}%`,
      accentClass: "text-emerald-700",
    },
    {
      key: "uncollectedPayments",
      label: "Uncollected Payments",
      value: isLoading ? "—" : formatPeso(uncollectedPayments),
      subtitle: "Remaining balance due",
      accentClass: "text-red-700",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      value: isLoading ? "—" : formatNumber(confirmed),
      subtitle: "Confirmed participants",
      accentClass: "text-blue-700",
    },
    {
      key: "checkedIn",
      label: "Checked In",
      value: isLoading ? "—" : formatNumber(checkedIn),
      subtitle: "Arrived at venue",
      accentClass: "text-teal-700",
    },
  ];

  return (
    <section
      aria-label="Key Performance Indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {cards.map((card) => (
        <KpiCard
          key={card.key}
          label={card.label}
          value={card.value}
          subtitle={card.subtitle}
          accentClass={card.accentClass}
        />
      ))}
    </section>
  );
}