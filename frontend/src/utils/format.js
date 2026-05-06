export function formatCurrency(value, currency = "USD") {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLargeNumber(value) {
  if (value == null) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value) {
  if (value == null) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Deterministic colour assignment so the same sector always gets the same shade
const SECTOR_PALETTE = [
  { bg: "#dbeafe", text: "#1e40af" },
  { bg: "#fce7f3", text: "#9d174d" },
  { bg: "#dcfce7", text: "#166534" },
  { bg: "#fef3c7", text: "#854d0e" },
  { bg: "#e9d5ff", text: "#6b21a8" },
  { bg: "#ffedd5", text: "#9a3412" },
  { bg: "#cffafe", text: "#155e75" },
  { bg: "#fee2e2", text: "#991b1b" },
];

export function getSectorColor(sector) {
  if (!sector) return { bg: "#f3f4f6", text: "#4b5563" };
  let hash = 0;
  for (let i = 0; i < sector.length; i++) {
    hash = (hash << 5) - hash + sector.charCodeAt(i);
    hash |= 0;
  }
  return SECTOR_PALETTE[Math.abs(hash) % SECTOR_PALETTE.length];
}
