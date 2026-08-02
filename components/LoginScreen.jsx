"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError(err.message);
  }

  return (
    <div className="sot" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <style>{`
        .sot { --bg: #10131a; --bg-raised: #171b24; --panel: #1a1f29; --panel-2: #212734;
          --line: #2a3140; --line-soft: #232a36; --text: #e7e9ee; --text-dim: #9aa1b0; --text-faint: #626a7a;
          --brand: #c8283f; --brand-soft: #3a1620; background: var(--bg); color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .login-card { width: 340px; background: var(--panel); border: 1px solid var(--line-soft); border-radius: 14px; padding: 28px; }
        .login-label { font-size: 11.5px; color: var(--text-dim); font-weight: 600; margin-bottom: 5px; display: block; }
        .login-input { width: 100%; background: var(--bg-raised); border: 1px solid var(--line); border-radius: 8px;
          padding: 9px 11px; font-size: 13px; color: var(--text); outline: none; margin-bottom: 14px; }
        .login-input:focus { border-color: var(--brand); }
        .login-btn { width: 100%; background: var(--brand); color: #fff; border: none; border-radius: 8px;
          padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .login-btn:disabled { opacity: 0.6; cursor: default; }
        .login-error { font-size: 12px; color: #ff6b6b; margin-bottom: 12px; }
      `}</style>
      <form className="login-card" onSubmit={signIn}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--brand)", marginBottom: 14 }} />
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>Sponsorship Tracker</div>
        <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 20 }}>Sign in to your team workspace</div>

        {error && <div className="login-error">{error}</div>}

        <label className="login-label">Email</label>
        <input className="login-input" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />

        <label className="login-label">Password</label>
        <input className="login-input" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />

        <button className="login-btn" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>

        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 14, lineHeight: 1.5 }}>
          Don't have an account yet? Ask your admin to add you in Supabase under Authentication → Users.
        </div>
      </form>
    </div>
  );
}
