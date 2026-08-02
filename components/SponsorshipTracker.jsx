"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, ListChecks, Users, Calendar as CalendarIcon, Search, Bell,
  Wifi, CreditCard, Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown, ChevronLeft, X,
  ArrowLeft, Building2, FileText, TrendingUp, Circle, MapPin, Settings as SettingsIcon, Download, Pencil
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
const STYLE = `
  .sot { 
    --bg: #10131a; --bg-raised: #171b24; --panel: #1a1f29; --panel-2: #212734;
    --line: #2a3140; --line-soft: #232a36;
    --text: #e7e9ee; --text-dim: #9aa1b0; --text-faint: #626a7a;
    --brand: #c8283f; --brand-soft: #3a1620;
    --signal-info: #4c9fe8; --signal-info-soft: #16283a;
    --signal-warn: #e8a23c; --signal-warn-soft: #392c14;
    --signal-crit: #e5484d; --signal-crit-soft: #3a1719;
    --signal-ok: #3ecf8e; --signal-ok-soft: #123326;
    --signal-neutral: #7d8494; --signal-neutral-soft: #232833;
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg); color: var(--text);
    min-height: 100vh; display: flex; width: 100%;
  }
  .sot * { box-sizing: border-box; }
  .sot .mono { font-family: 'JetBrains Mono', 'SF Mono', monospace; }
  .sot .disp { font-family: 'Space Grotesk', 'Inter', sans-serif; }

  .sot ::-webkit-scrollbar { width: 8px; height: 8px; }
  .sot ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 8px; }
  .sot ::-webkit-scrollbar-track { background: transparent; }

  .sot .sidebar { width: 216px; flex-shrink: 0; background: var(--bg-raised); border-right: 1px solid var(--line-soft);
    display: flex; flex-direction: column; padding: 18px 12px; }
  .sot .brand-row { display: flex; align-items: center; gap: 9px; padding: 4px 8px 20px 8px; }
  .sot .brand-mark { width: 26px; height: 26px; border-radius: 7px; background: var(--brand);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sot .brand-title { font-size: 13.5px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.15; }
  .sot .brand-sub { font-size: 10px; color: var(--text-faint); letter-spacing: .04em; text-transform: uppercase; }
  .sot .navitem { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px;
    color: var(--text-dim); font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 2px; transition: all .12s; border: none; background: none; width: 100%; text-align: left; }
  .sot .navitem:hover { background: var(--panel); color: var(--text); }
  .sot .navitem.active { background: var(--brand-soft); color: #ff8095; }
  .sot .nav-count { margin-left: auto; font-size: 10.5px; padding: 1px 6px; border-radius: 20px; background: var(--panel-2); color: var(--text-dim); }
  .sot .navitem.active .nav-count { background: rgba(255,255,255,0.1); color: #ff8095; }
  .sot .sidebar-foot { margin-top: auto; padding: 10px 8px; border-top: 1px solid var(--line-soft); font-size: 11px; color: var(--text-faint); }

  .sot .main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .sot .topbar { display: flex; align-items: center; gap: 14px; padding: 14px 22px; border-bottom: 1px solid var(--line-soft); flex-shrink: 0; }
  .sot .page-title { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
  .sot .page-sub { font-size: 12px; color: var(--text-faint); margin-top: 1px; }
  .sot .search-wrap { position: relative; margin-left: auto; width: 300px; }
  .sot .search-input { width: 100%; background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
    padding: 8px 12px 8px 32px; font-size: 12.5px; color: var(--text); outline: none; }
  .sot .search-input:focus { border-color: var(--signal-info); }
  .sot .search-input::placeholder { color: var(--text-faint); }
  .sot .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-faint); }
  .sot .search-results { position: absolute; top: 40px; left: 0; right: 0; background: var(--panel-2); border: 1px solid var(--line);
    border-radius: 10px; overflow: hidden; z-index: 40; box-shadow: 0 12px 32px rgba(0,0,0,.5); max-height: 320px; overflow-y: auto; }
  .sot .search-result-row { padding: 9px 12px; cursor: pointer; border-bottom: 1px solid var(--line-soft); }
  .sot .search-result-row:hover { background: var(--panel); }
  .sot .search-result-row:last-child { border-bottom: none; }

  .sot .content { flex: 1; overflow-y: auto; padding: 20px 22px 40px 22px; }

  .sot .grid { display: grid; gap: 14px; }
  .sot .stat-row { grid-template-columns: repeat(4, 1fr); margin-bottom: 16px; }
  .sot .two-col { grid-template-columns: 1.3fr 1fr; margin-bottom: 16px; }
  .sot .stat-card { background: var(--panel); border: 1px solid var(--line-soft); border-radius: 12px; padding: 14px 16px; }
  .sot .stat-card.hot { border-color: rgba(229,72,77,0.35); background: linear-gradient(180deg, var(--signal-crit-soft), var(--panel)); }
  .sot .stat-card.compact { padding: 9px 12px; display: flex; align-items: center; gap: 9px; }
  .sot .stat-card.compact .stat-icon { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; }
  .sot .stat-card.compact .stat-num { font-size: 16px; line-height: 1.15; }
  .sot .stat-card.compact .stat-label { font-size: 9.5px; text-transform: none; font-weight: 500; margin: 0; }
  .sot .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .sot .stat-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; }
  .sot .stat-num { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
  .sot .stat-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; }

  .sot .panel { background: var(--panel); border: 1px solid var(--line-soft); border-radius: 12px; overflow: hidden; }
  .sot .panel-head { display: flex; align-items: center; justify-content: between; padding: 13px 16px; border-bottom: 1px solid var(--line-soft); }
  .sot .panel-title { font-size: 12.5px; font-weight: 700; display: flex; align-items: center; gap: 7px; }
  .sot .panel-title-count { margin-left: auto; font-size: 11px; color: var(--text-faint); }
  .sot .panel-body { padding: 6px; }
  .sot .panel-body.pad { padding: 14px 16px; }
  .sot .panel-empty { padding: 26px 16px; text-align: center; color: var(--text-faint); font-size: 12px; }

  .sot .attn-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 10px; border-radius: 9px; }
  .sot .attn-item:hover { background: var(--panel-2); }
  .sot .signal-bars { display: flex; align-items: flex-end; gap: 2px; height: 15px; flex-shrink: 0; margin-top: 2px; }
  .sot .signal-bars .bar { width: 3px; border-radius: 1px; background: var(--line); }
  .sot .signal-bars .bar:nth-child(1) { height: 30%; }
  .sot .signal-bars .bar:nth-child(2) { height: 55%; }
  .sot .signal-bars .bar:nth-child(3) { height: 80%; }
  .sot .signal-bars .bar:nth-child(4) { height: 100%; }
  .sot .signal-bars.lvl-1 .bar:nth-child(1) { background: var(--signal-info); }
  .sot .signal-bars.lvl-2 .bar:nth-child(1), .sot .signal-bars.lvl-2 .bar:nth-child(2) { background: var(--signal-warn); }
  .sot .signal-bars.lvl-3 .bar:nth-child(1), .sot .signal-bars.lvl-3 .bar:nth-child(2), .sot .signal-bars.lvl-3 .bar:nth-child(3) { background: var(--signal-warn); }
  .sot .signal-bars.lvl-4 .bar { background: var(--signal-crit); }
  .sot .attn-text { font-size: 12.5px; line-height: 1.4; }
  .sot .attn-meta { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

  .sot .badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 20px; white-space: nowrap; }
  .sot .badge.info { background: var(--signal-info-soft); color: var(--signal-info); }
  .sot .badge.warn { background: var(--signal-warn-soft); color: var(--signal-warn); }
  .sot .badge.crit { background: var(--signal-crit-soft); color: var(--signal-crit); }
  .sot .badge.ok { background: var(--signal-ok-soft); color: var(--signal-ok); }
  .sot .badge.neutral { background: var(--signal-neutral-soft); color: var(--signal-neutral); }
  .sot .badge.brand { background: var(--brand-soft); color: #ff8095; }
  .sot .cc-group-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-faint); margin: 22px 0 10px 2px; }
  .sot .cc-group-label:first-child { margin-top: 0; }
  .sot .inline-edit { cursor: pointer; border-radius: 6px; padding: 3px 6px; margin: -3px -6px; transition: background .12s; display: inline-block; }
  .sot .inline-edit:hover { background: var(--panel-2); }
  .sot .inline-edit .inline-pencil { opacity: 0; margin-left: 6px; transition: opacity .12s; vertical-align: middle; }
  .sot .inline-edit:hover .inline-pencil { opacity: 0.5; }
  .sot .inline-edit-empty { color: var(--text-faint); font-style: italic; font-weight: 400; }
  .sot .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .sot .row { display: flex; align-items: center; gap: 12px; padding: 11px 10px; border-radius: 9px; cursor: pointer; }
  .sot .row:hover { background: var(--panel-2); }
  .sot .row-title { font-size: 12.5px; font-weight: 600; }
  .sot .row-sub { font-size: 11px; color: var(--text-faint); margin-top: 1px; }
  .sot .row-amt { font-size: 12px; font-weight: 600; color: var(--text-dim); }

  .sot .list-view-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
  .sot .filter-chip { font-size: 11.5px; padding: 6px 11px; border-radius: 20px; background: var(--panel); border: 1px solid var(--line-soft); color: var(--text-dim); cursor: pointer; font-weight: 500; }
  .sot .filter-chip.active { background: var(--brand-soft); border-color: rgba(200,40,63,0.4); color: #ff8095; }
  .sot .table-wrap { background: var(--panel); border: 1px solid var(--line-soft); border-radius: 12px; overflow: hidden; }
  .sot .t-row { display: grid; grid-template-columns: 18px 100px 1.6fr 1fr 110px 100px 1fr; gap: 10px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--line-soft); cursor: pointer; }
  .sot .t-row:last-child { border-bottom: none; }
  .sot .t-row:hover { background: var(--panel-2); }
  .sot .t-head { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--text-faint); font-weight: 700; cursor: default; }
  .sot .t-head:hover { background: none; }

  .sot .btn { font-size: 12px; font-weight: 600; padding: 7px 13px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .sot .btn:hover { border-color: var(--text-faint); }
  .sot .btn.ghost { background: none; }
  .sot .btn.primary { background: var(--brand); border-color: var(--brand); color: #fff; }
  .sot .btn.primary:hover { background: #b0243a; }
  .sot .btn.danger { background: var(--signal-crit-soft); border-color: rgba(229,72,77,0.4); color: var(--signal-crit); }
  .sot .btn.ok { background: var(--signal-ok-soft); border-color: rgba(62,207,142,0.4); color: var(--signal-ok); }
  .sot .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .sot .overlay { position: fixed; inset: 0; background: rgba(6,7,10,0.6); z-index: 50; display: flex; justify-content: flex-end; }
  .sot .detail-panel { width: 640px; max-width: 92vw; height: 100%; background: var(--bg-raised); border-left: 1px solid var(--line); overflow-y: auto; }
  .sot .detail-head { padding: 20px 22px 16px 22px; border-bottom: 1px solid var(--line-soft); position: sticky; top: 0; background: var(--bg-raised); z-index: 5; }
  .sot .close-btn { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; background: var(--panel); border: 1px solid var(--line-soft); color: var(--text-dim); cursor: pointer; }
  .sot .detail-body { padding: 18px 22px 40px 22px; }
  .sot .kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; margin: 14px 0; }
  .sot .kv-label { font-size: 10.5px; color: var(--text-faint); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 3px; }
  .sot .kv-val { font-size: 13px; font-weight: 500; }

  .sot .stage-track { display: flex; align-items: center; gap: 3px; overflow-x: auto; padding: 4px 0 10px 0; }
  .sot .stage-node { flex-shrink: 0; font-size: 9.5px; font-weight: 700; padding: 5px 8px; border-radius: 6px; background: var(--panel); color: var(--text-faint); white-space: nowrap; border: 1px solid var(--line-soft); }
  .sot .stage-node.done { background: var(--signal-ok-soft); color: var(--signal-ok); border-color: transparent; }
  .sot .stage-node.current { background: var(--brand); color: #fff; border-color: transparent; }
  .sot .stage-arrow { color: var(--line); flex-shrink: 0; font-size: 10px; }

  .sot .tabs { display: flex; gap: 3px; border-bottom: 1px solid var(--line-soft); margin: 18px 0 14px 0; flex-wrap: wrap; }
  .sot .tab { font-size: 12px; font-weight: 600; padding: 8px 4px; color: var(--text-faint); cursor: pointer; border-bottom: 2px solid transparent; margin-right: 16px; }
  .sot .tab.active { color: var(--text); border-color: var(--brand); }

  .sot .check-row { display: flex; align-items: flex-start; gap: 10px; padding: 9px 8px; border-radius: 8px; }
  .sot .check-row:hover { background: var(--panel); }
  .sot .check-box { width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid var(--line); flex-shrink: 0; margin-top: 1px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: var(--panel); }
  .sot .check-box.done { background: var(--signal-ok); border-color: var(--signal-ok); }
  .sot .check-box.progress { border-color: var(--signal-warn); }
  .sot .check-label { font-size: 12.5px; font-weight: 500; }
  .sot .check-label.done { text-decoration: line-through; color: var(--text-faint); }
  .sot .check-meta { font-size: 10.5px; color: var(--text-faint); margin-top: 2px; }

  .sot .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--text-dim); margin: 20px 0 8px 0; display: flex; align-items: center; gap: 6px; }

  .sot .org-card { background: var(--panel); border: 1px solid var(--line-soft); border-radius: 12px; padding: 16px; }
  .sot .org-avatar { width: 34px; height: 34px; border-radius: 9px; background: var(--panel-2); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: var(--text-dim); }
  .sot .org-stat { text-align: left; }
  .sot .org-stat .num { font-size: 16px; font-weight: 700; }
  .sot .org-stat .lbl { font-size: 10px; color: var(--text-faint); text-transform: uppercase; }

  .sot .agenda-day { display: flex; gap: 14px; margin-bottom: 4px; }
  .sot .agenda-date { width: 56px; flex-shrink: 0; text-align: center; padding-top: 10px; }
  .sot .agenda-date .d { font-size: 18px; font-weight: 700; line-height: 1; }
  .sot .agenda-date .m { font-size: 10px; color: var(--text-faint); text-transform: uppercase; margin-top: 2px; }
  .sot .agenda-items { flex: 1; border-left: 1px solid var(--line-soft); padding: 10px 0 10px 16px; }
  .sot .agenda-event { padding: 9px 12px; border-radius: 9px; background: var(--panel); border: 1px solid var(--line-soft); margin-bottom: 8px; cursor: pointer; }
  .sot .agenda-event:hover { border-color: var(--text-faint); }

  .sot .form-input, .sot .form-select, .sot .form-textarea { width: 100%; background: var(--panel); border: 1px solid var(--line); border-radius: 7px;
    padding: 7px 10px; font-size: 12.5px; color: var(--text); outline: none; font-family: inherit; color-scheme: dark; }
  .sot .form-input:focus, .sot .form-select:focus, .sot .form-textarea:focus { border-color: var(--signal-info); }
  .sot .form-textarea { resize: vertical; min-height: 56px; }
  .sot .form-row { margin-bottom: 12px; }
  .sot .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .sot .del-x { color: var(--text-faint); cursor: pointer; flex-shrink: 0; }
  .sot .del-x:hover { color: var(--signal-crit); }

  .sot .approver-row { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; background: var(--panel); border: 1px solid var(--line-soft); margin-bottom: 6px; }
  .sot .approver-row.current { border-color: rgba(232,162,60,0.5); background: var(--signal-warn-soft); }
  .sot .approver-idx { width: 20px; height: 20px; border-radius: 50%; background: var(--panel-2); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--text-faint); flex-shrink: 0; }
  .sot .approver-idx.done { background: var(--signal-ok); color: #0d1a14; }
  .sot .approver-idx.rejected { background: var(--signal-crit); color: #fff; }
  .sot .approver-name { font-size: 12.5px; font-weight: 600; flex: 1; }
  .sot .approver-date { font-size: 10.5px; color: var(--text-faint); }

  .sot .conn-item { background: var(--panel); border: 1px solid var(--line-soft); border-radius: 10px; padding: 12px; margin-bottom: 10px; }

  @media (max-width: 900px) {
    .sot .sidebar { position: fixed; z-index: 60; height: 100%; transform: translateX(-100%); transition: transform .2s; }
    .sot .sidebar.open { transform: translateX(0); }
    .sot .stat-row { grid-template-columns: 1fr 1fr; }
    .sot .two-col { grid-template-columns: 1fr; }
    .sot .t-row { grid-template-columns: 1fr; }
    .sot .kv-grid { grid-template-columns: 1fr; }
    .sot .form-row-2 { grid-template-columns: 1fr; }
    .sot .detail-panel { width: 100%; }
    .sot .search-wrap { width: 140px; }
  }
`;

