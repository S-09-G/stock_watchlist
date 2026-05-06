import { useMemo } from "react";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}

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
      <StatCard label="Stocks Tracked" value={stats.totalStocks} />
      <StatCard label="Sectors" value={stats.sectorCount} />
    </section>
  );
}
