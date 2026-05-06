import { useEffect } from "react";

export default function Notification({ message, type = "success", onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`notification notification--${type}`} role="alert">
      <span>{message}</span>
      <button className="notification__close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