/* ============================== DATE HELPERS ============================== */
const TODAY = new Date(2026, 6, 21); // 21 Jul 2026
const d = (s) => new Date(s + "T00:00:00");
const daysBetween = (a, b) => Math.round((a - b) / 86400000);
// Timezone-safe YYYY-MM-DD for <input type="date">. Using toISOString() shifts
// the date backward for anyone east of UTC (e.g. Maldives, UTC+5) because it
// converts to UTC first — that was the earlier "date fields glitch."
function dstr(dt) {
  if (!dt) return "";
  const y = dt.getFullYear(), m = String(dt.getMonth() + 1).padStart(2, "0"), day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseDateInput(v) { return v ? new Date(v + "T00:00:00") : null; }
function fmtDate(dt) {
  if (!dt) return "—";
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtMVR(n) {
  if (n == null) return "—";
  return "MVR " + n.toLocaleString("en-US");
}

// Data-entry speed helpers: reuse values already on file instead of retyping/retypo-ing them every time.
function distinctValues(sponsorships, key) {
  const set = new Set();
  sponsorships.forEach(s => { if (s[key] && String(s[key]).trim()) set.add(String(s[key]).trim()); });
  return Array.from(set).sort();
}
function lastSponsorshipFor(sponsorships, organizer) {
  const matches = sponsorships.filter(s => s.organizer.trim().toLowerCase() === organizer.trim().toLowerCase());
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.receivedDate - a.receivedDate)[0];
}
// Some events run a single day; some run for days/weeks; some sponsorships (annual partnerships etc.)
// span a year or more. These helpers format a start/end pair into one readable range either way.
function sameDay(a, b) { return a && b && a.toDateString() === b.toDateString(); }
function fmtDateRange(start, end) {
  if (!start) return "—";
  if (!end || sameDay(start, end)) return fmtDate(start);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${String(start.getDate()).padStart(2, "0")}–${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
  }
  if (sameYear) {
    return `${start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
  }
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}
function spanLabel(start, end) {
  if (!start || !end || sameDay(start, end)) return null;
  const days = Math.round((end - start) / 86400000) + 1;
  if (days < 14) return `${days} days`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  if (days < 330) return `${Math.round(days / 30)} months`;
  const years = Math.round(days / 365 * 10) / 10;
  return `${years} year${years === 1 ? "" : "s"}`;
}

/* ============================== WORKFLOW CONSTANTS ============================== */
// Simplified pipeline: intake → review → approval → execution → done.
// "Information Required" and "Memo Preparation" were folded into "Under Review" and "Memo Approval" respectively.
// "Approved" is no longer a stage you sit in — once every approver signs off, the request auto-advances to Execution.
const STAGES = ["New Request", "Under Review", "Memo Approval", "Execution", "Completed"];
const TERMINAL_ONLY = ["Rejected", "Archived"];

const APPROVAL_CHAIN = [
  "Brand Manager", "Financial Controller", "Financial Director",
  "Chief Commercial Officer", "Chief Financial Officer", "CEO",
];
function initApprovals() { return APPROVAL_CHAIN.map(a => ({ approver: a, status: "Pending", date: null })); }
function currentApprover(sp) { return (sp.approvals || []).find(a => a.status === "Pending") || null; }

const CONNECTIVITY_TYPES = ["ILL Connection", "5G AirFibre", "SIM with Data Package", "SuperNet Connection", "MiFi Device", "Existing SIM Package Upgrade"];
const HARDWARE_TYPES = ["5G AirFibre", "MiFi Device"]; // types that typically need a device return

// What WE commit to provide to the partner/organizer
const SPONSOR_DELIVERABLE_PRESETS = [
  "Connectivity", "Cash Contribution", "Tents", "Event Setup Support",
  "Backdrop Printing", "Giveaway Gifts", "Merchandise", "Marketing Support",
];
// What the PARTNER/organizer commits to provide back to us
const PARTNER_DELIVERABLE_PRESETS = [
  "Sponsorship Tier Status", "Logo & Branding at Event", "Branding on Social Media",
  "Complimentary Participation Slots", "Free Stall Space", "Public Relations Opportunity",
];
const DELIVERABLE_KIND = {
  sponsor: { field: "sponsorDeliverables", label: "Sponsor Deliverables", short: "Our Deliverables", presets: SPONSOR_DELIVERABLE_PRESETS },
  partner: { field: "partnerDeliverables", label: "Partner Deliverables", short: "Partner Deliverables", presets: PARTNER_DELIVERABLE_PRESETS },
};
// Suggested internal departments responsible for a sponsor deliverable (owner is always "Ooredoo" — this is just for internal routing)
const DEPARTMENT_SUGGESTIONS = ["Events Team", "Marketing", "Network Ops / IT", "CSR Team", "Finance", "Social Media Team"];

const SUGGESTED_TASKS = {
  "New Request": ["Read proposal", "Validate mandatory information", "Log request and assign Request ID"],
  "Under Review": ["Request missing information from organizer (if any)", "Evaluate strategic alignment", "Evaluate audience size & location", "Check budget reasonability", "Negotiate terms if required", "Draft sponsorship memo", "Confirm budget code with Finance", "Route memo into approval flow"],
  "Memo Approval": ["Follow up with the currently pending approver", "Confirm all approver sign-offs are logged"],
  "Execution": ["Notify organizer of approval", "Arrange sponsorship agreement signing", "Schedule partner photo", "Send official confirmation & offer to organizer", "Raise PR request", "Raise PO request", "Follow up with Finance on payment", "Send connectivity/device request if required"],
  "Completed": ["Collect event photos", "Confirm deliverables evidence received", "Archive coverage"],
};

/* ============================== SEED DATA ============================== */
function seedPayment(over = {}) {
  return {
    invoiceStatus: "N/A",
    pr: { status: "Not Started", dueDate: null, owner: "You" },
    po: { status: "Not Started", dueDate: null, owner: "You" },
    payment: { status: "N/A", dueDate: null, owner: "Finance" },
    financeFollowUpDate: null,
    ...over,
  };
}

const ORGS = [
  { id: "org-1", name: "Maldives Youth Football Association", category: "Sports", relationshipNotes: "Reliable partner, strong turnaround on deliverable evidence." },
  { id: "org-2", name: "Ooredoo CSR Programme (Internal)", category: "Internal / CSR", relationshipNotes: "Internal anniversary programme, coordinated via CSR team." },
  { id: "org-5", name: "Ministry of Youth, Sports & Community Empowerment", category: "Government", relationshipNotes: "High-value events, longer approval cycles historically." },
  { id: "org-7", name: "Male' City Marathon Organizing Committee", category: "Sports", relationshipNotes: "Annual flagship sports sponsorship, high visibility." },
];

const SEED_SPONSORSHIPS = [
  {
    id: "sp-14", requestId: "SP-2026-014", eventName: "Football Foari Kids Fest 2026", organizer: "Maldives Youth Football Association",
    eventType: "Community / Sports", region: "Malé — Central Park", valueType: "Cash", sponsorAmount: 185000, inKindDetails: "",
    sponsorshipType: "Cash + Connectivity", stage: "Execution", stageEnteredDate: d("2026-07-10"), receivedDate: d("2026-06-02"), eventDate: d("2026-08-15"), eventEndDate: null,
    memoNumber: "MEMO-2026-041", budgetCode: "MKT-CSR-0426",
    background: "Children's football festival aimed at grassroots participation across Malé schools.",
    benefits: "Logo on all branding, MC mentions, booth space, social media coverage.", justification: "Aligns with youth & community engagement pillar.", duration: "1 day event",
    approvals: APPROVAL_CHAIN.map(a => ({ approver: a, status: "Approved", date: d("2026-07-05") })),
    sponsorDeliverables: [
      { id: "sdl1", name: "Tents", department: "Events Team", dueDate: d("2026-08-13"), status: "In Progress", evidence: "", notes: "3 tents confirmed with vendor", inKindValue: 9000 },
      { id: "sdl2", name: "Backdrop Printing", department: "Marketing", dueDate: d("2026-08-12"), status: "Pending", evidence: "", notes: "", inKindValue: 3500 },
      { id: "sdl3", name: "Giveaway Gifts", department: "Marketing", dueDate: d("2026-08-14"), status: "Pending", evidence: "", notes: "200 kids' goodie bags", inKindValue: 12000 },
      { id: "sdl4", name: "Event Setup Support", department: "Events Team", dueDate: d("2026-08-15"), status: "Pending", evidence: "", notes: "", inKindValue: null },
      { id: "sdl5", name: "Connectivity", department: "Network Ops", dueDate: d("2026-08-13"), status: "Pending", evidence: "", notes: "", inKindValue: null, connectivityType: "5G AirFibre", deviceReturnDate: null, deviceReturnStatus: null },
    ],
    partnerDeliverables: [
      { id: "dl1", name: "Logo & Branding at Event", dueDate: d("2026-08-10"), status: "Done", evidence: "Banner proof received", notes: "", inKindValue: null },
      { id: "dl2", name: "Free Stall Space", dueDate: d("2026-08-14"), status: "In Progress", evidence: "", notes: "Booth layout confirmed", inKindValue: 5000 },
      { id: "dl3", name: "MC Mentions", dueDate: d("2026-08-15"), status: "Pending", evidence: "", notes: "", inKindValue: null },
      { id: "dl4", name: "Branding on Social Media", dueDate: d("2026-08-16"), status: "Pending", evidence: "", notes: "", inKindValue: null },
      { id: "dl5", name: "Photos Received", dueDate: d("2026-08-17"), status: "Pending", evidence: "", notes: "", inKindValue: null },
      { id: "dl6", name: "Monthly Report", dueDate: d("2026-09-05"), status: "Pending", evidence: "", notes: "", inKindValue: null },
    ],
    payment: seedPayment({
      invoiceStatus: "Received",
      pr: { status: "Raised", dueDate: d("2026-07-25"), owner: "You" },
      po: { status: "Not Started", dueDate: d("2026-07-28"), owner: "You" },
      payment: { status: "Pending", dueDate: d("2026-08-05"), owner: "Finance" },
      financeFollowUpDate: d("2026-07-14"),
    }),
    notes: "", tasks: [],
  },
  {
    id: "sp-22", requestId: "SP-2026-022", eventName: "21st Anniversary — Senior Citizen Activity Day", organizer: "Ooredoo CSR Programme (Internal)",
    eventType: "Internal CSR", region: "Malé", valueType: "In-Kind", sponsorAmount: 0, inKindDetails: "Venue support, transport coordination, internal comms and photography coverage.",
    sponsorshipType: "In-Kind", stage: "Memo Approval", stageEnteredDate: d("2026-07-15"), receivedDate: d("2026-06-25"), eventDate: d("2026-08-02"), eventEndDate: null,
    memoNumber: "MEMO-2026-046", budgetCode: "MKT-CSR-0430",
    background: "Activity day for senior citizens in Malé, anniversary CSR programme.", benefits: "Internal engagement, community goodwill.",
    justification: "Part of 21st anniversary flagship CSR calendar.", duration: "Half day",
    approvals: [
      { approver: "Brand Manager", status: "Approved", date: d("2026-07-16") },
      { approver: "Financial Controller", status: "Approved", date: d("2026-07-18") },
      { approver: "Financial Director", status: "Pending", date: null },
      { approver: "Chief Commercial Officer", status: "Pending", date: null },
      { approver: "Chief Financial Officer", status: "Pending", date: null },
      { approver: "CEO", status: "Pending", date: null },
    ],
    sponsorDeliverables: [
      { id: "sdl1", name: "Event Setup Support", department: "CSR Team", dueDate: d("2026-07-25"), status: "In Progress", evidence: "", notes: "Venue booking", inKindValue: null },
    ],
    partnerDeliverables: [
      { id: "dl2", name: "Public Relations Opportunity", dueDate: d("2026-07-24"), status: "Pending", evidence: "", notes: "Activity plan / internal comms", inKindValue: null },
    ],
    payment: seedPayment(), notes: "", tasks: [],
  },
  {
    id: "sp-10", requestId: "SP-2026-010", eventName: "Eid Al-Adha Regional Event — Kulhudhuffushi", organizer: "Ministry of Youth, Sports & Community Empowerment",
    eventType: "Regional / Religious", region: "Kulhudhuffushi", valueType: "Cash", sponsorAmount: 60000, inKindDetails: "",
    sponsorshipType: "Cash", stage: "Memo Approval", stageEnteredDate: d("2026-07-16"), receivedDate: d("2026-06-28"), eventDate: d("2026-07-28"), eventEndDate: null,
    memoNumber: "MEMO-2026-044", budgetCode: "MKT-REG-0412",
    background: "Regional Eid Al-Adha celebration sponsorship, northern atoll.", benefits: "Branding, VIP mentions.", justification: "Recurring annual regional goodwill sponsorship.", duration: "1 day",
    approvals: [
      { approver: "Brand Manager", status: "Approved", date: d("2026-07-17") },
      { approver: "Financial Controller", status: "Pending", date: null },
      { approver: "Financial Director", status: "Pending", date: null },
      { approver: "Chief Commercial Officer", status: "Pending", date: null },
      { approver: "Chief Financial Officer", status: "Pending", date: null },
      { approver: "CEO", status: "Pending", date: null },
    ],
    sponsorDeliverables: [],
    partnerDeliverables: [
      { id: "dl1", name: "Logo & Branding at Event", dueDate: d("2026-07-25"), status: "Pending", evidence: "", notes: "", inKindValue: null },
      { id: "dl2", name: "Public Relations Opportunity", dueDate: d("2026-07-29"), status: "Pending", evidence: "", notes: "Media coverage", inKindValue: null },
    ],
    payment: seedPayment({ invoiceStatus: "Pending", payment: { status: "Pending", dueDate: d("2026-07-26"), owner: "Finance" }, financeFollowUpDate: d("2026-07-20") }),
    notes: "", tasks: [],
  },
  {
    id: "sp-25", requestId: "SP-2026-025", eventName: "Inter-Atoll Swimming Championship", organizer: "Ministry of Youth, Sports & Community Empowerment",
    eventType: "Sports", region: "Multi-atoll", valueType: "Cash + In-Kind", sponsorAmount: 150000, inKindDetails: "Live results connectivity and on-site technical support across venues.",
    sponsorshipType: "Cash + Connectivity + Devices", stage: "Under Review", stageEnteredDate: d("2026-07-19"), receivedDate: d("2026-07-08"), eventDate: d("2026-09-02"), eventEndDate: d("2026-09-04"),
    memoNumber: "", budgetCode: "",
    background: "Multi-atoll swimming championship requiring live results connectivity.", benefits: "Branding, connectivity naming rights, VIP access.",
    justification: "High visibility national sports event.", duration: "3 days",
    approvals: initApprovals(),
    sponsorDeliverables: [
      { id: "sdl1", name: "Connectivity", department: "Network Ops", dueDate: d("2026-08-30"), status: "Pending", evidence: "", notes: "", inKindValue: null, connectivityType: "ILL Connection", deviceReturnDate: null, deviceReturnStatus: null },
      { id: "sdl2", name: "Connectivity", department: "Network Ops", dueDate: d("2026-07-19"), status: "Done", evidence: "", notes: "Temporary device from prior test run is overdue for return.", inKindValue: null, connectivityType: "MiFi Device", deviceReturnDate: d("2026-07-19"), deviceReturnStatus: "Pending Return" },
    ],
    partnerDeliverables: [{ id: "dl1", name: "Evaluation Notes", dueDate: d("2026-07-24"), status: "In Progress", evidence: "", notes: "", inKindValue: null }],
    payment: seedPayment(),
    notes: "Temporary device from prior test run is overdue for return.", tasks: [],
  },
  {
    id: "sp-18", requestId: "SP-2026-018", eventName: "Male' City Marathon 2026", organizer: "Male' City Marathon Organizing Committee",
    eventType: "Sports", region: "Malé", valueType: "Cash", sponsorAmount: 200000, inKindDetails: "",
    sponsorshipType: "Cash + Connectivity", stage: "Under Review", stageEnteredDate: d("2026-07-12"), receivedDate: d("2026-07-01"), eventDate: d("2026-09-20"), eventEndDate: null,
    memoNumber: "", budgetCode: "",
    background: "Annual flagship marathon, nationwide visibility.", benefits: "Title branding, booth, live connectivity, VIP.", justification: "Highest-reach annual sports sponsorship.", duration: "1 day",
    approvals: initApprovals(),
    sponsorDeliverables: [], partnerDeliverables: [], payment: seedPayment(), notes: "", tasks: [],
  },
];

/* ============================== FOLLOW-UP ENGINE ============================== */
const DEFAULT_THRESHOLDS = {
  approvalWarnDays: 3, approvalUrgentDays: 4, approvalCriticalDays: 6,
  connectivityWindowDays: 7, connectivityCriticalDays: 2,
  eventApprovalWindowDays: 5,
};
let THRESHOLDS = { ...DEFAULT_THRESHOLDS };

function generateFollowUps(sp) {
  const T = THRESHOLDS;
  const items = [];
  const daysInStage = daysBetween(TODAY, sp.stageEnteredDate);
  const daysToEvent = daysBetween(sp.eventDate, TODAY);

  if (sp.stage === "Memo Approval") {
    const cur = currentApprover(sp);
    if (cur) {
      const lastApproved = [...(sp.approvals || [])].reverse().find(a => a.status === "Approved" && a.date);
      const since = lastApproved ? lastApproved.date : sp.stageEnteredDate;
      const daysWaiting = daysBetween(TODAY, since);
      if (daysWaiting >= T.approvalWarnDays) {
        items.push({
          text: `Memo pending with ${cur.approver} for ${daysWaiting} day${daysWaiting === 1 ? "" : "s"}.`,
          level: daysWaiting >= T.approvalCriticalDays ? 4 : daysWaiting >= T.approvalUrgentDays ? 3 : 2,
          category: "Approval", owner: cur.approver, sortDate: since,
        });
      }
    } else {
      items.push({ text: `All approvers have signed off — this should auto-advance to Execution; check if it's stuck.`, level: 2, category: "Approval", owner: "You", sortDate: sp.stageEnteredDate });
    }
  }
  if (sp.stage === "Under Review" && daysInStage >= T.approvalWarnDays) {
    items.push({
      text: `Request stalled at "${sp.stage}" for ${daysInStage} days.`,
      level: daysInStage >= T.approvalCriticalDays ? 4 : daysInStage >= T.approvalUrgentDays ? 3 : 2,
      category: "Approval", owner: "You", sortDate: sp.stageEnteredDate,
    });
  }

  if (sp.payment && ["Execution", "Completed"].includes(sp.stage)) {
    const { pr, po, payment } = sp.payment;
    if (!["Approved", "N/A", "Not Required"].includes(pr.status)) {
      const overdue = pr.dueDate ? daysBetween(TODAY, pr.dueDate) : -1;
      items.push({ text: `PR issuance still ${pr.status.toLowerCase()}${overdue > 0 ? ` (${overdue} days past due)` : ""}.`, level: overdue > 0 ? 4 : 2, category: "PR", owner: pr.owner || "You", sortDate: pr.dueDate || TODAY });
    }
    if (!["Approved", "N/A", "Not Required"].includes(po.status)) {
      const overdue = po.dueDate ? daysBetween(TODAY, po.dueDate) : -1;
      items.push({ text: `PO issuance still ${po.status.toLowerCase()}${overdue > 0 ? ` (${overdue} days past due)` : ""}.`, level: overdue > 0 ? 4 : 2, category: "PO", owner: po.owner || "You", sortDate: po.dueDate || TODAY });
    }
    if (payment.status === "Pending") {
      const overdue = payment.dueDate ? daysBetween(TODAY, payment.dueDate) : 0;
      items.push({ text: `Finance payment still pending${overdue > 0 ? ` (${overdue} days past due)` : ""}.`, level: overdue > 0 ? 4 : 2, category: "Payment", owner: payment.owner || "Finance", sortDate: payment.dueDate || TODAY });
    }
  }

  // Connectivity items now live inside Sponsor Deliverables (identified by a connectivityType) —
  // still get their own early-warning window ahead of the event, plus device-return tracking.
  (sp.sponsorDeliverables || []).forEach((dl) => {
    if (!dl.connectivityType) return;
    if (dl.status !== "Done" && daysToEvent >= 0 && daysToEvent <= T.connectivityWindowDays) {
      items.push({ text: `${dl.connectivityType} setup due in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"}.`, level: daysToEvent <= T.connectivityCriticalDays ? 4 : 3, category: "Sponsor Deliverables", owner: dl.department || "Technical Team", sortDate: dl.dueDate || sp.eventDate });
    }
    if (dl.deviceReturnDate && dl.deviceReturnStatus !== "Returned") {
      const overdue = daysBetween(TODAY, dl.deviceReturnDate);
      if (overdue >= 0) items.push({ text: `${dl.connectivityType} should be returned (${overdue} day${overdue === 1 ? "" : "s"} overdue).`, level: 4, category: "Device Return", owner: "You", sortDate: dl.deviceReturnDate });
    }
  });

  Object.values(DELIVERABLE_KIND).forEach(({ field, label }) => {
    const list = sp[field];
    if (list && list.length) {
      // Overdue = due date has passed (TODAY is after the due date). Previously inverted — fixed.
      const overdueItems = list.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) > 0);
      if (overdueItems.length > 0 && !["Rejected", "Archived"].includes(sp.stage)) {
        items.push({
          text: `${overdueItems.length} ${label.toLowerCase()} item${overdueItems.length === 1 ? "" : "s"} past due date (${overdueItems.map(x => x.name).join(", ")}).`,
          level: 4, category: label, owner: "You", sortDate: overdueItems.sort((a, b) => a.dueDate - b.dueDate)[0].dueDate,
        });
      }
    }
  });
  if (daysToEvent >= 0 && daysToEvent <= T.eventApprovalWindowDays && !["Execution", "Completed", "Archived", "Rejected"].includes(sp.stage)) {
    items.push({ text: `Event starts in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"} — sponsorship not yet approved.`, level: 4, category: "Deadline", owner: "You", sortDate: sp.eventDate });
  }
  return items.map((it, i) => ({ ...it, sponsorshipId: sp.id, requestId: sp.requestId, eventName: sp.eventName, key: `${sp.id}::${it.category}::${i}` }));
}

