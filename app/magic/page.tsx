"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MagicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying magic link...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("Missing token.");
      return;
    }
    const consume = async () => {
      const response = await fetch("/api/magic/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        setStatus("Magic link invalid or expired.");
        return;
      }
      router.push("/exclusive");
    };
    consume();
  }, [router, searchParams]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-12">
      <div className="card p-10 text-center">
        <h1 className="text-2xl font-semibold">Magic link</h1>
        <p className="mt-3 text-sm text-night/60">{status}</p>
      </div>
    </main>
  );
}
