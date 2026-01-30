"use client";

import { useState } from "react";

export default function CancelSubscriptionButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const response = await fetch("/api/account/cancel", { method: "POST" });
    if (!response.ok) {
      setStatus("Unable to cancel subscription.");
      setLoading(false);
      return;
    }
    const data = await response.json();
    setStatus(`Subscription ${data.status}.`);
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button type="button" className="button-primary" onClick={handleCancel} disabled={loading}>
        {loading ? "Canceling..." : "Cancel subscription"}
      </button>
      {status && <p className="mt-2 text-xs text-night/60">{status}</p>}
    </div>
  );
}
