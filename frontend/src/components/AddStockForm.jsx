import { useState } from "react";

export default function AddStockForm({ onAdd }) {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = ticker.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      await onAdd(trimmed);
      setTicker("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add-stock-form" onSubmit={handleSubmit}>
      <div className="add-stock-form__row">
        <div className="add-stock-form__field">
          <label htmlFor="ticker-input" className="add-stock-form__label">
            Add a stock
          </label>
          <input
            id="ticker-input"
            type="text"
            className="add-stock-form__input"
            placeholder="e.g. AAPL, MSFT, TSLA"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            disabled={loading}
            maxLength={10}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading || !ticker.trim()}
        >
          {loading ? "Adding..." : "Add to watchlist"}
        </button>
      </div>
      {error && <p className="add-stock-form__error">{error}</p>}
    </form>
  );
}
