import { useMemo } from "react";

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
  );
}

const ICON_PORTFOLIO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 3v18h18" />
    <path d="M7 14l4-4 4 4 6-6" />
  </svg>
);

const ICON_LAYERS = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
  </svg>
);

export default function Dashboard({ stocks }) {
  const stats = useMemo(() => {
    const sectors = new Set(stocks.map((s) => s.sector).filter(Boolean));
    return {
      totalStocks: stocks.length,
      sectorCount: sectors.size,
    };
  }, [stocks]);

  return (
    <section className="dashboard">
      <StatCard
        label="Stocks Tracked"
        value={stats.totalStocks}
        icon={ICON_PORTFOLIO}
        accent="indigo"
      />
      <StatCard
        label="Sectors"
        value={stats.sectorCount}
        icon={ICON_LAYERS}
        accent="emerald"
      />
    </section>
  );
}
