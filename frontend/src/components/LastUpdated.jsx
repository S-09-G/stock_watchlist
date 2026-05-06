import { useEffect, useState } from "react";

function formatRelative(timestamp) {
  if (!timestamp) return null;

  const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

export default function LastUpdated({ timestamp }) {
  // Re-render every 15s so the relative label stays current
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  const label = formatRelative(timestamp);
  if (!label) return null;

  return (
    <p className="last-updated">
      <span className="last-updated__dot" aria-hidden="true" />
      Updated {label}
    </p>
  );
}