function computeHealth(sp) {
  if (["Archived"].includes(sp.stage)) return { status: "archived", label: "Archived", cls: "neutral" };
  if (["Rejected"].includes(sp.stage)) return { status: "rejected", label: "Rejected", cls: "crit" };
  const fu = generateFollowUps(sp);
  const top = fu.reduce((m, f) => Math.max(m, f.level), 0);
  if (top >= 4) return { status: "critical", label: "Critical", cls: "crit" };
  if (top === 3) return { status: "at-risk", label: "At Risk", cls: "warn" };
  if (top === 2) return { status: "watch", label: "Watch", cls: "warn" };
  return { status: "healthy", label: "On Track", cls: "ok" };
}

function stageBadgeClass(stage) {
  if (["Completed"].includes(stage)) return "ok";
  if (["Execution", "Memo Approval"].includes(stage)) return "info";
  if (["Rejected"].includes(stage)) return "crit";
  if (["Archived"].includes(stage)) return "neutral";
  return "warn";
}
function SignalBars({ level }) {
  return (
    <div className={`signal-bars lvl-${level}`}>
      <div className="bar" /><div className="bar" /><div className="bar" /><div className="bar" />
    </div>
  );
}
function levelBadge(level) {
  if (level >= 4) return { cls: "crit", label: "Critical" };
  if (level === 3) return { cls: "warn", label: "Urgent" };
  if (level === 2) return { cls: "warn", label: "Due Soon" };
  return { cls: "info", label: "Info" };
}

