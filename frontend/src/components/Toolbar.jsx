export const SORT_OPTIONS = [
  { value: "added_desc", label: "Recently added" },
  { value: "ticker_asc", label: "Ticker A-Z" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
];

export default function Toolbar({ searchQuery, onSearchChange, sortBy, onSortChange, count }) {
  return (
    <div className="toolbar">
      <div className="toolbar__search">
        <svg
          className="toolbar__search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="search"
          className="toolbar__search-input"
          placeholder="Search by ticker or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search watchlist"
        />
      </div>

      <div className="toolbar__right">
        <span className="toolbar__count">
          {count} {count === 1 ? "stock" : "stocks"}
        </span>
        <select
          className="toolbar__sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort watchlist"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
