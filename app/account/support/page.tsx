"use client";

import { useState } from "react";
import MemberSidebar from "@/components/MemberSidebar";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, issue }),
    });
    if (!response.ok) {
      setStatus("Unable to submit support ticket.");
      setLoading(false);
      return;
    }
    setStatus("Thank you for your submission.");
    setName("");
    setEmail("");
    setIssue("");
    setLoading(false);
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row">
      <MemberSidebar />
      <div className="card flex-1 p-10">
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="mt-2 text-sm text-night/60">
          Tell us what you need help with (up to 200 words).
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <textarea
            placeholder="Describe your issue"
            className="input min-h-[140px]"
            value={issue}
            onChange={(event) => setIssue(event.target.value)}
            required
          />
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
          {status && <p className="text-sm text-night/60">{status}</p>}
        </form>
      </div>
    </main>
  );
}
