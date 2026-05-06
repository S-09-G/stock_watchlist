import { useEffect, useState } from "react";

import { getStockDetail } from "../api/stocks";
import {
  formatCurrency,
  formatLargeNumber,
  formatPercent,
  getSectorColor,
} from "../utils/format";

function MetricRow({ label, value }) {
  return (
    <div className="metric">
      <span className="metric__label">{label}</span>
      <span className="metric__value">{value}</span>
    </div>
  );
}

export default function StockDetailModal({ ticker, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getStockDetail(ticker);
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ticker]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const sectorColor = detail ? getSectorColor(detail.sector) : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {loading && <p className="modal__loading">Loading details...</p>}

        {error && <p className="modal__error">{error}</p>}

        {detail && (
          <>
            <header className="modal__header">
              <div>
                <h2 id="modal-title" className="modal__ticker">
                  {detail.ticker}
                </h2>
                <p className="modal__company">{detail.company_name}</p>
              </div>
              {detail.sector && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: sectorColor.bg,
                    color: sectorColor.text,
                  }}
                >
                  {detail.sector}
                </span>
              )}
            </header>

            <div className="modal__price-row">
              <p className="modal__price">
                {formatCurrency(detail.current_price, detail.currency)}
              </p>
              <p className="modal__price-label">Current price</p>
            </div>

            <div className="metric-grid">
              <MetricRow
                label="Market Cap"
                value={formatLargeNumber(detail.market_cap)}
              />
              <MetricRow
                label="P/E Ratio"
                value={detail.pe_ratio ? detail.pe_ratio.toFixed(2) : "—"}
              />
              <MetricRow
                label="Day High"
                value={formatCurrency(detail.day_high, detail.currency)}
              />
              <MetricRow
                label="Day Low"
                value={formatCurrency(detail.day_low, detail.currency)}
              />
              <MetricRow
                label="52-Week High"
                value={formatCurrency(detail.fifty_two_week_high, detail.currency)}
              />
              <MetricRow
                label="52-Week Low"
                value={formatCurrency(detail.fifty_two_week_low, detail.currency)}
              />
              <MetricRow
                label="Dividend Yield"
                value={formatPercent(detail.dividend_yield)}
              />
              <MetricRow label="Currency" value={detail.currency ?? "—"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
