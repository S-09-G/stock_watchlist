import { useState } from "react";

import { formatCurrency, formatDate, getSectorColor } from "../utils/format";

export default function StockCard({ stock, onSelect, onRefresh, onRequestRemove }) {
  const [refreshing, setRefreshing] = useState(false);
  const sectorColor = getSectorColor(stock.sector);

  async function handleRefresh(e) {
    e.stopPropagation();
    setRefreshing(true);
    try {
      await onRefresh(stock.ticker);
    } finally {
      setRefreshing(false);
    }
  }

  function handleRemove(e) {
    e.stopPropagation();
    onRequestRemove(stock);
  }

  return (
    <article
      className="stock-card"
      onClick={() => onSelect(stock)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect(stock);
      }}
    >
      <header className="stock-card__header">
        <div>
          <h3 className="stock-card__ticker">{stock.ticker}</h3>
          <p className="stock-card__company">{stock.company_name}</p>
        </div>
        {stock.sector && (
          <span
            className="badge"
            style={{ backgroundColor: sectorColor.bg, color: sectorColor.text }}
          >
            {stock.sector}
          </span>
        )}
      </header>

      <div className="stock-card__price-block">
        <p className="stock-card__price">
          {formatCurrency(stock.current_price, stock.currency)}
        </p>
        <p className="stock-card__meta">Added {formatDate(stock.added_at)}</p>
      </div>

      <footer className="stock-card__actions">
        <button
          className="btn btn--ghost btn--sm"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label={`Refresh ${stock.ticker} price`}
        >
          {refreshing ? "Refreshing..." : "Refresh price"}
        </button>
        <button
          className="btn btn--danger-ghost btn--sm"
          onClick={handleRemove}
          aria-label={`Remove ${stock.ticker}`}
        >
          Remove
        </button>
      </footer>
    </article>
  );
}
