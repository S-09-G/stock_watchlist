const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unexpected server error." }));
    throw new Error(error.detail ?? "Something went wrong.");
  }

  // 204 No Content responses have no body
  if (response.status === 204) return null;

  return response.json();
}

export function getWatchlist() {
  return request("/watchlist");
}

export function addToWatchlist(ticker) {
  return request(`/watchlist/${ticker}`, { method: "POST" });
}

export function removeFromWatchlist(ticker) {
  return request(`/watchlist/${ticker}`, { method: "DELETE" });
}

export function refreshStockPrice(ticker) {
  return request(`/watchlist/${ticker}/refresh`, { method: "POST" });
}

export function getStockDetail(ticker) {
  return request(`/stock/${ticker}`);
}
