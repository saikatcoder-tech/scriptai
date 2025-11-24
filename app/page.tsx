"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions/start", { method: "POST" });
      if (!res.ok) {
        alert("Please login first");
        return;
      }
      const data = await res.json();
      window.location.href = `/session/${data.id}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={startSession}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-emerald-500 disabled:opacity-50"
      >
        {loading ? "Starting..." : "Start Session"}
      </button>
    </main>
  );
}
