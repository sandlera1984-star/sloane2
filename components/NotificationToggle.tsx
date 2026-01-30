"use client";

import { useState } from "react";

interface NotificationToggleProps {
  initialOptIn: boolean;
}

export default function NotificationToggle({ initialOptIn }: NotificationToggleProps) {
  const [optIn, setOptIn] = useState(initialOptIn);
  const [status, setStatus] = useState<string | null>(null);

  const handleToggle = async () => {
    const next = !optIn;
    setOptIn(next);
    const response = await fetch("/api/notifications/opt-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optIn: next }),
    });
    if (!response.ok) {
      setOptIn(!next);
      setStatus("Unable to update preference.");
      return;
    }
    setStatus("Preference updated.");
  };

  return (
    <div className="card p-8">
      <h2 className="text-xl font-semibold">Release notifications</h2>
      <p className="mt-2 text-sm text-night/60">
        Get an email when new exclusive content is published.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <button type="button" className="button-primary" onClick={handleToggle}>
          {optIn ? "Opt-out" : "Opt-in"}
        </button>
        <span className="text-sm text-night/60">
          {optIn ? "Currently opted in" : "Currently opted out"}
        </span>
      </div>
      {status && <p className="mt-3 text-xs text-night/60">{status}</p>}
    </div>
  );
}