/* ============================== MAIN APP ============================== */
export default function SponsorshipTracker() {
  const [sponsorships, setSponsorships] = useState(SEED_SPONSORSHIPS);
  const [view, setView] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [detailTab, setDetailTab] = useState("overview");
  const [dismissed, setDismissed] = useState({});
  const [showAcked, setShowAcked] = useState(false);
  const [feedExpanded, setFeedExpanded] = useState(false);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [annualBudget, setAnnualBudget] = useState(2500000);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem("sot:acknowledged");
      if (a) setDismissed(JSON.parse(a));
    } catch (e) { /* no saved acknowledgements yet */ }
    try {
      const t = localStorage.getItem("sot:thresholds");
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...JSON.parse(t) });
    } catch (e) { /* no saved thresholds yet */ }
    try {
      const b = localStorage.getItem("sot:annualBudget");
      if (b) setAnnualBudget(Number(JSON.parse(b)) || 2500000);
    } catch (e) { /* no saved budget yet */ }
    setLoaded(true);
  }, []);

  THRESHOLDS = thresholds;

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("sot:acknowledged", JSON.stringify(dismissed)); setSaveError(false); }
    catch (e) { setSaveError(true); }
  }, [dismissed, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("sot:thresholds", JSON.stringify(thresholds)); } catch (e) { /* best effort */ }
  }, [thresholds, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("sot:annualBudget", JSON.stringify(annualBudget)); } catch (e) { /* best effort */ }
  }, [annualBudget, loaded]);

  const allFollowUpsRaw = useMemo(() => {
    const arr = sponsorships.flatMap(generateFollowUps);
    return arr.sort((a, b) => (b.level !== a.level ? b.level - a.level : daysBetween(a.sortDate, TODAY) - daysBetween(b.sortDate, TODAY)));
  }, [sponsorships, thresholds]);

  const allFollowUps = allFollowUpsRaw.filter(f => !dismissed[f.key]);
  const ackedFollowUps = allFollowUpsRaw.filter(f => dismissed[f.key]);

  function acknowledge(key) { setDismissed(prev => ({ ...prev, [key]: true })); }
  function unacknowledge(key) { setDismissed(prev => { const n = { ...prev }; delete n[key]; return n; }); }

  function openDetail(id, tab) { setSelectedId(id); setDetailTab(tab || "overview"); }
  function closeDetail() { setSelectedId(null); }

  function nextRequestId() {
    const nums = sponsorships.map(s => parseInt((s.requestId.match(/(\d+)$/) || [0, 0])[1], 10));
    return `SP-2026-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, "0")}`;
  }

  function createSponsorship(data) {
    const id = "sp-" + Date.now();
    const newSp = {
      id, requestId: nextRequestId(), eventName: data.eventName || "Untitled Event", organizer: data.organizer || "Unknown Organizer",
      eventType: data.eventType || "", region: data.region || "",
      valueType: data.valueType || "Cash", sponsorAmount: Number(data.sponsorAmount) || 0, inKindDetails: data.inKindDetails || "",
      sponsorshipType: data.sponsorshipType || "", stage: "New Request", stageEnteredDate: TODAY, receivedDate: TODAY,
      eventDate: data.eventDate ? parseDateInput(data.eventDate) : TODAY,
      eventEndDate: data.eventEndDate ? parseDateInput(data.eventEndDate) : null,
      memoNumber: "", budgetCode: "", background: data.background || "", benefits: "", justification: "", duration: "",
      approvals: initApprovals(), sponsorDeliverables: [], partnerDeliverables: [], payment: seedPayment(),
      notes: "", tasks: [],
    };
    setSponsorships(prev => [newSp, ...prev]);
    setNewRequestOpen(false);
    openDetail(id);
  }

  function updateFields(spId, patch) { setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, ...patch } : s)); }
  function updatePaymentSub(spId, subKey, patch) {
    setSponsorships(prev => prev.map(s => s.id !== spId ? s : { ...s, payment: { ...s.payment, [subKey]: { ...s.payment[subKey], ...patch } } }));
  }
  function updatePaymentTop(spId, patch) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, payment: { ...s.payment, ...patch } } : s));
  }
  // kind is "sponsor" (what we provide) or "partner" (what the partner/organizer provides back)
  function addDeliverable(spId, kind, dl) {
    const field = DELIVERABLE_KIND[kind].field;
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, [field]: [...(s[field] || []), { id: "dl-" + Date.now(), status: "Pending", evidence: "", notes: "", ...dl }] } : s));
  }
  function removeDeliverable(spId, kind, dlId) {
    const field = DELIVERABLE_KIND[kind].field;
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, [field]: s[field].filter(dd => dd.id !== dlId) } : s));
  }
  function editDeliverable(spId, kind, dlId, patch) {
    const field = DELIVERABLE_KIND[kind].field;
    setSponsorships(prev => prev.map(s => s.id !== spId ? s : { ...s, [field]: s[field].map(dd => dd.id === dlId ? { ...dd, ...patch } : dd) }));
  }
  function cycleDeliverable(spId, kind, dlId) {
    const field = DELIVERABLE_KIND[kind].field;
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      return { ...s, [field]: s[field].map(dl => dl.id !== dlId ? dl : { ...dl, status: dl.status === "Pending" ? "In Progress" : dl.status === "In Progress" ? "Done" : "Pending" }) };
    }));
  }
  function addTask(spId, text) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, tasks: [...s.tasks, { id: "t-" + Date.now(), text, done: false }] } : s));
  }
  function loadSuggestedTasks(spId, stage) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      const existing = new Set(s.tasks.map(t => t.text));
      const toAdd = (SUGGESTED_TASKS[stage] || []).filter(t => !existing.has(t)).map(text => ({ id: "t-" + Date.now() + Math.random(), text, done: false }));
      return { ...s, tasks: [...s.tasks, ...toAdd] };
    }));
  }
  function toggleTaskItem(spId, taskId) {
    setSponsorships(prev => prev.map(s => s.id !== spId ? s : { ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }));
  }
  function removeTask(spId, taskId) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, tasks: s.tasks.filter(t => t.id !== taskId) } : s));
  }
  function advanceStage(spId, dir) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      const idx = STAGES.indexOf(s.stage);
      if (idx === -1) return s;
      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= STAGES.length) return s;
      return { ...s, stage: STAGES[nextIdx], stageEnteredDate: TODAY };
    }));
  }
  function setStageDirect(spId, stage) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, stage, stageEnteredDate: TODAY } : s));
  }
  function setApproverStatus(spId, approver, status) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      const approvals = s.approvals.map(a => a.approver === approver ? { ...a, status, date: status === "Pending" ? null : TODAY } : a);
      let stage = s.stage;
      if (status === "Rejected") stage = "Rejected";
      else if (approvals.every(a => a.status === "Approved") && s.stage === "Memo Approval") stage = "Execution"; // fully signed off — auto-advance, no separate "Approved" holding stage
      return { ...s, approvals, stage, stageEnteredDate: stage !== s.stage ? TODAY : s.stageEnteredDate };
    }));
  }
  function resetApprovals(spId) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, approvals: initApprovals() } : s));
  }
  function deleteSponsorship(spId) {
    setSponsorships(prev => prev.filter(s => s.id !== spId));
    closeDetail();
  }

  function exportToExcel() {
    const rows = sponsorships.map(s => {
      const h = computeHealth(s);
      const fu = generateFollowUps(s);
      const sponsorDone = (s.sponsorDeliverables || []).filter(x => x.status === "Done").length;
      const partnerDone = (s.partnerDeliverables || []).filter(x => x.status === "Done").length;
      const inKindTotal = [...(s.sponsorDeliverables || []), ...(s.partnerDeliverables || [])]
        .reduce((sum, x) => sum + (Number(x.inKindValue) || 0), 0);
      return {
        "Request ID": s.requestId,
        "Event Name": s.eventName,
        "Organizer": s.organizer,
        "Stage": s.stage,
        "Health": h.label,
        "Event Type": s.eventType,
        "Region": s.region,
        "Value Type": s.valueType,
        "Sponsor Amount (MVR)": s.valueType === "In-Kind" ? "" : s.sponsorAmount,
        "In-Kind Details": s.inKindDetails || "",
        "Event Date": fmtDate(s.eventDate),
        "Event End Date": s.eventEndDate ? fmtDate(s.eventEndDate) : "",
        "Request Received": fmtDate(s.receivedDate),
        "Memo Number": s.memoNumber,
        "Budget Code": s.budgetCode,
        "Memo Approval — Awaiting": currentApprover(s) ? currentApprover(s).approver : (s.approvals.every(a => a.status === "Approved") ? "All approved" : ""),
        "PR Status": s.payment.pr.status,
        "PO Status": s.payment.po.status,
        "Payment Status": s.payment.payment.status,
        "Payment Due": fmtDate(s.payment.payment.dueDate),
        "Connectivity Items": (s.sponsorDeliverables || []).filter(x => x.connectivityType).map(x => x.connectivityType).join(", "),
        "Sponsor Deliverables Progress": (s.sponsorDeliverables || []).length ? `${sponsorDone}/${s.sponsorDeliverables.length}` : "",
        "Partner Deliverables Progress": (s.partnerDeliverables || []).length ? `${partnerDone}/${s.partnerDeliverables.length}` : "",
        "Deliverables In-Kind Value (MVR)": inKindTotal || "",
        "Open Follow-ups": fu.map(f => f.text).join(" | "),
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Object.keys(rows[0] || {}).map(k => ({ wch: Math.min(40, Math.max(12, k.length + 4)) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sponsorships");
    const dateStamp = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, "0")}-${String(TODAY.getDate()).padStart(2, "0")}`;
    XLSX.writeFile(wb, `sponsorship-tracker-${dateStamp}.xlsx`);
  }

  const selected = sponsorships.find(s => s.id === selectedId) || null;

  const pendingApprovals = sponsorships.filter(s => s.stage === "Memo Approval");
  const upcomingEvents = sponsorships.filter(s => daysBetween(s.eventDate, TODAY) >= 0 && daysBetween(s.eventDate, TODAY) <= 21).sort((a, b) => a.eventDate - b.eventDate);
  const pendingPayments = sponsorships.filter(s => s.payment && s.payment.payment.status === "Pending");
  const overdueCount = allFollowUps.filter(f => f.level === 4).length;
  const recentRequests = [...sponsorships].sort((a, b) => b.receivedDate - a.receivedDate).slice(0, 5);
  const recentApprovals = sponsorships.filter(s => ["Execution", "Completed"].includes(s.stage)).sort((a, b) => b.stageEnteredDate - a.stageEnteredDate).slice(0, 5);
  const sponsorsRequiringAction = ORGS.filter(o => sponsorships.some(s => s.organizer === o.name && generateFollowUps(s).some(f => f.level >= 3)));

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sponsorships.filter(s => s.eventName.toLowerCase().includes(q) || s.organizer.toLowerCase().includes(q) || s.requestId.toLowerCase().includes(q) || s.memoNumber.toLowerCase().includes(q) || s.stage.toLowerCase().includes(q)).slice(0, 8);
  }, [query, sponsorships]);

  const filteredPipeline = sponsorships.filter(s => stageFilter === "All" || s.stage === stageFilter);

  const NAV = [
    { key: "dashboard", label: "Command Center", icon: LayoutDashboard, count: overdueCount || null },
    { key: "sponsors", label: "Sponsorship Profiles", icon: Users, count: sponsorships.length },
    { key: "calendar", label: "Calendar", icon: CalendarIcon, count: upcomingEvents.length },
    { key: "pipeline", label: "Sponsorship Pipeline", icon: ListChecks, count: sponsorships.length },
  ];

  return (
    <div className="sot">
      <style>{STYLE}</style>
      <div className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Signal size={14} color="#fff" /></div>
          <div><div className="brand-title disp">Sponsorship Ops</div><div className="brand-sub">Command Center</div></div>
        </div>
        {NAV.map(n => (
          <button key={n.key} className={`navitem ${view === n.key ? "active" : ""}`} onClick={() => setView(n.key)}>
            <n.icon size={15} />{n.label}{n.count ? <span className="nav-count">{n.count}</span> : null}
          </button>
        ))}
        <div className="sidebar-foot">{sponsorships.length} active sponsorships tracked · Today, {fmtDate(TODAY)}</div>
      </div>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-title disp">
              {view === "dashboard" && "What needs my attention"}
              {view === "pipeline" && "Sponsorship Pipeline"}
              {view === "sponsors" && "Sponsorship Profiles"}
              {view === "calendar" && "Calendar"}
            </div>
            <div className="page-sub">
              {view === "dashboard" && `${overdueCount} critical item${overdueCount === 1 ? "" : "s"} · ${pendingApprovals.length} in memo approval`}
              {view === "pipeline" && `${filteredPipeline.length} of ${sponsorships.length} requests`}
              {view === "sponsors" && `${sponsorships.length} sponsorship profiles on file`}
              {view === "calendar" && `${upcomingEvents.length} events in the next 21 days`}
            </div>
          </div>
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search organizer, event, memo, request ID…" value={query} onChange={e => setQuery(e.target.value)} />
            {query.trim() && (
              <div className="search-results">
                {searchResults.length === 0 && <div className="panel-empty">No matches.</div>}
                {searchResults.map(s => (
                  <div key={s.id} className="search-result-row" onClick={() => { openDetail(s.id); setQuery(""); }}>
                    <div className="row-title">{s.eventName}</div>
                    <div className="row-sub">{s.requestId} · {s.organizer} · <span className={`badge ${stageBadgeClass(s.stage)}`}>{s.stage}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn" onClick={exportToExcel} title="Export all sponsorships to Excel"><Download size={13} /> Export</button>
          <button className="btn primary" onClick={() => setNewRequestOpen(true)}>+ New Request</button>
          <button className="close-btn" title="Follow-up rules" onClick={() => setSettingsOpen(true)}><SettingsIcon size={14} /></button>
        </div>

        <div className="content">
          {view === "dashboard" && (
            <DashboardView overdueCount={overdueCount} pendingApprovals={pendingApprovals} upcomingEvents={upcomingEvents}
              pendingPayments={pendingPayments} annualBudget={annualBudget} setAnnualBudget={setAnnualBudget}
              allFollowUps={allFollowUps} ackedFollowUps={ackedFollowUps} recentRequests={recentRequests} recentApprovals={recentApprovals}
              sponsorsRequiringAction={sponsorsRequiringAction} openDetail={openDetail} sponsorships={sponsorships}
              acknowledge={acknowledge} unacknowledge={unacknowledge} showAcked={showAcked} setShowAcked={setShowAcked}
              feedExpanded={feedExpanded} setFeedExpanded={setFeedExpanded} />
          )}
          {view === "pipeline" && <PipelineView sponsorships={filteredPipeline} stageFilter={stageFilter} setStageFilter={setStageFilter} openDetail={openDetail} />}
          {view === "sponsors" && <SponsorshipProfilesView sponsorships={sponsorships} openDetail={openDetail} />}
          {view === "calendar" && <CalendarView sponsorships={sponsorships} openDetail={openDetail} />}
        </div>
      </div>

      {selected && (
        <div className="overlay" onClick={closeDetail}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            <DetailPanel sp={selected} tab={detailTab} setTab={setDetailTab} close={closeDetail}
              cycleDeliverable={cycleDeliverable} advanceStage={advanceStage}
              updateFields={updateFields} updatePaymentSub={updatePaymentSub} updatePaymentTop={updatePaymentTop}
              addDeliverable={addDeliverable} removeDeliverable={removeDeliverable} editDeliverable={editDeliverable}
              setStageDirect={setStageDirect} setApproverStatus={setApproverStatus} resetApprovals={resetApprovals}
              addTask={addTask} loadSuggestedTasks={loadSuggestedTasks} toggleTaskItem={toggleTaskItem} removeTask={removeTask}
              deleteSponsorship={deleteSponsorship} sponsorships={sponsorships} />
          </div>
        </div>
      )}

      {newRequestOpen && (
        <div className="overlay" onClick={() => setNewRequestOpen(false)}>
          <div className="detail-panel" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <NewRequestForm onCreate={createSponsorship} close={() => setNewRequestOpen(false)} sponsorships={sponsorships} />
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="overlay" onClick={() => setSettingsOpen(false)}>
          <div className="detail-panel" style={{ width: 420 }} onClick={e => e.stopPropagation()}>
            <SettingsPanel thresholds={thresholds} setThresholds={setThresholds} close={() => setSettingsOpen(false)} saveError={saveError} />
          </div>
        </div>
      )}
    </div>
  );
}

function Signal({ size = 14, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="14" width="3" height="8" rx="1" fill={color} />
      <rect x="8" y="10" width="3" height="12" rx="1" fill={color} />
      <rect x="14" y="6" width="3" height="16" rx="1" fill={color} />
      <rect x="20" y="2" width="3" height="20" rx="1" fill={color} opacity="0.5" />
    </svg>
  );
}

/* ============================== DASHBOARD ============================== */
function DashboardView(props) {
  const { overdueCount, upcomingEvents, allFollowUps, ackedFollowUps,
    openDetail, sponsorships, acknowledge, unacknowledge, showAcked, setShowAcked, annualBudget, setAnnualBudget } = props;
  const [expanded, setExpanded] = useState({});
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(annualBudget);
  const [monthlyView, setMonthlyView] = useState("value"); // "value" | "count"

  const pendingApprovals = sponsorships.filter(s => s.stage === "Memo Approval");
  const pendingPaymentsCount = sponsorships.filter(s => s.payment && s.payment.payment.status === "Pending").length;

  // Pipeline Overview — how many requests sit at each stage of the simplified funnel.
  // "Approved" isn't a held stage anymore (auto-advances to Execution once fully signed off),
  // so it's shown here as a cumulative count of everything that has passed Memo Approval.
  const pipelineStats = useMemo(() => {
    const counts = { "New Request": 0, "Under Review": 0, "Memo Approval": 0, "Execution": 0, "Completed": 0 };
    sponsorships.forEach(s => { if (counts[s.stage] !== undefined) counts[s.stage]++; });
    const approved = sponsorships.filter(s => ["Execution", "Completed"].includes(s.stage)).length;
    return [
      { label: "New Requests", num: counts["New Request"], color: "warn" },
      { label: "Under Review", num: counts["Under Review"], color: "warn" },
      { label: "Pending Approval", num: counts["Memo Approval"], color: "info" },
      { label: "Approved", num: approved, color: "ok" },
      { label: "Execution", num: counts["Execution"], color: "info" },
      { label: "Completed", num: counts["Completed"], color: "ok" },
    ];
  }, [sponsorships]);

  // Budget Monitoring — committed = value already approved & moving (Execution/Completed);
  // pending = value still in the pipeline and not yet committed; balance = annual budget minus committed.
  const budgetStats = useMemo(() => {
    const committed = sponsorships.filter(s => ["Execution", "Completed"].includes(s.stage)).reduce((sum, s) => sum + (Number(s.sponsorAmount) || 0), 0);
    const pending = sponsorships.filter(s => ["New Request", "Under Review", "Memo Approval"].includes(s.stage)).reduce((sum, s) => sum + (Number(s.sponsorAmount) || 0), 0);
    // Balance = what's left after BOTH committed and pipeline-pending amounts are reserved —
    // previously only subtracted committed, which meant the three ring segments summed to
    // (annualBudget + pending) instead of `total`, throwing every percentage off.
    return { committed, pending, balance: annualBudget - committed - pending };
  }, [sponsorships, annualBudget]);

  // Monthly Commitments — count & total value of sponsorships per event month (excludes Rejected/Archived).
  const monthlyStats = useMemo(() => {
    const map = {};
    sponsorships.filter(s => !["Rejected", "Archived"].includes(s.stage)).forEach(s => {
      const key = `${s.eventDate.getFullYear()}-${String(s.eventDate.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = { key, count: 0, value: 0, label: s.eventDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
      map[key].count += 1;
      map[key].value += Number(s.sponsorAmount) || 0;
    });
    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  }, [sponsorships]);
  const maxMonthlyValue = Math.max(1, ...monthlyStats.map(m => m.value));
  const maxMonthlyCount = Math.max(1, ...monthlyStats.map(m => m.count));

  // Deliverables Monitor — aggregate sponsor vs partner deliverable status across the active portfolio
  // so deliverable management has its own dedicated, distinguishable home in the Command Center.
  const deliverablesMonitor = useMemo(() => {
    const active = sponsorships.filter(s => !["Archived", "Rejected"].includes(s.stage));
    let sponsorTotal = 0, sponsorDone = 0, sponsorOverdue = 0;
    let partnerTotal = 0, partnerDone = 0, partnerOverdue = 0;
    const rows = [];
    active.forEach(s => {
      const sd = s.sponsorDeliverables || [], pd = s.partnerDeliverables || [];
      const sDone = sd.filter(x => x.status === "Done").length;
      const pDone = pd.filter(x => x.status === "Done").length;
      const sOver = sd.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) > 0).length;
      const pOver = pd.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) > 0).length;
      sponsorTotal += sd.length; partnerTotal += pd.length;
      sponsorDone += sDone; partnerDone += pDone;
      sponsorOverdue += sOver; partnerOverdue += pOver;
      if (sd.length - sDone > 0 || pd.length - pDone > 0) rows.push({ sp: s, sd, pd, sDone, pDone, sOver, pOver });
    });
    rows.sort((a, b) => (b.sOver + b.pOver) - (a.sOver + a.pOver));
    return { sponsorTotal, sponsorDone, sponsorOverdue, partnerTotal, partnerDone, partnerOverdue, rows };
  }, [sponsorships]);
  const deliverablesOverdueCount = deliverablesMonitor.sponsorOverdue + deliverablesMonitor.partnerOverdue;

  // Group open follow-ups by sponsorship so you see one line per PROJECT, not one per issue —
  // this is what actually tells you "what do I follow up on" at a glance instead of a flat list.
  const grouped = useMemo(() => {
    const byId = {};
    allFollowUps.forEach(f => {
      if (!byId[f.sponsorshipId]) byId[f.sponsorshipId] = { sponsorshipId: f.sponsorshipId, requestId: f.requestId, eventName: f.eventName, items: [] };
      byId[f.sponsorshipId].items.push(f);
    });
    const groups = Object.values(byId).map(g => {
      const sp = sponsorships.find(s => s.id === g.sponsorshipId);
      return { ...g, organizer: sp ? sp.organizer : "", topLevel: Math.max(...g.items.map(i => i.level)) };
    });
    return groups.sort((a, b) => b.topLevel - a.topLevel);
  }, [allFollowUps, sponsorships]);

  const flaggedCount = grouped.length;
  const onTrackCount = sponsorships.filter(s => !["Archived", "Rejected"].includes(s.stage)).length - flaggedCount;

  const healthCounts = useMemo(() => {
    const active = sponsorships.filter(s => !["Archived", "Rejected"].includes(s.stage));
    let critical = 0, atRisk = 0, healthy = 0;
    active.forEach(s => {
      const st = computeHealth(s).status;
      if (st === "critical") critical++;
      else if (st === "at-risk" || st === "watch") atRisk++;
      else healthy++;
    });
    return { critical, atRisk, healthy, total: active.length };
  }, [sponsorships]);

  return (
    <>
      <div className="cc-group-label">Overview</div>

      {/* Budget Monitoring + Portfolio Health share a row — both are "state of the business" donuts */}
      <div className="grid two-col">
        {(() => {
          const { committed, pending, balance } = budgetStats;
          const overage = balance < 0 ? -balance : 0;
          const remaining = balance > 0 ? balance : 0;
          const total = Math.max(annualBudget, committed + pending, 1);
          const pct = (n) => Math.round((n / total) * 100);
          const r = 52, sw = 18, cx = 60, cy = 60;
          const circumference = 2 * Math.PI * r;
          // Ring segments always sum EXACTLY to `total` by construction:
          //   committed + pending + max(0, annualBudget - committed - pending) = total
          // "Over Budget" isn't drawn as a ring slice — once Committed+Pending already fill the ring
          // there's no proportional room left for it, so it's shown only in the legend/center label.
          const ringSegments = [
            { label: "Committed", n: committed, color: "var(--signal-info)" },
            { label: "Pending", n: pending, color: "var(--signal-warn)" },
            { label: "Balance", n: remaining, color: "var(--signal-ok)" },
          ];
          const arcSegments = ringSegments.filter(s => s.n > 0);
          // Give every non-zero segment a minimum visible arc length so small-but-real amounts
          // (like a modest Committed slice against a large annual budget) don't disappear into the ring.
          // Positions must be derived from these ADJUSTED lengths (not the raw values) — otherwise a
          // later segment (e.g. Balance), still positioned at its raw offset, paints over the boosted slice.
          const MIN_ARC = 10;
          const rawDashes = arcSegments.map(s => (s.n / total) * circumference);
          const deficit = rawDashes.reduce((sum, d) => sum + Math.max(0, MIN_ARC - d), 0);
          const boostablePool = rawDashes.reduce((sum, d) => sum + Math.max(0, d - MIN_ARC), 0);
          const adjustedDashes = rawDashes.map(d => {
            if (d < MIN_ARC) return MIN_ARC;
            if (boostablePool > 0) return Math.max(MIN_ARC, d - deficit * ((d - MIN_ARC) / boostablePool));
            return d;
          });
          let cumulativeLen = 0;
          const arcs = arcSegments.map((seg, i) => {
            const dash = adjustedDashes[i];
            const gap = circumference - dash;
            const offset = -cumulativeLen;
            cumulativeLen += dash;
            return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw}
              strokeDasharray={`${dash} ${gap}`} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap={arcSegments.length > 1 ? "butt" : "round"} />;
          });

          return (
            <div className="panel">
              <div className="panel-head"><div className="panel-title"><CreditCard size={13} /> Budget Monitoring</div>
                <div className="panel-title-count">FY Annual Budget: {fmtMVR(annualBudget)}</div></div>
              <div className="panel-body pad" style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--panel-2)" strokeWidth={sw} />
                    {arcs}
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div className="disp" style={{ fontSize: 20, fontWeight: 700, color: overage > 0 ? "var(--signal-crit)" : undefined }}>{pct(committed)}%</div>
                    <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".04em" }}>Committed</div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>Annual Budget</div>
                    {editingBudget ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" className="form-input" style={{ width: 130 }} autoFocus value={budgetDraft}
                          onChange={e => setBudgetDraft(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") { setAnnualBudget(Number(budgetDraft) || 0); setEditingBudget(false); } }} />
                        <button className="btn ok" style={{ padding: "5px 8px" }} onClick={() => { setAnnualBudget(Number(budgetDraft) || 0); setEditingBudget(false); }}>✓</button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12.5, fontWeight: 700, cursor: "pointer" }} onClick={() => { setBudgetDraft(annualBudget); setEditingBudget(true); }} title="Click to edit">
                        {fmtMVR(annualBudget)} <Pencil size={11} style={{ opacity: 0.5, verticalAlign: "middle" }} />
                      </div>
                    )}
                  </div>
                  {ringSegments.map(s => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>{s.label}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: s.label === "Balance" && overage > 0 ? "var(--signal-crit)" : undefined }}>{fmtMVR(s.label === "Balance" ? balance : s.n)}</div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", width: 34, textAlign: "right" }}>{pct(s.n)}%</div>
                    </div>
                  ))}
                  {overage > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: "var(--signal-crit)", flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>Over Budget</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--signal-crit)" }}>{fmtMVR(overage)}</div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", width: 34, textAlign: "right" }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        <PortfolioHealthCard counts={healthCounts} />
      </div>

      {/* Monthly Commitments — sponsorships committed per month, toggle between count and value */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div className="panel-title"><CalendarIcon size={13} /> Monthly Sponsorship Commitments</div>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            <div className={`filter-chip ${monthlyView === "value" ? "active" : ""}`} onClick={() => setMonthlyView("value")}>By Value</div>
            <div className={`filter-chip ${monthlyView === "count" ? "active" : ""}`} onClick={() => setMonthlyView("count")}>By Count</div>
          </div>
        </div>
        <div className="panel-body pad">
          {monthlyStats.length === 0 && <div className="panel-empty">No sponsorships to summarize yet.</div>}
          {monthlyStats.map(m => {
            const barPct = monthlyView === "value"
              ? Math.round((m.value / maxMonthlyValue) * 100)
              : Math.round((m.count / maxMonthlyCount) * 100);
            return (
              <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 70, fontSize: 11.5, color: "var(--text-dim)", flexShrink: 0 }}>{m.label}</div>
                <div style={{ flex: 1, height: 18, background: "var(--panel-2)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(4, barPct)}%`, height: "100%", background: monthlyView === "value" ? "var(--brand)" : "var(--signal-info)" }} />
                </div>
                <div style={{ width: 130, fontSize: 11.5, textAlign: "right", flexShrink: 0 }}>
                  {monthlyView === "value" ? fmtMVR(m.value) : `${m.count} sponsorship${m.count === 1 ? "" : "s"}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Overview — count of sponsorships at each stage of the funnel */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div className="panel-title"><ListChecks size={13} /> Pipeline Overview</div>
          <div className="panel-title-count">{sponsorships.length} total on file</div></div>
        <div className="panel-body pad" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {pipelineStats.map(p => {
            const colorMap = { warn: "var(--signal-warn)", info: "var(--signal-info)", crit: "var(--signal-crit)", ok: "var(--signal-ok)" };
            return (
              <div key={p.label} style={{ background: "var(--panel-2)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                <div className="stat-num disp" style={{ fontSize: 22, color: colorMap[p.color] }}>{p.num}</div>
                <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>{p.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="cc-group-label">Needs Attention</div>
      {/* Needs Attention — quick stats up top, then health + follow-ups combined, one line per project, expandable for detail */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div className="panel-title"><Bell size={13} /> Needs Attention</div>
          <div className="panel-title-count">{flaggedCount} flagged · {onTrackCount} on track{ackedFollowUps.length > 0 ? ` · ${ackedFollowUps.length} acknowledged` : ""}</div></div>
        <div className="panel-body pad" style={{ paddingBottom: 12, borderBottom: "1px solid var(--line-soft)" }}>
          <div className="grid stat-row" style={{ marginBottom: 0 }}>
            <StatCard compact label="Critical Items" num={overdueCount} icon={<AlertTriangle size={14} />} color="crit" hot={overdueCount > 0} />
            <StatCard compact label="Events (Next 21 Days)" num={upcomingEvents.length} icon={<CalendarIcon size={14} />} color="info" />
            <StatCard compact label="Pending Payments" num={pendingPaymentsCount} icon={<CreditCard size={14} />} color="warn" />
            <StatCard compact label="Deliverables Overdue" num={deliverablesOverdueCount} icon={<ListChecks size={14} />} color="crit" hot={deliverablesOverdueCount > 0} />
          </div>
        </div>
        <div className="panel-body">
          {grouped.length === 0 && <div className="panel-empty">Nothing needs attention right now — {onTrackCount} sponsorships on track.</div>}
          {grouped.map(g => {
            const b = levelBadge(g.topLevel);
            const isOpen = !!expanded[g.sponsorshipId];
            const top = g.items[0];
            return (
              <div key={g.sponsorshipId} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                <div className="attn-item" style={{ cursor: "pointer" }} onClick={() => setExpanded(prev => ({ ...prev, [g.sponsorshipId]: !isOpen }))}>
                  <SignalBars level={g.topLevel} />
                  <div style={{ flex: 1 }}>
                    <div className="row-title" style={{ marginBottom: 2 }}>{g.eventName} <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>· {g.organizer}</span></div>
                    <div className="attn-text">{top.text}</div>
                    <div className="attn-meta">owner: {top.owner}{g.items.length > 1 ? ` · +${g.items.length - 1} more issue${g.items.length - 1 === 1 ? "" : "s"}` : ""}</div>
                  </div>
                  <span className={`badge ${b.cls}`}>{b.label}</span>
                  {isOpen ? <ChevronDown size={14} style={{ color: "var(--text-faint)" }} /> : <ChevronRight size={14} style={{ color: "var(--text-faint)" }} />}
                </div>
                {isOpen && (
                  <div style={{ padding: "0 10px 10px 34px" }}>
                    {g.items.map(f => (
                      <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: "1px solid var(--line-soft)" }}>
                        <div style={{ flex: 1 }}>
                          <div className="attn-text">{f.text}</div>
                          <div className="attn-meta">{f.category} · owner: {f.owner}</div>
                        </div>
                        <button className="btn ghost" style={{ padding: "4px 8px", fontSize: 10.5 }} onClick={(e) => { e.stopPropagation(); acknowledge(f.key); }}>Ack</button>
                      </div>
                    ))}
                    <button className="btn ghost" style={{ marginTop: 6, fontSize: 11 }} onClick={(e) => { e.stopPropagation(); openDetail(g.sponsorshipId); }}>Open full details →</button>
                  </div>
                )}
              </div>
            );
          })}
          {ackedFollowUps.length > 0 && (
            <div style={{ textAlign: "center", padding: "8px 0 2px 0" }}>
              <button className="btn ghost" style={{ fontSize: 11, color: "var(--text-faint)" }} onClick={() => setShowAcked(!showAcked)}>{showAcked ? "Hide" : "Show"} {ackedFollowUps.length} acknowledged item{ackedFollowUps.length === 1 ? "" : "s"}</button>
            </div>
          )}
          {showAcked && ackedFollowUps.map((f) => (
            <div className="attn-item" key={"ack-" + f.key} style={{ opacity: 0.5 }}>
              <div onClick={() => openDetail(f.sponsorshipId)} style={{ display: "flex", gap: 10, flex: 1, cursor: "pointer" }}>
                <SignalBars level={f.level} />
                <div><div className="attn-text">{f.text}</div><div className="attn-meta">{f.requestId} · {f.eventName}</div></div>
              </div>
              <button className="btn ghost" style={{ padding: "5px 9px", fontSize: 11, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); unacknowledge(f.key); }}>Unack</button>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables Monitor — dedicated, distinguishable home for sponsor-side vs partner-side deliverable tracking */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div className="panel-title"><ListChecks size={13} /> Deliverables Monitor</div>
          <div className="panel-title-count">{deliverablesMonitor.rows.length} sponsorship{deliverablesMonitor.rows.length === 1 ? "" : "s"} with open items</div></div>
        <div className="panel-body pad">
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {[
              { label: "Our Deliverables", accent: "var(--signal-info)", done: deliverablesMonitor.sponsorDone, total: deliverablesMonitor.sponsorTotal, overdue: deliverablesMonitor.sponsorOverdue },
              { label: "Partner Deliverables", accent: "var(--brand)", done: deliverablesMonitor.partnerDone, total: deliverablesMonitor.partnerTotal, overdue: deliverablesMonitor.partnerOverdue },
            ].map(c => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <div key={c.label} style={{ flex: "1 1 220px", minWidth: 200, background: "var(--panel-2)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: c.accent }}>{c.label}</span>
                    {c.overdue > 0 && <span className="badge crit">{c.overdue} overdue</span>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}><span>{c.done}/{c.total} complete</span><span>{pct}%</span></div>
                  <div style={{ height: 6, background: "var(--panel)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "var(--signal-ok)" : c.accent }} /></div>
                </div>
              );
            })}
          </div>

          {deliverablesMonitor.rows.length === 0 && <div className="panel-empty">No open deliverables across the active portfolio.</div>}
          {deliverablesMonitor.rows.map(r => (
            <div className="row" key={r.sp.id} style={{ alignItems: "center" }} onClick={() => openDetail(r.sp.id, r.sOver >= r.pOver ? "sponsorDeliverables" : "partnerDeliverables")}>
              <div style={{ flex: 1 }}>
                <div className="row-title">{r.sp.eventName}</div>
                <div className="row-sub">{r.sp.organizer}</div>
              </div>
              <span className={`badge ${r.sOver > 0 ? "crit" : "info"}`} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); openDetail(r.sp.id, "sponsorDeliverables"); }}>Ours {r.sDone}/{r.sd.length}</span>
              <span className={`badge ${r.pOver > 0 ? "crit" : "brand"}`} style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); openDetail(r.sp.id, "partnerDeliverables"); }}>Partner {r.pDone}/{r.pd.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cc-group-label">Operational Queues</div>
      {/* Operational lists — memo approval queue and the near-term event calendar */}
      <div className="grid two-col">
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><ListChecks size={13} /> Memo Approval Pipeline</div>
            <div className="panel-title-count">{pendingApprovals.length} in progress</div></div>
          <div className="panel-body">
            {pendingApprovals.length === 0 && <div className="panel-empty">Nothing currently in memo approval.</div>}
            {pendingApprovals.map(sp => {
              const cur = currentApprover(sp);
              const doneCount = sp.approvals.filter(a => a.status === "Approved").length;
              return (
                <div className="row" key={sp.id} onClick={() => openDetail(sp.id, "approvals")}>
                  <div style={{ flex: 1 }}>
                    <div className="row-title">{sp.eventName}</div>
                    <div className="row-sub">{doneCount}/{sp.approvals.length} approved{cur ? ` · awaiting ${cur.approver}` : ""}</div>
                  </div>
                  <span className="badge warn">{cur ? cur.approver : "Ready"}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><CalendarIcon size={13} /> Upcoming Events</div></div>
          <div className="panel-body">
            {upcomingEvents.length === 0 && <div className="panel-empty">No events in the next 21 days.</div>}
            {upcomingEvents.map(s => (
              <div className="row" key={s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}><div className="row-title">{s.eventName}</div><div className="row-sub">{fmtDateRange(s.eventDate, s.eventEndDate)} · {s.region}</div></div>
                <span className={`badge ${daysBetween(s.eventDate, TODAY) <= 5 ? "crit" : "info"}`}>{daysBetween(s.eventDate, TODAY)}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PortfolioHealthCard({ counts }) {
  const { critical, atRisk, healthy, total } = counts;
  if (total === 0) return null;
  const pct = (n) => Math.round((n / total) * 100);

  const r = 52, sw = 18, cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;
  const segments = [
    { value: critical, color: "var(--signal-crit)" },
    { value: atRisk, color: "var(--signal-warn)" },
    { value: healthy, color: "var(--signal-ok)" },
  ].filter(s => s.value > 0);

  let cumulative = 0;
  const arcs = segments.map((seg, i) => {
    const frac = seg.value / total;
    const dash = frac * circumference;
    const gap = circumference - dash;
    const offset = -((cumulative / total) * circumference);
    cumulative += seg.value;
    return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={sw}
      strokeDasharray={`${dash} ${gap}`} strokeDashoffset={offset} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap={segments.length > 1 ? "butt" : "round"} />;
  });

  const rows = [
    { label: "Critical", n: critical, color: "var(--signal-crit)" },
    { label: "At Risk / Watch", n: atRisk, color: "var(--signal-warn)" },
    { label: "On Track", n: healthy, color: "var(--signal-ok)" },
  ];

  return (
    <div className="panel">
      <div className="panel-head"><div className="panel-title"><TrendingUp size={13} /> Portfolio Health</div>
        <div className="panel-title-count">{total} active sponsorship{total === 1 ? "" : "s"}</div></div>
      <div className="panel-body pad" style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--panel-2)" strokeWidth={sw} />
            {arcs}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="disp" style={{ fontSize: 22, fontWeight: 700 }}>{pct(healthy)}%</div>
            <div style={{ fontSize: 9.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: ".04em" }}>On Track</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          {rows.map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>{r.label}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{r.n}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", width: 34, textAlign: "right" }}>{pct(r.n)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Click-to-edit-in-place field: renders as plain text/value until clicked, then swaps to an input.
// `value` is always the raw string/number used as the input's value; `format` (optional) transforms
// that same value for display. Text/number/textarea commit on blur or Enter, Escape cancels;
// select commits immediately on choice since picking an option is already a deliberate action.
function InlineEditField({ value, onSave, type = "text", options, list, placeholder, format, displayClassName, displayStyle, inputStyle, textarea }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  function startEdit() { setDraft(value ?? ""); setEditing(true); }
  function commit(v) { onSave(v !== undefined ? v : draft); setEditing(false); }

  if (editing) {
    if (type === "select") {
      return (
        <select className="form-select" autoFocus style={inputStyle} value={draft}
          onChange={e => commit(e.target.value)} onBlur={() => setEditing(false)}>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      );
    }
    if (textarea) {
      return (
        <textarea className="form-textarea" autoFocus style={inputStyle} value={draft} placeholder={placeholder}
          onChange={e => setDraft(e.target.value)} onBlur={() => commit()}
          onKeyDown={e => { if (e.key === "Escape") setEditing(false); }} />
      );
    }
    return (
      <input className="form-input" autoFocus type={type} style={inputStyle} value={draft} placeholder={placeholder} list={list}
        onChange={e => setDraft(e.target.value)} onBlur={() => commit()}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} />
    );
  }

  const shown = format ? format(value) : value;
  return (
    <div className={`inline-edit ${displayClassName || ""}`} style={displayStyle} onClick={startEdit} title="Click to edit">
      {shown != null && shown !== "" ? shown : <span className="inline-edit-empty">{placeholder || "— click to add —"}</span>}
      <Pencil size={10} className="inline-pencil" />
    </div>
  );
}

function StatCard({ label, num, icon, color, hot, compact }) {
  const colorMap = { warn: "var(--signal-warn)", info: "var(--signal-info)", crit: "var(--signal-crit)", ok: "var(--signal-ok)" };
  const softMap = { warn: "var(--signal-warn-soft)", info: "var(--signal-info-soft)", crit: "var(--signal-crit-soft)", ok: "var(--signal-ok-soft)" };
  if (compact) {
    return (
      <div className={`stat-card compact ${hot ? "hot" : ""}`}>
        <div className="stat-icon" style={{ background: softMap[color], color: colorMap[color] }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="stat-num disp">{num}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    );
  }
  return (
    <div className={`stat-card ${hot ? "hot" : ""}`}>
      <div className="stat-top"><div className="stat-label">{label}</div><div className="stat-icon" style={{ background: softMap[color], color: colorMap[color] }}>{icon}</div></div>
      <div className="stat-num disp">{num}</div>
    </div>
  );
}

/* ============================== PIPELINE ============================== */
function PipelineView({ sponsorships, stageFilter, setStageFilter, openDetail }) {
  const filters = ["All", ...STAGES, ...TERMINAL_ONLY];
  return (
    <>
      <div className="list-view-toolbar">
        {filters.map(f => <div key={f} className={`filter-chip ${stageFilter === f ? "active" : ""}`} onClick={() => setStageFilter(f)}>{f}</div>)}
      </div>
      <div className="table-wrap">
        <div className="t-row t-head"><div></div><div>Request ID</div><div>Event</div><div>Organizer</div><div>Amount</div><div>Event Date</div><div>Stage</div></div>
        {sponsorships.length === 0 && <div className="panel-empty">No sponsorships match this filter.</div>}
        {sponsorships.map(s => {
          const h = computeHealth(s);
          const dotColor = h.cls === "crit" ? "var(--signal-crit)" : h.cls === "warn" ? "var(--signal-warn)" : h.cls === "neutral" ? "var(--signal-neutral)" : "var(--signal-ok)";
          return (
            <div className="t-row" key={s.id} onClick={() => openDetail(s.id)}>
              <div className="dot" style={{ color: dotColor, width: 7, height: 7 }} title={h.label} />
              <div className="mono" style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{s.requestId}</div>
              <div className="row-title">{s.eventName}</div>
              <div className="row-sub">{s.organizer}</div>
              <div className="mono" style={{ fontSize: 12 }}>{s.valueType === "In-Kind" ? <span className="badge neutral">In-Kind</span> : fmtMVR(s.sponsorAmount)}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>{fmtDateRange(s.eventDate, s.eventEndDate)}</div>
              <div><span className={`badge ${stageBadgeClass(s.stage)}`}>{s.stage}</span></div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============================== SPONSORSHIP PROFILES ============================== */
function SponsorshipProfilesView({ sponsorships, openDetail }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
      {sponsorships.map(s => {
        const sponsorDone = (s.sponsorDeliverables || []).filter(dl => dl.status === "Done").length;
        const sponsorTotal = (s.sponsorDeliverables || []).length;
        const sponsorPct = sponsorTotal ? Math.round((sponsorDone / sponsorTotal) * 100) : 0;
        const partnerDone = (s.partnerDeliverables || []).filter(dl => dl.status === "Done").length;
        const partnerTotal = (s.partnerDeliverables || []).length;
        const partnerPct = partnerTotal ? Math.round((partnerDone / partnerTotal) * 100) : 0;
        const followUps = generateFollowUps(s);
        const h = computeHealth(s);
        const daysToEvent = daysBetween(s.eventDate, TODAY);
        const initials = s.organizer.split(" ").slice(0, 2).map(w => w[0]).join("");
        return (
          <div className="org-card" key={s.id} style={{ cursor: "pointer" }} onClick={() => openDetail(s.id)}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{s.requestId}</div>
              <span className={`badge ${h.cls}`}>{h.label}</span>
            </div>
            <div className="row-title" style={{ fontSize: 13.5, marginBottom: 3 }}>{s.eventName}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <div className="org-avatar" style={{ width: 22, height: 22, fontSize: 9.5, borderRadius: 6 }}>{initials}</div>
              <div className="row-sub" style={{ margin: 0 }}>{s.organizer}</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span className={`badge ${stageBadgeClass(s.stage)}`}>{s.stage}</span>
              {s.valueType !== "Cash" && <span className="badge neutral">{s.valueType}</span>}
              {(s.sponsorDeliverables || []).some(x => x.connectivityType) && <span className="badge neutral">Connectivity</span>}
              {spanLabel(s.eventDate, s.eventEndDate) && <span className="badge info">{spanLabel(s.eventDate, s.eventEndDate)}</span>}
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div className="org-stat"><div className="num mono">{s.valueType === "In-Kind" ? "In-Kind" : fmtMVR(s.sponsorAmount)}</div><div className="lbl">Value</div></div>
              <div className="org-stat" title={fmtDateRange(s.eventDate, s.eventEndDate)}><div className="num">{daysToEvent >= 0 ? `${daysToEvent}d` : "Past"}</div><div className="lbl">{daysToEvent >= 0 ? "To Event" : "Event Date"}</div></div>
            </div>
            {(sponsorTotal > 0 || partnerTotal > 0) && (
              <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                {sponsorTotal > 0 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}><span>Our Deliverables</span><span>{sponsorDone}/{sponsorTotal}</span></div>
                    <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${sponsorPct}%`, height: "100%", background: sponsorPct === 100 ? "var(--signal-ok)" : "var(--signal-info)" }} /></div>
                  </div>
                )}
                {partnerTotal > 0 && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}><span>Partner Deliverables</span><span>{partnerDone}/{partnerTotal}</span></div>
                    <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${partnerPct}%`, height: "100%", background: partnerPct === 100 ? "var(--signal-ok)" : "var(--brand)" }} /></div>
                  </div>
                )}
              </div>
            )}
            {followUps.length > 0 ? (
              <div className="row-sub" style={{ lineHeight: 1.5 }}>{followUps[0].text} <span style={{ color: "var(--text-faint)" }}>(owner: {followUps[0].owner})</span>{followUps.length > 1 ? ` +${followUps.length - 1} more` : ""}</div>
            ) : <div className="row-sub">No open follow-ups.</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== CALENDAR ============================== */
function buildCalendarEvents(sponsorships) {
  const events = [];
  sponsorships.forEach(s => {
    events.push({ date: s.eventDate, endDate: s.eventEndDate || null, type: "Event", label: `${s.eventName}${spanLabel(s.eventDate, s.eventEndDate) ? ` (${fmtDateRange(s.eventDate, s.eventEndDate)})` : ""}`, sub: s.region, sp: s, tab: "overview" });
    if (s.payment?.payment?.dueDate) events.push({ date: s.payment.payment.dueDate, type: "Payment", label: `Payment due — ${s.eventName}`, sub: fmtMVR(s.sponsorAmount), sp: s, tab: "payment" });
    // Deliverable due dates — kept separate by category so it's clear at a glance whose commitment it is.
    // Connectivity items live inside Sponsor Deliverables; their device-return date (if any) gets its own calendar entry.
    (s.sponsorDeliverables || []).forEach(dl => {
      if (dl.status !== "Done") {
        events.push({ date: dl.dueDate, type: "Sponsor Deliverable", label: `${dl.name} — ${s.eventName}`, sub: `Ooredoo${dl.department ? ` · ${dl.department}` : ""} · ${dl.status}`, sp: s, tab: "sponsorDeliverables" });
      }
      if (dl.deviceReturnDate && dl.deviceReturnStatus !== "Returned") {
        events.push({ date: dl.deviceReturnDate, type: "Device Return", label: `${dl.connectivityType || dl.name} return — ${s.eventName}`, sub: dl.connectivityType || dl.name, sp: s, tab: "sponsorDeliverables" });
      }
    });
    (s.partnerDeliverables || []).forEach(dl => {
      if (dl.status === "Done") return;
      events.push({ date: dl.dueDate, type: "Partner Deliverable", label: `${dl.name} — ${s.eventName}`, sub: `${s.organizer} · ${dl.status}`, sp: s, tab: "partnerDeliverables" });
    });
  });
  return events;
}
const CAL_TYPE_COLOR = { Event: "info", Payment: "warn", "Device Return": "crit", "Sponsor Deliverable": "info", "Partner Deliverable": "brand" };
const CAL_TYPE_DOT = { Event: "var(--signal-info)", Payment: "var(--signal-warn)", "Device Return": "var(--signal-crit)", "Sponsor Deliverable": "var(--signal-info)", "Partner Deliverable": "var(--brand)" };

const ALL_CAL_TYPES = ["Event", "Payment", "Sponsor Deliverable", "Partner Deliverable", "Device Return"];


function CalendarView({ sponsorships, openDetail }) {
  const [mode, setMode] = useState("agenda"); // "agenda" | "month"
  const [monthCursor, setMonthCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTypes, setActiveTypes] = useState(ALL_CAL_TYPES);
  const allEvents = useMemo(() => buildCalendarEvents(sponsorships), [sponsorships]);
  const events = useMemo(() => allEvents.filter(e => activeTypes.includes(e.type)), [allEvents, activeTypes]);

  function toggleType(t) {
    setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  const grouped = useMemo(() => {
    const upcoming = events.filter(e => daysBetween(e.date, TODAY) >= -3).sort((a, b) => a.date - b.date);
    const g = [];
    upcoming.forEach(e => {
      const key = e.date.toDateString();
      let entry = g.find(x => x.key === key);
      if (!entry) { entry = { key, date: e.date, items: [] }; g.push(entry); }
      entry.items.push(e);
    });
    return g;
  }, [events]);

  return (
    <div>
      <div className="list-view-toolbar">
        <div className={`filter-chip ${mode === "agenda" ? "active" : ""}`} onClick={() => setMode("agenda")}>Agenda</div>
        <div className={`filter-chip ${mode === "month" ? "active" : ""}`} onClick={() => setMode("month")}>Month</div>
        <div style={{ width: 1, alignSelf: "stretch", background: "var(--line-soft)", margin: "0 4px" }} />
        {ALL_CAL_TYPES.map(t => (
          <div key={t} className={`filter-chip ${activeTypes.includes(t) ? "active" : ""}`} onClick={() => toggleType(t)}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: CAL_TYPE_DOT[t], flexShrink: 0 }} />{t}
          </div>
        ))}
      </div>
      {mode === "agenda" ? (
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><CalendarIcon size={13} /> Agenda</div></div>
          <div className="panel-body pad">
            {grouped.length === 0 && <div className="panel-empty">Nothing on the calendar.</div>}
            {grouped.map(g => (
              <div className="agenda-day" key={g.key}>
                <div className="agenda-date">
                  <div className="d disp">{g.date.getDate()}</div>
                  <div className="m">{g.date.toLocaleDateString("en-GB", { month: "short" })}</div>
                  {g.items.length >= 3 && <div className="badge warn" style={{ marginTop: 4, fontSize: 9 }}>Busy</div>}
                </div>
                <div className="agenda-items">
                  {g.items.map((it, i) => (
                    <div className="agenda-event" key={i} onClick={() => openDetail(it.sp.id, it.tab)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span className={`badge ${CAL_TYPE_COLOR[it.type]}`}>{it.type}</span>
                        {daysBetween(g.date, TODAY) < 0 && <span className="badge crit">Past due</span>}
                      </div>
                      <div className="row-title" style={{ fontSize: 12.5 }}>{it.label}</div>
                      <div className="row-sub">{it.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MonthCalendar events={events} monthCursor={monthCursor} setMonthCursor={setMonthCursor}
          selectedDay={selectedDay} setSelectedDay={setSelectedDay} openDetail={openDetail} />
      )}
    </div>
  );
}

function MonthCalendar({ events, monthCursor, setMonthCursor, selectedDay, setSelectedDay, openDetail }) {
  const year = monthCursor.getFullYear(), month = monthCursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsByDay = {};
  events.forEach(e => {
    const startKey = e.date.toDateString();
    if (!eventsByDay[startKey]) eventsByDay[startKey] = [];
    eventsByDay[startKey].push(e);
    if (e.endDate && e.endDate > e.date) {
      // multi-day/long-running sponsorship — also mark every day it spans so the month grid shows it's ongoing
      let d = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate() + 1);
      const end = new Date(e.endDate.getFullYear(), e.endDate.getMonth(), e.endDate.getDate());
      let guard = 0;
      while (d <= end && guard < 730) {
        const k = d.toDateString();
        if (!eventsByDay[k]) eventsByDay[k] = [];
        eventsByDay[k].push({ ...e, label: `${e.sp.eventName} (ongoing)`, ongoing: true });
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        guard++;
      }
    }
  });

  const selectedItems = selectedDay ? (eventsByDay[selectedDay] || []) : [];

  return (
    <div className="panel">
      <div className="panel-head">
        <button className="btn ghost" style={{ padding: "5px 8px" }} onClick={() => { setMonthCursor(new Date(year, month - 1, 1)); setSelectedDay(null); }}><ChevronLeft size={14} /></button>
        <div className="panel-title" style={{ margin: "0 8px" }}>{monthCursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
        <button className="btn ghost" style={{ padding: "5px 8px" }} onClick={() => { setMonthCursor(new Date(year, month + 1, 1)); setSelectedDay(null); }}><ChevronRight size={14} /></button>
        <button className="btn ghost" style={{ marginLeft: "auto", fontSize: 11 }} onClick={() => { setMonthCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)); setSelectedDay(null); }}>Today</button>
      </div>
      <div className="panel-body pad">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ fontSize: 10, color: "var(--text-faint)", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const key = date.toDateString();
            const items = eventsByDay[key] || [];
            const isToday = key === TODAY.toDateString();
            const isSelected = key === selectedDay;
            const types = [...new Set(items.map(e => e.type))];
            return (
              <div key={i} onClick={() => items.length > 0 && setSelectedDay(isSelected ? null : key)}
                style={{
                  minHeight: 52, borderRadius: 8, padding: "5px 6px", cursor: items.length ? "pointer" : "default",
                  background: isSelected ? "var(--panel-2)" : "var(--panel)",
                  border: isToday ? "1px solid var(--brand)" : "1px solid var(--line-soft)",
                }}>
                <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? "#ff8095" : "var(--text-dim)" }}>{date.getDate()}</div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
                  {types.slice(0, 4).map(t => <div key={t} style={{ width: 6, height: 6, borderRadius: "50%", background: CAL_TYPE_DOT[t] }} />)}
                </div>
                {items.length >= 3 && <div style={{ fontSize: 8.5, color: "var(--signal-warn)", marginTop: 2, fontWeight: 700 }}>Busy</div>}
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--line-soft)", paddingTop: 12 }}>
            <div className="section-label" style={{ margin: "0 0 8px 0" }}>{new Date(selectedDay).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
            {selectedItems.map((it, i) => (
              <div className="agenda-event" key={i} onClick={() => openDetail(it.sp.id, it.tab)}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span className={`badge ${CAL_TYPE_COLOR[it.type]}`}>{it.type}</span>
                  {daysBetween(new Date(selectedDay), TODAY) < 0 && <span className="badge crit">Past due</span>}
                </div>
                <div className="row-title" style={{ fontSize: 12.5 }}>{it.label}</div>
                <div className="row-sub">{it.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/* ============================== NEW REQUEST FORM ============================== */
function NewRequestForm({ onCreate, close, sponsorships }) {
  const [form, setForm] = useState({ eventName: "", organizer: "", eventType: "", region: "", valueType: "Cash", sponsorAmount: "", inKindDetails: "", sponsorshipType: "", eventDate: "", eventEndDate: "", background: "" });
  const [prefilled, setPrefilled] = useState(false);
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const canSubmit = form.eventName.trim() && form.organizer.trim();

  const organizers = useMemo(() => distinctValues(sponsorships, "organizer"), [sponsorships]);
  const regions = useMemo(() => distinctValues(sponsorships, "region"), [sponsorships]);
  const eventTypes = useMemo(() => distinctValues(sponsorships, "eventType"), [sponsorships]);
  const sponsorshipTypes = useMemo(() => distinctValues(sponsorships, "sponsorshipType"), [sponsorships]);

  // When the typed organizer matches someone we've sponsored before, offer to carry their last
  // region/type/value forward — saves re-entering the same details for a repeat organizer.
  function handleOrganizerBlur() {
    if (!form.organizer.trim()) return;
    const last = lastSponsorshipFor(sponsorships, form.organizer);
    if (!last) return;
    setForm(prev => ({
      ...prev,
      eventType: prev.eventType || last.eventType,
      region: prev.region || last.region,
      sponsorshipType: prev.sponsorshipType || last.sponsorshipType,
    }));
    setPrefilled(true);
  }
  function submit() { if (canSubmit) onCreate(form); }
  function onEnter(e) { if (e.key === "Enter") { e.preventDefault(); submit(); } }

  return (
    <>
      <div className="detail-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <button className="btn ghost" onClick={close}><ArrowLeft size={13} /> Cancel</button>
          <button className="close-btn" onClick={close}><X size={14} /></button>
        </div>
        <div className="disp" style={{ fontSize: 16, fontWeight: 700 }}>New Sponsorship Request</div>
        <div className="row-sub" style={{ marginTop: 3 }}>Logs the request at "New Request" stage. You can fill in the rest — memo, budget code, deliverables — once it's created.</div>
      </div>
      <div className="detail-body">
        <datalist id="dl-organizers">{organizers.map(o => <option key={o} value={o} />)}</datalist>
        <datalist id="dl-regions">{regions.map(r => <option key={r} value={r} />)}</datalist>
        <datalist id="dl-eventtypes">{eventTypes.map(t => <option key={t} value={t} />)}</datalist>
        <datalist id="dl-sponsorshiptypes">{sponsorshipTypes.map(t => <option key={t} value={t} />)}</datalist>

        <div className="form-row"><div className="kv-label">Event Name *</div><input className="form-input" value={form.eventName} onChange={set("eventName")} onKeyDown={onEnter} placeholder="e.g. Inter-School Chess Championship" /></div>
        <div className="form-row">
          <div className="kv-label">Organizer *</div>
          <input className="form-input" list="dl-organizers" value={form.organizer} onChange={set("organizer")} onBlur={handleOrganizerBlur} onKeyDown={onEnter} placeholder="e.g. Maldives Chess Association" />
          {prefilled && <div style={{ fontSize: 10.5, color: "var(--signal-info)", marginTop: 4 }}>Prefilled region/type from their last sponsorship with us — adjust anything below if needed.</div>}
        </div>
        <div className="form-row-2">
          <div><div className="kv-label">Event Type</div><input className="form-input" list="dl-eventtypes" value={form.eventType} onChange={set("eventType")} onKeyDown={onEnter} placeholder="Sports / CSR / Regional…" /></div>
          <div><div className="kv-label">Region</div><input className="form-input" list="dl-regions" value={form.region} onChange={set("region")} onKeyDown={onEnter} placeholder="Malé, Addu City…" /></div>
        </div>
        <div className="form-row">
          <div className="kv-label">Sponsorship Value</div>
          <select className="form-select" value={form.valueType} onChange={set("valueType")}>
            <option value="Cash">Cash</option>
            <option value="In-Kind">In-Kind only (no cash — connectivity, event support, exposure…)</option>
            <option value="Cash + In-Kind">Cash + In-Kind</option>
          </select>
        </div>
        {form.valueType !== "In-Kind" && (
          <div className="form-row"><div className="kv-label">Sponsor Amount (MVR)</div><input type="number" className="form-input" value={form.sponsorAmount} onChange={set("sponsorAmount")} onKeyDown={onEnter} placeholder="0" /></div>
        )}
        {form.valueType !== "Cash" && (
          <div className="form-row"><div className="kv-label">In-Kind Details</div><textarea className="form-textarea" value={form.inKindDetails} onChange={set("inKindDetails")} placeholder="e.g. AirFibre connectivity for the event, on-site technical support, exposure package…" /></div>
        )}
        <div className="form-row"><div className="kv-label">Sponsorship Type</div><input className="form-input" list="dl-sponsorshiptypes" value={form.sponsorshipType} onChange={set("sponsorshipType")} onKeyDown={onEnter} placeholder="Cash / Connectivity / Combination…" /></div>
        <div className="form-row"><div className="kv-label">Event Date</div><input type="date" className="form-input" value={form.eventDate} onChange={set("eventDate")} /></div>
        <div className="form-row">
          <div className="kv-label">Event End Date (optional)</div>
          <input type="date" className="form-input" value={form.eventEndDate} onChange={set("eventEndDate")} min={form.eventDate || undefined} />
          <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 4 }}>Leave blank for a single-day event. Set this for multi-day events or long-running sponsorships (e.g. a 1-year partnership).</div>
        </div>
        <div className="form-row"><div className="kv-label">Background</div><textarea className="form-textarea" value={form.background} onChange={set("background")} placeholder="What is this event, briefly?" /></div>
        <button className="btn primary" disabled={!canSubmit} onClick={submit}>Create Request</button>
      </div>
    </>
  );
}

/* ============================== SETTINGS PANEL ============================== */
const THRESHOLD_FIELDS = [
  { key: "approvalWarnDays", label: "Flag a stalled approval step after (days)", group: "Approvals" },
  { key: "approvalUrgentDays", label: "Escalate to Urgent after (days)", group: "Approvals" },
  { key: "approvalCriticalDays", label: "Escalate to Critical after (days)", group: "Approvals" },
  { key: "connectivityWindowDays", label: "Start warning about setup this many days before the event", group: "Connectivity (Sponsor Deliverables)" },
  { key: "connectivityCriticalDays", label: "Escalate setup warning to Critical inside (days)", group: "Connectivity (Sponsor Deliverables)" },
  { key: "eventApprovalWindowDays", label: "Flag unapproved requests once event is within (days)", group: "Deadlines" },
];

function SettingsPanel({ thresholds, setThresholds, close, saveError }) {
  const groups = [...new Set(THRESHOLD_FIELDS.map(f => f.group))];
  return (
    <>
      <div className="detail-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <button className="btn ghost" onClick={close}><ArrowLeft size={13} /> Close</button>
          <button className="close-btn" onClick={close}><X size={14} /></button>
        </div>
        <div className="disp" style={{ fontSize: 16, fontWeight: 700 }}>Follow-up Rules</div>
        <div className="row-sub" style={{ marginTop: 3 }}>Controls when the Attention Feed escalates an item. Changes apply immediately and save automatically{saveError ? " — save failed, changes are for this session only." : "."}</div>
      </div>
      <div className="detail-body">
        {groups.map(g => (
          <div key={g} style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ margin: "0 0 8px 0" }}>{g}</div>
            {THRESHOLD_FIELDS.filter(f => f.group === g).map(f => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>{f.label}</div>
                <input type="number" min={0} value={thresholds[f.key]} onChange={e => setThresholds(prev => ({ ...prev, [f.key]: Math.max(0, parseInt(e.target.value || "0", 10)) }))}
                  style={{ width: 56, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 7, color: "var(--text)", fontSize: 12.5, padding: "6px 8px", textAlign: "center" }} />
              </div>
            ))}
          </div>
        ))}
        <button className="btn" onClick={() => setThresholds(DEFAULT_THRESHOLDS)}>Reset to defaults</button>
      </div>
    </>
  );
}

/* ============================== DETAIL PANEL ============================== */
function DetailPanel({ sp, tab, setTab, close, cycleDeliverable, advanceStage,
  updateFields, updatePaymentSub, updatePaymentTop,
  addDeliverable, removeDeliverable, editDeliverable, setStageDirect, setApproverStatus, resetApprovals,
  addTask, loadSuggestedTasks, toggleTaskItem, removeTask, deleteSponsorship, sponsorships }) {
  const followUps = generateFollowUps(sp);
  const stageIdx = STAGES.indexOf(sp.stage);
  const [newSponsorDl, setNewSponsorDl] = useState({ name: "", dueDate: "", department: "", inKindValue: "", connectivityType: "", deviceReturnDate: "" });
  const [newPartnerDl, setNewPartnerDl] = useState({ name: "", dueDate: "", inKindValue: "" });
  const [newTask, setNewTask] = useState("");
  const [editingDlId, setEditingDlId] = useState(null); // which deliverable row (if any) is currently expanded for editing
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cur = currentApprover(sp);
  const regions = useMemo(() => distinctValues(sponsorships || [], "region"), [sponsorships]);
  const eventTypes = useMemo(() => distinctValues(sponsorships || [], "eventType"), [sponsorships]);
  const sponsorshipTypes = useMemo(() => distinctValues(sponsorships || [], "sponsorshipType"), [sponsorships]);

  return (
    <>
      <div className="detail-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <button className="btn ghost" onClick={close}><ArrowLeft size={13} /> Close</button>
          <button className="close-btn" onClick={close}><X size={14} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{sp.requestId} {sp.memoNumber && `· ${sp.memoNumber}`}</div>
          <span className={`badge ${computeHealth(sp).cls}`}>{computeHealth(sp).label}</span>
        </div>

        <InlineEditField value={sp.eventName} onSave={v => updateFields(sp.id, { eventName: v })}
          displayClassName="disp" displayStyle={{ fontSize: 18, fontWeight: 700 }} inputStyle={{ fontSize: 16, fontWeight: 700 }} />
        <div style={{ marginTop: 3, display: "flex", alignItems: "center" }}>
          <Building2 size={11} style={{ verticalAlign: -2, marginRight: 4, flexShrink: 0 }} />
          <InlineEditField value={sp.organizer} onSave={v => updateFields(sp.id, { organizer: v })} displayStyle={{ fontSize: 12.5, color: "var(--text-dim)" }} />
        </div>

        {STAGES.includes(sp.stage) && (
          <div className="stage-track">
            {STAGES.map((st, i) => (
              <div key={st} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div className={`stage-node ${i < stageIdx ? "done" : i === stageIdx ? "current" : ""}`}>{st}</div>
                {i < STAGES.length - 1 && <span className="stage-arrow">→</span>}
              </div>
            ))}
          </div>
        )}
        {!STAGES.includes(sp.stage) && <div style={{ marginTop: 10 }}><span className={`badge ${stageBadgeClass(sp.stage)}`}>{sp.stage}</span></div>}
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          {STAGES.includes(sp.stage) && sp.stage !== "Memo Approval" && (
            <>
              <button className="btn" onClick={() => advanceStage(sp.id, -1)} disabled={stageIdx === 0}>← Move back</button>
              <button className="btn" onClick={() => advanceStage(sp.id, 1)} disabled={stageIdx === STAGES.length - 1}>Advance stage →</button>
              <button className="btn danger" onClick={() => setStageDirect(sp.id, "Rejected")}>Reject</button>
            </>
          )}
          {sp.stage === "Completed" && <button className="btn" onClick={() => setStageDirect(sp.id, "Archived")}>Archive</button>}
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 5 }}>
            Jump to stage:
            <InlineEditField type="select" value={sp.stage} onSave={v => setStageDirect(sp.id, v)}
              options={STAGES.concat(TERMINAL_ONLY)} displayStyle={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }} />
          </div>
        </div>

        <div className="tabs">
          {[
            { key: "overview", label: "Overview" },
            { key: "approvals", label: "Approvals" },
            { key: "sponsorDeliverables", label: "Sponsor Deliverables" },
            { key: "partnerDeliverables", label: "Partner Deliverables" },
            { key: "payment", label: "Payment" },
            { key: "tasks", label: "Tasks" },
          ].map(t => (
            <div key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</div>
          ))}
        </div>
      </div>

      <div className="detail-body">
        {tab === "overview" && (
          <>
            {followUps.length > 0 && (
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-head"><div className="panel-title"><Bell size={13} /> Follow-ups</div></div>
                <div className="panel-body">
                  {followUps.map((f) => {
                    const b = levelBadge(f.level);
                    return (
                      <div className="attn-item" key={f.key}>
                        <SignalBars level={f.level} />
                        <div><div className="attn-text">{f.text}</div><div className="attn-meta">{f.category} · owner: {f.owner}</div></div>
                        <span className={`badge ${b.cls}`} style={{ marginLeft: "auto" }}>{b.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(sp.sponsorDeliverables.length > 0 || sp.partnerDeliverables.length > 0) && (
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-head"><div className="panel-title"><ListChecks size={13} /> Deliverables at a Glance</div></div>
                <div className="panel-body" style={{ display: "flex", gap: 10, padding: "10px 10px", flexWrap: "wrap" }}>
                  {[
                    { kind: "sponsor", accent: "var(--signal-info)" },
                    { kind: "partner", accent: "var(--brand)" },
                  ].map(({ kind, accent }) => {
                    const cfg = DELIVERABLE_KIND[kind];
                    const list = sp[cfg.field] || [];
                    const done = list.filter(x => x.status === "Done").length;
                    const overdue = list.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) > 0).length;
                    const pct = list.length ? Math.round((done / list.length) * 100) : 0;
                    return (
                      <div key={kind} style={{ flex: "1 1 220px", minWidth: 200, background: "var(--panel-2)", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }} onClick={() => setTab(cfg.field)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: accent }}>{cfg.short}</span>
                          {overdue > 0 && <span className="badge crit">{overdue} overdue</span>}
                        </div>
                        {list.length ? (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}><span>{done}/{list.length} complete</span><span>{pct}%</span></div>
                            <div style={{ height: 6, background: "var(--panel)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "var(--signal-ok)" : accent }} /></div>
                          </>
                        ) : <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>Nothing tracked yet</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <datalist id="dl-regions-edit">{regions.map(r => <option key={r} value={r} />)}</datalist>
            <datalist id="dl-eventtypes-edit">{eventTypes.map(t => <option key={t} value={t} />)}</datalist>
            <datalist id="dl-sponsorshiptypes-edit">{sponsorshipTypes.map(t => <option key={t} value={t} />)}</datalist>

            <div className="kv-grid">
              <div><div className="kv-label">Region</div>
                <InlineEditField value={sp.region} onSave={v => updateFields(sp.id, { region: v })} list="dl-regions-edit" placeholder="Add region"
                  displayClassName="kv-val" format={v => v ? <><MapPin size={11} style={{ verticalAlign: -1, marginRight: 3 }} />{v}</> : null} />
              </div>
              <div><div className="kv-label">Event Type</div>
                <InlineEditField value={sp.eventType} onSave={v => updateFields(sp.id, { eventType: v })} list="dl-eventtypes-edit" placeholder="Add event type" displayClassName="kv-val" />
              </div>
              <div><div className="kv-label">Sponsorship Value</div>
                <InlineEditField type="select" value={sp.valueType} onSave={v => updateFields(sp.id, { valueType: v })}
                  options={["Cash", "In-Kind", "Cash + In-Kind"]} displayClassName="kv-val mono" />
              </div>
              {sp.valueType !== "In-Kind" && (
                <div><div className="kv-label">Sponsor Amount (MVR)</div>
                  <InlineEditField type="number" value={sp.sponsorAmount} onSave={v => updateFields(sp.id, { sponsorAmount: Number(v) || 0 })}
                    displayClassName="kv-val mono" format={v => fmtMVR(Number(v))} />
                </div>
              )}
              <div><div className="kv-label">Sponsorship Type</div>
                <InlineEditField value={sp.sponsorshipType} onSave={v => updateFields(sp.id, { sponsorshipType: v })} list="dl-sponsorshiptypes-edit" placeholder="Add sponsorship type" displayClassName="kv-val" />
              </div>
              <div><div className="kv-label">Request Received</div><div className="kv-val">{fmtDate(sp.receivedDate)}</div></div>
              <div><div className="kv-label">Event Date{sp.eventEndDate && !sameDay(sp.eventDate, sp.eventEndDate) ? "s" : ""}</div>
                <InlineEditField type="date" value={dstr(sp.eventDate)} onSave={v => updateFields(sp.id, { eventDate: parseDateInput(v) || sp.eventDate })}
                  displayClassName="kv-val" format={() => fmtDateRange(sp.eventDate, sp.eventEndDate)} />
              </div>
              <div><div className="kv-label">Event End Date</div>
                <InlineEditField type="date" value={sp.eventEndDate ? dstr(sp.eventEndDate) : ""} onSave={v => updateFields(sp.id, { eventEndDate: parseDateInput(v) })}
                  displayClassName="kv-val" placeholder="Single-day"
                  format={() => spanLabel(sp.eventDate, sp.eventEndDate) ? `${fmtDate(sp.eventEndDate)} (${spanLabel(sp.eventDate, sp.eventEndDate)})` : (sp.eventEndDate ? fmtDate(sp.eventEndDate) : null)} />
              </div>
              <div><div className="kv-label">Budget Code</div>
                <InlineEditField value={sp.budgetCode} onSave={v => updateFields(sp.id, { budgetCode: v })} placeholder="Add budget code" displayClassName="kv-val mono" />
              </div>
              <div><div className="kv-label">Duration</div>
                <InlineEditField value={sp.duration} onSave={v => updateFields(sp.id, { duration: v })} placeholder="Add duration" displayClassName="kv-val" />
              </div>
              <div><div className="kv-label">Memo Number</div>
                <InlineEditField value={sp.memoNumber} onSave={v => updateFields(sp.id, { memoNumber: v })} placeholder="Add memo number" displayClassName="kv-val" />
              </div>
            </div>

            {sp.valueType !== "Cash" && (
              <>
                <div className="section-label">In-Kind Details</div>
                <InlineEditField textarea value={sp.inKindDetails} onSave={v => updateFields(sp.id, { inKindDetails: v })}
                  placeholder="Connectivity provided, event support, exposure, etc." displayStyle={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6, display: "block" }} />
              </>
            )}
            <div className="section-label">Background</div>
            <InlineEditField textarea value={sp.background} onSave={v => updateFields(sp.id, { background: v })}
              placeholder="What is this event, briefly?" displayStyle={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6, display: "block" }} />
            <div className="section-label">Benefits</div>
            <InlineEditField textarea value={sp.benefits} onSave={v => updateFields(sp.id, { benefits: v })}
              placeholder="What do we get out of this sponsorship?" displayStyle={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6, display: "block" }} />
            <div className="section-label">Justification</div>
            <InlineEditField textarea value={sp.justification} onSave={v => updateFields(sp.id, { justification: v })}
              placeholder="Why does this sponsorship make sense?" displayStyle={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6, display: "block" }} />
            <div style={{ fontSize: 10.5, color: "var(--text-faint)", margin: "10px 0 14px" }}>General notes live on the Tasks tab, alongside to-dos for this sponsorship.</div>

            {!confirmDelete ? <button className="btn danger" onClick={() => setConfirmDelete(true)}>Delete this request</button> : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Delete permanently?</span>
                <button className="btn danger" onClick={() => deleteSponsorship(sp.id)}>Yes, delete</button>
                <button className="btn ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            )}
          </>
        )}

        {tab === "approvals" && (
          <>
            <div className="section-label">Memo Approval Flow</div>
            {cur ? (
              <div className="panel" style={{ marginBottom: 14, padding: "10px 14px" }}>
                <span className="badge warn">Awaiting</span> <span style={{ fontSize: 12.5, fontWeight: 600, marginLeft: 6 }}>{cur.approver}</span>
              </div>
            ) : (
              <div className="panel" style={{ marginBottom: 14, padding: "10px 14px" }}><span className="badge ok">All approvers signed off</span></div>
            )}
            {sp.approvals.map((a, i) => {
              const isCurrent = cur && a.approver === cur.approver;
              return (
                <div className={`approver-row ${isCurrent ? "current" : ""}`} key={a.approver}>
                  <div className={`approver-idx ${a.status === "Approved" ? "done" : a.status === "Rejected" ? "rejected" : ""}`}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="approver-name">{a.approver}</div>
                    {a.date && <div className="approver-date">{a.status} on {fmtDate(a.date)}</div>}
                  </div>
                  <select className="form-select" style={{ width: 130 }} value={a.status} onChange={e => setApproverStatus(sp.id, a.approver, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              );
            })}
            {!cur && sp.stage === "Memo Approval" && <button className="btn ok" style={{ marginTop: 8 }} onClick={() => setStageDirect(sp.id, "Execution")}>Advance to Execution →</button>}
            <button className="btn ghost" style={{ marginTop: 8, marginLeft: 8 }} onClick={() => resetApprovals(sp.id)}>Reset approval flow</button>
          </>
        )}

        {(tab === "sponsorDeliverables" || tab === "partnerDeliverables") && (() => {
          const kind = tab === "sponsorDeliverables" ? "sponsor" : "partner";
          const cfg = DELIVERABLE_KIND[kind];
          const list = sp[cfg.field] || [];
          const [newDl, setNewDl] = kind === "sponsor" ? [newSponsorDl, setNewSponsorDl] : [newPartnerDl, setNewPartnerDl];
          const helperText = kind === "sponsor"
            ? "What we've committed to provide to the partner — connectivity, cash, tents, event setup, backdrop printing, giveaways, merch, marketing support. Owner is always Ooredoo; set a department for internal routing if useful."
            : "What the partner/organizer has committed to provide us in return — tier status, logo & branding, social media exposure, complimentary slots, stall space, PR opportunities. Owner is always the organizer.";
          const ownerText = (dl) => kind === "sponsor" ? `Ooredoo${dl.department ? ` · ${dl.department}` : ""}` : sp.organizer;
          const isHardware = (t) => HARDWARE_TYPES.includes(t);

          return (
            <>
              <div className="section-label">{cfg.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-faint)", lineHeight: 1.5, marginBottom: 12 }}>{helperText}</div>
              {list.length === 0 && <div className="panel-empty">No {cfg.label.toLowerCase()} defined yet.</div>}
              {list.map(dl => {
                // Overdue = due date has already passed (fixed — was inverted before)
                const overdue = dl.status !== "Done" && daysBetween(TODAY, dl.dueDate) > 0;
                const isEditing = editingDlId === dl.id;
                return (
                  <div className="check-row" key={dl.id} style={{ alignItems: isEditing ? "flex-start" : "center", background: !isEditing && overdue ? "var(--signal-crit-soft)" : undefined, borderRadius: 8 }}>
                    <div className={`check-box ${dl.status === "Done" ? "done" : dl.status === "In Progress" ? "progress" : ""}`} style={{ marginTop: isEditing ? 4 : 0 }} onClick={() => cycleDeliverable(sp.id, kind, dl.id)}>
                      {dl.status === "Done" && <CheckCircle2 size={11} color="#0d1a14" />}
                      {dl.status === "In Progress" && <Circle size={7} color="var(--signal-warn)" fill="var(--signal-warn)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                          <input className="form-input" style={{ width: 170 }} value={dl.name} onChange={e => editDeliverable(sp.id, kind, dl.id, { name: e.target.value })} placeholder="Name" />
                          <input type="date" className="form-input" style={{ width: 140 }} value={dstr(dl.dueDate)} onChange={e => editDeliverable(sp.id, kind, dl.id, { dueDate: parseDateInput(e.target.value) || dl.dueDate })} />
                          <select className="form-select" style={{ width: 120 }} value={dl.status} onChange={e => editDeliverable(sp.id, kind, dl.id, { status: e.target.value })}>
                            {["Pending", "In Progress", "Done"].map(st => <option key={st}>{st}</option>)}
                          </select>
                          {kind === "sponsor" && (
                            <input className="form-input" style={{ width: 150 }} list="dept-suggestions" value={dl.department || ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { department: e.target.value })} placeholder="Department (optional)" />
                          )}
                          <input type="number" className="form-input" style={{ width: 130 }} value={dl.inKindValue ?? ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { inKindValue: e.target.value === "" ? null : Number(e.target.value) })} placeholder="In-kind value (MVR)" />
                          <input className="form-input" style={{ width: 160 }} value={dl.evidence || ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { evidence: e.target.value })} placeholder="Evidence" />
                          <input className="form-input" style={{ width: 160 }} value={dl.notes || ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { notes: e.target.value })} placeholder="Notes" />
                          {kind === "sponsor" && (
                            <>
                              <select className="form-select" style={{ width: 170 }} value={dl.connectivityType || ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { connectivityType: e.target.value || null, deviceReturnDate: isHardware(e.target.value) ? dl.deviceReturnDate : null, deviceReturnStatus: isHardware(e.target.value) ? dl.deviceReturnStatus : null })}>
                                <option value="">— Not a connectivity item —</option>
                                {CONNECTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              {isHardware(dl.connectivityType) && (
                                <>
                                  <input type="date" className="form-input" style={{ width: 150 }} value={dstr(dl.deviceReturnDate)} onChange={e => editDeliverable(sp.id, kind, dl.id, { deviceReturnDate: parseDateInput(e.target.value) })} title="Device return date" />
                                  <select className="form-select" style={{ width: 140 }} value={dl.deviceReturnStatus || ""} onChange={e => editDeliverable(sp.id, kind, dl.id, { deviceReturnStatus: e.target.value || null })}>
                                    <option value="">Return status…</option>
                                    <option value="Pending Return">Pending Return</option>
                                    <option value="Returned">Returned</option>
                                  </select>
                                </>
                              )}
                            </>
                          )}
                          <button className="btn ok" style={{ padding: "6px 10px" }} onClick={() => setEditingDlId(null)}>Done</button>
                        </div>
                      ) : (
                        <>
                          <div className={`check-label ${dl.status === "Done" ? "done" : ""}`}>{dl.name}{dl.connectivityType ? ` (${dl.connectivityType})` : ""}</div>
                          <div className="check-meta">
                            {ownerText(dl)} · Due {fmtDate(dl.dueDate)}
                            {dl.evidence && ` · Evidence: ${dl.evidence}`}{dl.notes && ` · ${dl.notes}`}
                            {dl.inKindValue ? ` · In-kind: ${fmtMVR(dl.inKindValue)}` : ""}
                            {dl.deviceReturnDate && ` · Device return ${fmtDate(dl.deviceReturnDate)}${dl.deviceReturnStatus ? ` (${dl.deviceReturnStatus})` : ""}`}
                          </div>
                        </>
                      )}
                    </div>
                    {!isEditing && <span className={`badge ${overdue ? "crit" : dl.status === "Done" ? "ok" : dl.status === "In Progress" ? "warn" : "neutral"}`}>{overdue ? "Overdue" : dl.status}</span>}
                    {!isEditing && <Pencil size={13} className="del-x" onClick={() => setEditingDlId(dl.id)} title="Edit deliverable" style={{ marginLeft: 2 }} />}
                    <X size={14} className="del-x" onClick={() => removeDeliverable(sp.id, kind, dl.id)} title="Remove deliverable" />
                  </div>
                );
              })}

              <datalist id="dept-suggestions">{DEPARTMENT_SUGGESTIONS.map(d => <option key={d} value={d} />)}</datalist>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                {cfg.presets.map(p => (
                  <span key={p} className="badge neutral" style={{ cursor: "pointer" }} onClick={() => setNewDl({ ...newDl, name: p, ...(kind === "sponsor" && p === "Connectivity" ? { connectivityType: CONNECTIVITY_TYPES[0] } : {}) })}>{p}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
                <input className="form-input" style={{ width: 170 }} placeholder="Deliverable name" value={newDl.name} onChange={e => setNewDl({ ...newDl, name: e.target.value })} />
                <input type="date" className="form-input" style={{ width: 140 }} value={newDl.dueDate} onChange={e => setNewDl({ ...newDl, dueDate: e.target.value })} />
                {kind === "sponsor" && (
                  <input className="form-input" style={{ width: 160 }} list="dept-suggestions" placeholder="Department (optional)" value={newDl.department} onChange={e => setNewDl({ ...newDl, department: e.target.value })} />
                )}
                <input type="number" className="form-input" style={{ width: 150 }} placeholder="In-kind value (MVR)" value={newDl.inKindValue} onChange={e => setNewDl({ ...newDl, inKindValue: e.target.value })} />
                {kind === "sponsor" && (
                  <select className="form-select" style={{ width: 180 }} value={newDl.connectivityType} onChange={e => setNewDl({ ...newDl, connectivityType: e.target.value })}>
                    <option value="">— Not a connectivity item —</option>
                    {CONNECTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
                {kind === "sponsor" && isHardware(newDl.connectivityType) && (
                  <input type="date" className="form-input" style={{ width: 150 }} title="Device return date" value={newDl.deviceReturnDate} onChange={e => setNewDl({ ...newDl, deviceReturnDate: e.target.value })} />
                )}
                <button className="btn" disabled={!newDl.name.trim()} onClick={() => {
                  if (!newDl.name.trim()) return;
                  const patch = {
                    name: newDl.name, dueDate: parseDateInput(newDl.dueDate) || TODAY,
                    inKindValue: newDl.inKindValue === "" || newDl.inKindValue == null ? null : Number(newDl.inKindValue),
                  };
                  if (kind === "sponsor") {
                    patch.department = newDl.department || "";
                    patch.connectivityType = newDl.connectivityType || null;
                    patch.deviceReturnDate = isHardware(newDl.connectivityType) ? (parseDateInput(newDl.deviceReturnDate) || null) : null;
                    patch.deviceReturnStatus = isHardware(newDl.connectivityType) ? "Pending Return" : null;
                  }
                  addDeliverable(sp.id, kind, patch);
                  setNewDl(kind === "sponsor"
                    ? { name: "", dueDate: "", department: "", inKindValue: "", connectivityType: "", deviceReturnDate: "" }
                    : { name: "", dueDate: "", inKindValue: "" });
                }}>+ Add</button>
              </div>
            </>
          );
        })()}

        {tab === "payment" && sp.payment && (
          <>
            <div className="section-label">PR Issuance</div>
            <div className="form-row-2">
              <div><div className="kv-label">Status</div>
                <select className="form-select" value={sp.payment.pr.status} onChange={e => updatePaymentSub(sp.id, "pr", { status: e.target.value })}>
                  {["N/A", "Not Required", "Not Started", "Raised", "Approved"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div><div className="kv-label">Due Date</div><input type="date" className="form-input" value={dstr(sp.payment.pr.dueDate)} onChange={e => updatePaymentSub(sp.id, "pr", { dueDate: parseDateInput(e.target.value) })} /></div>
            </div>

            <div className="section-label">PO Issuance</div>
            <div className="form-row-2">
              <div><div className="kv-label">Status</div>
                <select className="form-select" value={sp.payment.po.status} onChange={e => updatePaymentSub(sp.id, "po", { status: e.target.value })}>
                  {["N/A", "Not Required", "Not Started", "Raised", "Approved"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div><div className="kv-label">Due Date</div><input type="date" className="form-input" value={dstr(sp.payment.po.dueDate)} onChange={e => updatePaymentSub(sp.id, "po", { dueDate: parseDateInput(e.target.value) })} /></div>
            </div>

            <div className="section-label">Payment</div>
            <div className="form-row-2">
              <div><div className="kv-label">Invoice Status</div>
                <select className="form-select" value={sp.payment.invoiceStatus} onChange={e => updatePaymentTop(sp.id, { invoiceStatus: e.target.value })}>
                  {["N/A", "Not Required", "Pending", "Received"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div><div className="kv-label">Payment Status</div>
                <select className="form-select" value={sp.payment.payment.status} onChange={e => updatePaymentSub(sp.id, "payment", { status: e.target.value })}>
                  {["N/A", "Pending", "Paid"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div><div className="kv-label">Payment Due</div><input type="date" className="form-input" value={dstr(sp.payment.payment.dueDate)} onChange={e => updatePaymentSub(sp.id, "payment", { dueDate: parseDateInput(e.target.value) })} /></div>
              <div><div className="kv-label">Finance Follow-up</div><input type="date" className="form-input" value={dstr(sp.payment.financeFollowUpDate)} onChange={e => updatePaymentTop(sp.id, { financeFollowUpDate: parseDateInput(e.target.value) })} /></div>
            </div>
          </>
        )}

        {tab === "tasks" && (
          <>
            <div className="section-label">Tasks</div>
            {sp.tasks.length === 0 && <div className="panel-empty">No tasks yet.</div>}
            {sp.tasks.map(t => (
              <div key={t.id} className="check-row">
                <div className={`check-box ${t.done ? "done" : ""}`} onClick={() => toggleTaskItem(sp.id, t.id)}>{t.done && <CheckCircle2 size={11} color="#0d1a14" />}</div>
                <div className={`check-label ${t.done ? "done" : ""}`} style={{ flex: 1 }}>{t.text}</div>
                <X size={14} className="del-x" onClick={() => removeTask(sp.id, t.id)} title="Remove task" />
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              <input className="form-input" style={{ flex: 1, minWidth: 160 }} placeholder="Add a task…" value={newTask} onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newTask.trim()) { addTask(sp.id, newTask.trim()); setNewTask(""); } }} />
              <button className="btn" disabled={!newTask.trim()} onClick={() => { if (newTask.trim()) { addTask(sp.id, newTask.trim()); setNewTask(""); } }}>+ Add</button>
            </div>
            {SUGGESTED_TASKS[sp.stage] && (
              <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => loadSuggestedTasks(sp.id, sp.stage)}>Load suggested tasks for "{sp.stage}"</button>
            )}

            <div className="section-label" style={{ marginTop: 20 }}>Notes</div>
            <textarea className="form-textarea" style={{ minHeight: 90 }} placeholder="General notes about this sponsorship — context, reminders, anything worth flagging for the next person who opens this record…"
              value={sp.notes || ""} onChange={e => updateFields(sp.id, { notes: e.target.value })} />
          </>
        )}
      </div>
    </>
  );
}
