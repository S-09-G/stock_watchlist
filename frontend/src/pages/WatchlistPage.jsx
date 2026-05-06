import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  addToWatchlist,
  getWatchlist,
  refreshStockPrice,
  removeFromWatchlist,
} from "../api/stocks";
import AddStockForm from "../components/AddStockForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Dashboard from "../components/Dashboard";
import EmptyState from "../components/EmptyState";
import LastUpdated from "../components/LastUpdated";
import Notification from "../components/Notification";
import StockDetailModal from "../components/StockDetailModal";
import StockGrid from "../components/StockGrid";
import Toolbar from "../components/Toolbar";

const POLL_INTERVAL_MS = 60_000;

function applyFilters(stocks, query, sortBy) {
  const lowered = query.trim().toLowerCase();

  const filtered = lowered
    ? stocks.filter(
        (s) =>
          s.ticker.toLowerCase().includes(lowered) ||
          s.company_name.toLowerCase().includes(lowered)
      )
    : stocks;

  const sorted = [...filtered];
  switch (sortBy) {
    case "ticker_asc":
      sorted.sort((a, b) => a.ticker.localeCompare(b.ticker));
      break;
    case "price_desc":
      sorted.sort((a, b) => (b.current_price ?? 0) - (a.current_price ?? 0));
      break;
    case "price_asc":
      sorted.sort((a, b) => (a.current_price ?? 0) - (b.current_price ?? 0));
      break;
    case "added_desc":
    default:
      sorted.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
  }

  return sorted;
}

export default function WatchlistPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("added_desc");
  const [selectedStock, setSelectedStock] = useState(null);
  const [pendingRemoval, setPendingRemoval] = useState(null);

  // Used to suppress the "failed to load" toast on background polls — we don't
  // want to spam the user every minute if their wifi blips.
  const initialLoad = useRef(true);

  const notify = useCallback((message, type = "success") => {
    setNotification({ message, type, id: Date.now() });
  }, []);

  const fetchWatchlist = useCallback(async () => {
    try {
      const data = await getWatchlist();
      setStocks(data);
      setLastSyncedAt(new Date());
    } catch {
      if (initialLoad.current) {
        notify("Failed to load your watchlist. Is the API server running?", "error");
      }
    } finally {
      initialLoad.current = false;
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchWatchlist();

    const intervalId = setInterval(fetchWatchlist, POLL_INTERVAL_MS);

    // Refetch immediately when the user comes back to the tab — most useful for
    // people who leave the page open and return after a long break.
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        fetchWatchlist();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchWatchlist]);

  const visibleStocks = useMemo(
    () => applyFilters(stocks, searchQuery, sortBy),
    [stocks, searchQuery, sortBy]
  );

  async function handleAdd(ticker) {
    const added = await addToWatchlist(ticker);
    setStocks((prev) => [added, ...prev]);
    notify(`${ticker} added to your watchlist`);
  }

  async function handleConfirmRemove() {
    const ticker = pendingRemoval.ticker;
    setPendingRemoval(null);
    try {
      await removeFromWatchlist(ticker);
      setStocks((prev) => prev.filter((s) => s.ticker !== ticker));
      notify(`${ticker} removed`, "info");
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function handleRefresh(ticker) {
    try {
      const updated = await refreshStockPrice(ticker);
      setStocks((prev) => prev.map((s) => (s.ticker === ticker ? updated : s)));
      notify(`${ticker} price updated`);
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__header-content">
          <h1 className="page__title">Stock Watchlist</h1>
          <p className="page__subtitle">
            Track and analyse the stocks you care about, all in one place.
          </p>
        </div>
      </header>

      <main className="page__content">
        <Dashboard stocks={stocks} />

        <section className="card card--padded">
          <AddStockForm onAdd={handleAdd} />
        </section>

        <section className="card card--padded">
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            count={visibleStocks.length}
          />

          {loading ? (
            <p className="loading-text">Loading your watchlist...</p>
          ) : stocks.length === 0 ? (
            <EmptyState
              title="No stocks in your watchlist yet"
              message="Add a ticker above to start tracking."
            />
          ) : visibleStocks.length === 0 ? (
            <EmptyState
              title="No matches found"
              message="Try a different search term."
            />
          ) : (
            <>
              <StockGrid
                stocks={visibleStocks}
                onSelect={setSelectedStock}
                onRefresh={handleRefresh}
                onRequestRemove={setPendingRemoval}
              />
              <LastUpdated timestamp={lastSyncedAt} />
            </>
          )}
        </section>
      </main>

      {selectedStock && (
        <StockDetailModal
          ticker={selectedStock.ticker}
          onClose={() => setSelectedStock(null)}
        />
      )}

      {pendingRemoval && (
        <ConfirmDialog
          title={`Remove ${pendingRemoval.ticker}?`}
          message={`This will remove ${pendingRemoval.company_name} from your watchlist. You can add it back any time.`}
          confirmLabel="Remove"
          onConfirm={handleConfirmRemove}
          onCancel={() => setPendingRemoval(null)}
        />
      )}

      {notification && (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}
    </div>
  );
}
