"use client";

import { useState } from "react";

export default function DashboardLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, next }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Unable to sign in.");
      window.location.href = body.next || "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--t3-black)] px-6 text-white grid place-items-center">
      <div className="w-full max-w-sm rounded-[var(--t3-radius-container)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-900)] p-7 shadow-2xl shadow-black/30">
        <div className="mb-7 text-center">
          <img src="/assets/t3-labs-white.png" alt="T3 Labs" className="mx-auto mb-5 h-auto w-28" />
          <h1 className="text-xl font-semibold">Internal dashboard</h1>
          <p className="mt-2 text-sm text-[var(--t3-dark-muted)]">Analytics and internal pricing tools.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-[var(--t3-dark-muted)]">Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="min-h-11 rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none focus:border-[var(--t3-lime)]"
              autoFocus
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-[var(--t3-dark-muted)]">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none focus:border-[var(--t3-lime)]"
              required
            />
          </label>
          {error ? <p className="text-sm font-semibold text-[var(--t3-danger)]">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 min-h-11 rounded-full bg-[var(--t3-lime)] px-5 text-sm font-semibold text-[var(--t3-black)] transition hover:-translate-y-0.5 hover:shadow-[var(--t3-glow)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Access dashboard"}
          </button>
        </form>
        <p className="mt-6 text-center"><a href="/" className="text-xs text-[var(--t3-dark-muted)] transition hover:text-[var(--t3-lime)]">← Back to t3labs.tech</a></p>
      </div>
    </div>
  );
}
