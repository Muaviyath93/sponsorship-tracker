"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, ListChecks, Users, Calendar as CalendarIcon, Search, Bell,
  Wifi, CreditCard, Clock, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown, ChevronLeft, X,
  ArrowLeft, Building2, FileText, TrendingUp, Circle, MapPin, Settings as SettingsIcon, Download
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

/* ============================== WORKFLOW CONSTANTS ============================== */
const STAGES = [
  "New Request", "Information Required", "Under Review", "Memo Preparation",
  "Memo Approval", "Approved", "Execution", "Completed"
];
const TERMINAL_ONLY = ["Rejected", "Archived"];

const APPROVAL_CHAIN = [
  "Brand Manager", "Financial Controller", "Financial Director",
  "Chief Commercial Officer", "Chief Financial Officer", "CEO",
];
function initApprovals() { return APPROVAL_CHAIN.map(a => ({ approver: a, status: "Pending", date: null })); }
function currentApprover(sp) { return (sp.approvals || []).find(a => a.status === "Pending") || null; }

const CONNECTIVITY_TYPES = ["ILL Connection", "5G AirFibre", "SIM with Data Package", "SuperNet Connection", "MiFi Device", "Existing SIM Package Upgrade"];
const HARDWARE_TYPES = ["5G AirFibre", "MiFi Device"]; // types that typically need a device return

const SUGGESTED_TASKS = {
  "New Request": ["Read proposal", "Validate mandatory information", "Log request and assign Request ID"],
  "Information Required": ["Request missing information from organizer", "Set follow-up reminder"],
  "Under Review": ["Evaluate strategic alignment", "Evaluate audience size & location", "Check budget reasonability", "Negotiate terms if required"],
  "Memo Preparation": ["Draft sponsorship memo", "Confirm budget code with Finance", "Route memo into approval flow"],
  "Memo Approval": ["Follow up with the currently pending approver", "Confirm all approver sign-offs are logged"],
  "Approved": ["Notify organizer of approval", "Arrange sponsorship agreement signing", "Schedule partner photo"],
  "Execution": ["Send official confirmation & offer to organizer", "Raise PR request", "Raise PO request", "Follow up with Finance on payment", "Send connectivity/device request if required"],
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
    sponsorshipType: "Cash + Connectivity", stage: "Execution", stageEnteredDate: d("2026-07-10"), receivedDate: d("2026-06-02"), eventDate: d("2026-08-15"),
    memoNumber: "MEMO-2026-041", budgetCode: "MKT-CSR-0426",
    background: "Children's football festival aimed at grassroots participation across Malé schools.",
    benefits: "Logo on all branding, MC mentions, booth space, social media coverage.", justification: "Aligns with youth & community engagement pillar.", duration: "1 day event",
    approvals: APPROVAL_CHAIN.map(a => ({ approver: a, status: "Approved", date: d("2026-07-05") })),
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-08-10"), status: "Done", evidence: "Banner proof received", notes: "" },
      { id: "dl2", name: "Booth", owner: "Events Team", dueDate: d("2026-08-14"), status: "In Progress", evidence: "", notes: "Booth layout confirmed" },
      { id: "dl3", name: "MC Mentions", owner: "Mua", dueDate: d("2026-08-15"), status: "Pending", evidence: "", notes: "" },
      { id: "dl4", name: "Facebook Post", owner: "Social Media Team", dueDate: d("2026-08-16"), status: "Pending", evidence: "", notes: "" },
      { id: "dl5", name: "Photos Received", owner: "Organizer", dueDate: d("2026-08-17"), status: "Pending", evidence: "", notes: "" },
      { id: "dl6", name: "Monthly Report", owner: "Mua", dueDate: d("2026-09-05"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: seedPayment({
      invoiceStatus: "Received",
      pr: { status: "Raised", dueDate: d("2026-07-25"), owner: "You" },
      po: { status: "Not Started", dueDate: d("2026-07-28"), owner: "You" },
      payment: { status: "Pending", dueDate: d("2026-08-05"), owner: "Finance" },
      financeFollowUpDate: d("2026-07-14"),
    }),
    connectivity: [
      { id: "c1", type: "5G AirFibre", technicalTeam: "Network Ops", setupDate: d("2026-08-13"), setupStatus: "Not Started", needsReturn: true, deviceReturnDate: null, deviceReturnStatus: null },
    ],
    notes: "", tasks: [],
  },
  {
    id: "sp-22", requestId: "SP-2026-022", eventName: "21st Anniversary — Senior Citizen Activity Day", organizer: "Ooredoo CSR Programme (Internal)",
    eventType: "Internal CSR", region: "Malé", valueType: "In-Kind", sponsorAmount: 0, inKindDetails: "Venue support, transport coordination, internal comms and photography coverage.",
    sponsorshipType: "In-Kind", stage: "Memo Approval", stageEnteredDate: d("2026-07-15"), receivedDate: d("2026-06-25"), eventDate: d("2026-08-02"),
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
    deliverables: [
      { id: "dl1", name: "Venue Booking", owner: "CSR Team", dueDate: d("2026-07-25"), status: "In Progress", evidence: "", notes: "" },
      { id: "dl2", name: "Activity Plan", owner: "Mua", dueDate: d("2026-07-24"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: seedPayment(), connectivity: [], notes: "", tasks: [],
  },
  {
    id: "sp-10", requestId: "SP-2026-010", eventName: "Eid Al-Adha Regional Event — Kulhudhuffushi", organizer: "Ministry of Youth, Sports & Community Empowerment",
    eventType: "Regional / Religious", region: "Kulhudhuffushi", valueType: "Cash", sponsorAmount: 60000, inKindDetails: "",
    sponsorshipType: "Cash", stage: "Memo Approval", stageEnteredDate: d("2026-07-16"), receivedDate: d("2026-06-28"), eventDate: d("2026-07-28"),
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
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-07-25"), status: "Pending", evidence: "", notes: "" },
      { id: "dl2", name: "Media Coverage", owner: "Organizer", dueDate: d("2026-07-29"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: seedPayment({ invoiceStatus: "Pending", payment: { status: "Pending", dueDate: d("2026-07-26"), owner: "Finance" }, financeFollowUpDate: d("2026-07-20") }),
    connectivity: [], notes: "", tasks: [],
  },
  {
    id: "sp-25", requestId: "SP-2026-025", eventName: "Inter-Atoll Swimming Championship", organizer: "Ministry of Youth, Sports & Community Empowerment",
    eventType: "Sports", region: "Multi-atoll", valueType: "Cash + In-Kind", sponsorAmount: 150000, inKindDetails: "Live results connectivity and on-site technical support across venues.",
    sponsorshipType: "Cash + Connectivity + Devices", stage: "Under Review", stageEnteredDate: d("2026-07-19"), receivedDate: d("2026-07-08"), eventDate: d("2026-09-02"),
    memoNumber: "", budgetCode: "",
    background: "Multi-atoll swimming championship requiring live results connectivity.", benefits: "Branding, connectivity naming rights, VIP access.",
    justification: "High visibility national sports event.", duration: "3 days",
    approvals: initApprovals(),
    deliverables: [{ id: "dl1", name: "Evaluation Notes", owner: "Mua", dueDate: d("2026-07-24"), status: "In Progress", evidence: "", notes: "" }],
    payment: seedPayment(),
    connectivity: [
      { id: "c1", type: "ILL Connection", technicalTeam: "Network Ops", setupDate: d("2026-08-30"), setupStatus: "Not Started", needsReturn: false, deviceReturnDate: null, deviceReturnStatus: null },
      { id: "c2", type: "MiFi Device", technicalTeam: "Network Ops", setupDate: d("2026-07-19"), setupStatus: "Completed", needsReturn: true, deviceReturnDate: d("2026-07-19"), deviceReturnStatus: "Pending Return" },
    ],
    notes: "Temporary device from prior test run is overdue for return.", tasks: [],
  },
  {
    id: "sp-18", requestId: "SP-2026-018", eventName: "Male' City Marathon 2026", organizer: "Male' City Marathon Organizing Committee",
    eventType: "Sports", region: "Malé", valueType: "Cash", sponsorAmount: 200000, inKindDetails: "",
    sponsorshipType: "Cash + Connectivity", stage: "Under Review", stageEnteredDate: d("2026-07-12"), receivedDate: d("2026-07-01"), eventDate: d("2026-09-20"),
    memoNumber: "", budgetCode: "",
    background: "Annual flagship marathon, nationwide visibility.", benefits: "Title branding, booth, live connectivity, VIP.", justification: "Highest-reach annual sports sponsorship.", duration: "1 day",
    approvals: initApprovals(),
    deliverables: [], payment: seedPayment(), connectivity: [], notes: "", tasks: [],
  },
];

/* ============================== FOLLOW-UP ENGINE ============================== */
const DEFAULT_THRESHOLDS = {
  approvalWarnDays: 3, approvalUrgentDays: 4, approvalCriticalDays: 6,
  connectivityWindowDays: 7, connectivityCriticalDays: 2,
  eventApprovalWindowDays: 5, intakeStallDays: 3,
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
      items.push({ text: `All approvers have signed off — advance this request to Approved.`, level: 2, category: "Approval", owner: "You", sortDate: sp.stageEnteredDate });
    }
  }
  if (["Under Review", "Memo Preparation"].includes(sp.stage) && daysInStage >= T.approvalWarnDays) {
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

  (sp.connectivity || []).forEach((c) => {
    if (c.setupStatus !== "Completed" && daysToEvent >= 0 && daysToEvent <= T.connectivityWindowDays) {
      items.push({ text: `${c.type} setup due in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"}.`, level: daysToEvent <= T.connectivityCriticalDays ? 4 : 3, category: "Connectivity", owner: c.technicalTeam || "Technical Team", sortDate: c.setupDate || sp.eventDate });
    }
    if (c.needsReturn && c.deviceReturnStatus === "Pending Return" && c.deviceReturnDate) {
      const overdue = daysBetween(TODAY, c.deviceReturnDate);
      if (overdue >= 0) items.push({ text: `${c.type} should be returned (${overdue} day${overdue === 1 ? "" : "s"} overdue).`, level: 4, category: "Device", owner: "You", sortDate: c.deviceReturnDate });
    }
  });

  if (sp.deliverables && sp.deliverables.length) {
    // Overdue = due date has passed (TODAY is after the due date). Previously inverted — fixed.
    const overdueItems = sp.deliverables.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) > 0);
    if (overdueItems.length > 0 && !["Rejected", "Archived"].includes(sp.stage)) {
      items.push({
        text: `${overdueItems.length} deliverable${overdueItems.length === 1 ? "" : "s"} past due date (${overdueItems.map(x => x.name).join(", ")}).`,
        level: 4, category: "Deliverables", owner: "You", sortDate: overdueItems.sort((a, b) => a.dueDate - b.dueDate)[0].dueDate,
      });
    }
  }
  if (daysToEvent >= 0 && daysToEvent <= T.eventApprovalWindowDays && !["Approved", "Execution", "Completed", "Archived", "Rejected"].includes(sp.stage)) {
    items.push({ text: `Event starts in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"} — sponsorship not yet approved.`, level: 4, category: "Deadline", owner: "You", sortDate: sp.eventDate });
  }
  if (sp.stage === "Information Required") {
    items.push({ text: `Organizer has not submitted required information (${daysInStage} day${daysInStage === 1 ? "" : "s"} since flagged).`, level: daysInStage >= T.intakeStallDays ? 3 : 1, category: "Intake", owner: "Organizer", sortDate: sp.stageEnteredDate });
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
  if (["Approved", "Completed"].includes(stage)) return "ok";
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
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

  const allFollowUpsRaw = useMemo(() => {
    const arr = sponsorships.flatMap(generateFollowUps);
    return arr.sort((a, b) => (b.level !== a.level ? b.level - a.level : daysBetween(a.sortDate, TODAY) - daysBetween(b.sortDate, TODAY)));
  }, [sponsorships, thresholds]);

  const allFollowUps = allFollowUpsRaw.filter(f => !dismissed[f.key]);
  const ackedFollowUps = allFollowUpsRaw.filter(f => dismissed[f.key]);

  function acknowledge(key) { setDismissed(prev => ({ ...prev, [key]: true })); }
  function unacknowledge(key) { setDismissed(prev => { const n = { ...prev }; delete n[key]; return n; }); }

  function openDetail(id, tab) { setSelectedId(id); setDetailTab(tab || "overview"); setEditMode(false); }
  function closeDetail() { setSelectedId(null); setEditMode(false); }

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
      memoNumber: "", budgetCode: "", background: data.background || "", benefits: "", justification: "", duration: "",
      approvals: initApprovals(), deliverables: [], payment: seedPayment(), connectivity: [],
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
  function addConnectivity(spId, item) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, connectivity: [...(s.connectivity || []), { id: "c-" + Date.now(), technicalTeam: "", setupDate: null, setupStatus: "Not Started", needsReturn: HARDWARE_TYPES.includes(item.type), deviceReturnDate: null, deviceReturnStatus: null, ...item }] } : s));
  }
  function updateConnectivityItem(spId, cid, patch) {
    setSponsorships(prev => prev.map(s => s.id !== spId ? s : { ...s, connectivity: s.connectivity.map(c => c.id === cid ? { ...c, ...patch } : c) }));
  }
  function removeConnectivityItem(spId, cid) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, connectivity: s.connectivity.filter(c => c.id !== cid) } : s));
  }
  function addDeliverable(spId, dl) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, deliverables: [...s.deliverables, { id: "dl-" + Date.now(), status: "Pending", evidence: "", notes: "", ...dl }] } : s));
  }
  function removeDeliverable(spId, dlId) {
    setSponsorships(prev => prev.map(s => s.id === spId ? { ...s, deliverables: s.deliverables.filter(dd => dd.id !== dlId) } : s));
  }
  function editDeliverable(spId, dlId, patch) {
    setSponsorships(prev => prev.map(s => s.id !== spId ? s : { ...s, deliverables: s.deliverables.map(dd => dd.id === dlId ? { ...dd, ...patch } : dd) }));
  }
  function cycleDeliverable(spId, dlId) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      return { ...s, deliverables: s.deliverables.map(dl => dl.id !== dlId ? dl : { ...dl, status: dl.status === "Pending" ? "In Progress" : dl.status === "In Progress" ? "Done" : "Pending" }) };
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
      else if (approvals.every(a => a.status === "Approved") && s.stage === "Memo Approval") stage = s.stage; // stays; user advances explicitly, or use the shortcut button
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
      const doneCount = s.deliverables.filter(x => x.status === "Done").length;
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
        "Request Received": fmtDate(s.receivedDate),
        "Memo Number": s.memoNumber,
        "Budget Code": s.budgetCode,
        "Memo Approval — Awaiting": currentApprover(s) ? currentApprover(s).approver : (s.approvals.every(a => a.status === "Approved") ? "All approved" : ""),
        "PR Status": s.payment.pr.status,
        "PO Status": s.payment.po.status,
        "Payment Status": s.payment.payment.status,
        "Payment Due": fmtDate(s.payment.payment.dueDate),
        "Connectivity Items": (s.connectivity || []).map(c => c.type).join(", "),
        "Deliverables Progress": s.deliverables.length ? `${doneCount}/${s.deliverables.length}` : "",
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
  const connectivityPending = sponsorships.flatMap(s => (s.connectivity || []).filter(c => c.setupStatus !== "Completed").map(c => ({ sp: s, c })));
  const deviceReturns = sponsorships.flatMap(s => (s.connectivity || []).filter(c => c.needsReturn && c.deviceReturnStatus === "Pending Return").map(c => ({ sp: s, c })));
  const overdueCount = allFollowUps.filter(f => f.level === 4).length;
  const recentRequests = [...sponsorships].sort((a, b) => b.receivedDate - a.receivedDate).slice(0, 5);
  const recentApprovals = sponsorships.filter(s => ["Approved", "Execution", "Completed"].includes(s.stage)).sort((a, b) => b.stageEnteredDate - a.stageEnteredDate).slice(0, 5);
  const sponsorsRequiringAction = ORGS.filter(o => sponsorships.some(s => s.organizer === o.name && generateFollowUps(s).some(f => f.level >= 3)));

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sponsorships.filter(s => s.eventName.toLowerCase().includes(q) || s.organizer.toLowerCase().includes(q) || s.requestId.toLowerCase().includes(q) || s.memoNumber.toLowerCase().includes(q) || s.stage.toLowerCase().includes(q)).slice(0, 8);
  }, [query, sponsorships]);

  const filteredPipeline = sponsorships.filter(s => stageFilter === "All" || s.stage === stageFilter);

  const NAV = [
    { key: "dashboard", label: "Command Center", icon: LayoutDashboard, count: overdueCount || null },
    { key: "pipeline", label: "Sponsorship Pipeline", icon: ListChecks, count: sponsorships.length },
    { key: "sponsors", label: "Sponsorship Profiles", icon: Users, count: sponsorships.length },
    { key: "calendar", label: "Calendar", icon: CalendarIcon, count: upcomingEvents.length },
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
              pendingPayments={pendingPayments} connectivityPending={connectivityPending} deviceReturns={deviceReturns}
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
              cycleDeliverable={cycleDeliverable} advanceStage={advanceStage} editMode={editMode} setEditMode={setEditMode}
              updateFields={updateFields} updatePaymentSub={updatePaymentSub} updatePaymentTop={updatePaymentTop}
              addConnectivity={addConnectivity} updateConnectivityItem={updateConnectivityItem} removeConnectivityItem={removeConnectivityItem}
              addDeliverable={addDeliverable} removeDeliverable={removeDeliverable} editDeliverable={editDeliverable}
              setStageDirect={setStageDirect} setApproverStatus={setApproverStatus} resetApprovals={resetApprovals}
              addTask={addTask} loadSuggestedTasks={loadSuggestedTasks} toggleTaskItem={toggleTaskItem} removeTask={removeTask}
              deleteSponsorship={deleteSponsorship} />
          </div>
        </div>
      )}

      {newRequestOpen && (
        <div className="overlay" onClick={() => setNewRequestOpen(false)}>
          <div className="detail-panel" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <NewRequestForm onCreate={createSponsorship} close={() => setNewRequestOpen(false)} />
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
    openDetail, sponsorships, acknowledge, unacknowledge, showAcked, setShowAcked } = props;
  const [expanded, setExpanded] = useState({});

  const pendingApprovals = sponsorships.filter(s => s.stage === "Memo Approval");
  const pendingPaymentsCount = sponsorships.filter(s => s.payment && s.payment.payment.status === "Pending").length;

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

  return (
    <>
      <div className="grid stat-row">
        <StatCard label="Critical Items" num={overdueCount} icon={<AlertTriangle size={14} />} color="crit" hot={overdueCount > 0} />
        <StatCard label="Memo Approval Pending" num={pendingApprovals.length} icon={<ListChecks size={14} />} color="warn" />
        <StatCard label="Events (Next 21 Days)" num={upcomingEvents.length} icon={<CalendarIcon size={14} />} color="info" />
        <StatCard label="Pending Payments" num={pendingPaymentsCount} icon={<CreditCard size={14} />} color="warn" />
      </div>

      {/* Needs Attention — health + follow-ups combined, one line per project, expandable for detail */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div className="panel-title"><Bell size={13} /> Needs Attention</div>
          <div className="panel-title-count">{flaggedCount} flagged · {onTrackCount} on track{ackedFollowUps.length > 0 ? ` · ${ackedFollowUps.length} acknowledged` : ""}</div></div>
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
                <div style={{ flex: 1 }}><div className="row-title">{s.eventName}</div><div className="row-sub">{fmtDate(s.eventDate)} · {s.region}</div></div>
                <span className={`badge ${daysBetween(s.eventDate, TODAY) <= 5 ? "crit" : "info"}`}>{daysBetween(s.eventDate, TODAY)}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, num, icon, color, hot }) {
  const colorMap = { warn: "var(--signal-warn)", info: "var(--signal-info)", crit: "var(--signal-crit)", ok: "var(--signal-ok)" };
  const softMap = { warn: "var(--signal-warn-soft)", info: "var(--signal-info-soft)", crit: "var(--signal-crit-soft)", ok: "var(--signal-ok-soft)" };
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
              <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>{fmtDate(s.eventDate)}</div>
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
        const done = s.deliverables.filter(dl => dl.status === "Done").length;
        const total = s.deliverables.length;
        const pct = total ? Math.round((done / total) * 100) : 0;
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
              {(s.connectivity || []).length > 0 && <span className="badge neutral">Connectivity</span>}
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div className="org-stat"><div className="num mono">{s.valueType === "In-Kind" ? "In-Kind" : fmtMVR(s.sponsorAmount)}</div><div className="lbl">Value</div></div>
              <div className="org-stat"><div className="num">{daysToEvent >= 0 ? `${daysToEvent}d` : "Past"}</div><div className="lbl">{daysToEvent >= 0 ? "To Event" : "Event Date"}</div></div>
            </div>
            {total > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}><span>Deliverables</span><span>{done}/{total}</span></div>
                <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "var(--signal-ok)" : "var(--brand)" }} /></div>
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
    events.push({ date: s.eventDate, type: "Event", label: s.eventName, sub: s.region, sp: s });
    if (s.payment?.payment?.dueDate) events.push({ date: s.payment.payment.dueDate, type: "Payment", label: `Payment due — ${s.eventName}`, sub: fmtMVR(s.sponsorAmount), sp: s });
    (s.connectivity || []).forEach(c => {
      if (c.setupDate) events.push({ date: c.setupDate, type: "Connectivity", label: `${c.type} setup — ${s.eventName}`, sub: c.type, sp: s });
      if (c.deviceReturnDate) events.push({ date: c.deviceReturnDate, type: "Device Return", label: `${c.type} return — ${s.eventName}`, sub: c.type, sp: s });
    });
  });
  return events;
}
const CAL_TYPE_COLOR = { Event: "info", Payment: "warn", Connectivity: "neutral", "Device Return": "crit" };
const CAL_TYPE_DOT = { Event: "var(--signal-info)", Payment: "var(--signal-warn)", Connectivity: "var(--signal-neutral)", "Device Return": "var(--signal-crit)" };

function CalendarView({ sponsorships, openDetail }) {
  const [mode, setMode] = useState("agenda"); // "agenda" | "month"
  const [monthCursor, setMonthCursor] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const events = useMemo(() => buildCalendarEvents(sponsorships), [sponsorships]);

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
                    <div className="agenda-event" key={i} onClick={() => openDetail(it.sp.id)}>
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
    const key = e.date.toDateString();
    if (!eventsByDay[key]) eventsByDay[key] = [];
    eventsByDay[key].push(e);
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
              <div className="agenda-event" key={i} onClick={() => openDetail(it.sp.id)}>
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
function NewRequestForm({ onCreate, close }) {
  const [form, setForm] = useState({ eventName: "", organizer: "", eventType: "", region: "", valueType: "Cash", sponsorAmount: "", inKindDetails: "", sponsorshipType: "", eventDate: "", background: "" });
  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const canSubmit = form.eventName.trim() && form.organizer.trim();

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
        <div className="form-row"><div className="kv-label">Event Name *</div><input className="form-input" value={form.eventName} onChange={set("eventName")} placeholder="e.g. Inter-School Chess Championship" /></div>
        <div className="form-row"><div className="kv-label">Organizer *</div><input className="form-input" value={form.organizer} onChange={set("organizer")} placeholder="e.g. Maldives Chess Association" /></div>
        <div className="form-row-2">
          <div><div className="kv-label">Event Type</div><input className="form-input" value={form.eventType} onChange={set("eventType")} placeholder="Sports / CSR / Regional…" /></div>
          <div><div className="kv-label">Region</div><input className="form-input" value={form.region} onChange={set("region")} placeholder="Malé, Addu City…" /></div>
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
          <div className="form-row"><div className="kv-label">Sponsor Amount (MVR)</div><input type="number" className="form-input" value={form.sponsorAmount} onChange={set("sponsorAmount")} placeholder="0" /></div>
        )}
        {form.valueType !== "Cash" && (
          <div className="form-row"><div className="kv-label">In-Kind Details</div><textarea className="form-textarea" value={form.inKindDetails} onChange={set("inKindDetails")} placeholder="e.g. AirFibre connectivity for the event, on-site technical support, exposure package…" /></div>
        )}
        <div className="form-row"><div className="kv-label">Sponsorship Type</div><input className="form-input" value={form.sponsorshipType} onChange={set("sponsorshipType")} placeholder="Cash / Connectivity / Combination…" /></div>
        <div className="form-row"><div className="kv-label">Event Date</div><input type="date" className="form-input" value={form.eventDate} onChange={set("eventDate")} /></div>
        <div className="form-row"><div className="kv-label">Background</div><textarea className="form-textarea" value={form.background} onChange={set("background")} placeholder="What is this event, briefly?" /></div>
        <button className="btn primary" disabled={!canSubmit} onClick={() => canSubmit && onCreate(form)}>Create Request</button>
      </div>
    </>
  );
}

/* ============================== SETTINGS PANEL ============================== */
const THRESHOLD_FIELDS = [
  { key: "approvalWarnDays", label: "Flag a stalled approval step after (days)", group: "Approvals" },
  { key: "approvalUrgentDays", label: "Escalate to Urgent after (days)", group: "Approvals" },
  { key: "approvalCriticalDays", label: "Escalate to Critical after (days)", group: "Approvals" },
  { key: "connectivityWindowDays", label: "Start warning about setup this many days before the event", group: "Connectivity" },
  { key: "connectivityCriticalDays", label: "Escalate setup warning to Critical inside (days)", group: "Connectivity" },
  { key: "eventApprovalWindowDays", label: "Flag unapproved requests once event is within (days)", group: "Deadlines" },
  { key: "intakeStallDays", label: "Escalate a stalled information request after (days)", group: "Intake" },
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
function DetailPanel({ sp, tab, setTab, close, cycleDeliverable, advanceStage, editMode, setEditMode,
  updateFields, updatePaymentSub, updatePaymentTop, addConnectivity, updateConnectivityItem, removeConnectivityItem,
  addDeliverable, removeDeliverable, editDeliverable, setStageDirect, setApproverStatus, resetApprovals,
  addTask, loadSuggestedTasks, toggleTaskItem, removeTask, deleteSponsorship }) {
  const followUps = generateFollowUps(sp);
  const stageIdx = STAGES.indexOf(sp.stage);
  const [newDl, setNewDl] = useState({ name: "", owner: "", dueDate: "" });
  const [newTask, setNewTask] = useState("");
  const [newConn, setNewConn] = useState({ type: CONNECTIVITY_TYPES[0] });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cur = currentApprover(sp);

  return (
    <>
      <div className="detail-head">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <button className="btn ghost" onClick={close}><ArrowLeft size={13} /> Close</button>
          <div style={{ display: "flex", gap: 6 }}>
            <button className={`btn ${editMode ? "primary" : ""}`} onClick={() => setEditMode(!editMode)}>{editMode ? "Done Editing" : "Edit"}</button>
            <button className="close-btn" onClick={close}><X size={14} /></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{sp.requestId} {sp.memoNumber && `· ${sp.memoNumber}`}</div>
          <span className={`badge ${computeHealth(sp).cls}`}>{computeHealth(sp).label}</span>
        </div>

        {editMode ? (
          <input className="form-input disp" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }} value={sp.eventName} onChange={e => updateFields(sp.id, { eventName: e.target.value })} />
        ) : <div className="disp" style={{ fontSize: 18, fontWeight: 700 }}>{sp.eventName}</div>}
        {editMode ? (
          <input className="form-input" style={{ marginTop: 4 }} value={sp.organizer} onChange={e => updateFields(sp.id, { organizer: e.target.value })} />
        ) : <div className="row-sub" style={{ marginTop: 3 }}><Building2 size={11} style={{ verticalAlign: -2, marginRight: 4 }} />{sp.organizer}</div>}

        {editMode ? (
          <div className="form-row" style={{ marginTop: 12 }}>
            <div className="kv-label">Stage</div>
            <select className="form-select" value={sp.stage} onChange={e => setStageDirect(sp.id, e.target.value)}>
              {STAGES.concat(TERMINAL_ONLY).map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        ) : (
          <>
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
            {STAGES.includes(sp.stage) && sp.stage !== "Memo Approval" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button className="btn" onClick={() => advanceStage(sp.id, -1)} disabled={stageIdx === 0}>← Move back</button>
                <button className="btn" onClick={() => advanceStage(sp.id, 1)} disabled={stageIdx === STAGES.length - 1}>Advance stage →</button>
                <button className="btn danger" onClick={() => setStageDirect(sp.id, "Rejected")}>Reject</button>
              </div>
            )}
            {sp.stage === "Completed" && <div style={{ marginTop: 8 }}><button className="btn" onClick={() => setStageDirect(sp.id, "Archived")}>Archive</button></div>}
          </>
        )}

        <div className="tabs">
          {["overview", "approvals", "deliverables", "payment", "connectivity", "tasks"].map(t => (
            <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
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

            {editMode ? (
              <>
                <div className="form-row-2">
                  <div><div className="kv-label">Region</div><input className="form-input" value={sp.region} onChange={e => updateFields(sp.id, { region: e.target.value })} /></div>
                  <div><div className="kv-label">Event Type</div><input className="form-input" value={sp.eventType} onChange={e => updateFields(sp.id, { eventType: e.target.value })} /></div>
                </div>
                <div className="form-row">
                  <div className="kv-label">Sponsorship Value</div>
                  <select className="form-select" value={sp.valueType} onChange={e => updateFields(sp.id, { valueType: e.target.value })}>
                    <option value="Cash">Cash</option>
                    <option value="In-Kind">In-Kind only</option>
                    <option value="Cash + In-Kind">Cash + In-Kind</option>
                  </select>
                </div>
                {sp.valueType !== "In-Kind" && (
                  <div className="form-row"><div className="kv-label">Sponsor Amount (MVR)</div><input type="number" className="form-input" value={sp.sponsorAmount} onChange={e => updateFields(sp.id, { sponsorAmount: Number(e.target.value) || 0 })} /></div>
                )}
                {sp.valueType !== "Cash" && (
                  <div className="form-row"><div className="kv-label">In-Kind Details</div><textarea className="form-textarea" value={sp.inKindDetails} onChange={e => updateFields(sp.id, { inKindDetails: e.target.value })} placeholder="Connectivity provided, event support, exposure, etc." /></div>
                )}
                <div className="form-row-2">
                  <div><div className="kv-label">Event Date</div><input type="date" className="form-input" value={dstr(sp.eventDate)} onChange={e => updateFields(sp.id, { eventDate: parseDateInput(e.target.value) || sp.eventDate })} /></div>
                  <div><div className="kv-label">Budget Code</div><input className="form-input" value={sp.budgetCode} onChange={e => updateFields(sp.id, { budgetCode: e.target.value })} /></div>
                </div>
                <div className="form-row-2">
                  <div><div className="kv-label">Memo Number</div><input className="form-input" value={sp.memoNumber} onChange={e => updateFields(sp.id, { memoNumber: e.target.value })} /></div>
                  <div><div className="kv-label">Duration</div><input className="form-input" value={sp.duration} onChange={e => updateFields(sp.id, { duration: e.target.value })} /></div>
                </div>
                <div className="form-row"><div className="kv-label">Background</div><textarea className="form-textarea" value={sp.background} onChange={e => updateFields(sp.id, { background: e.target.value })} /></div>
                <div className="form-row"><div className="kv-label">Benefits</div><textarea className="form-textarea" value={sp.benefits} onChange={e => updateFields(sp.id, { benefits: e.target.value })} /></div>
                <div className="form-row"><div className="kv-label">Justification</div><textarea className="form-textarea" value={sp.justification} onChange={e => updateFields(sp.id, { justification: e.target.value })} /></div>
                <div className="form-row"><div className="kv-label">Notes</div><textarea className="form-textarea" value={sp.notes} onChange={e => updateFields(sp.id, { notes: e.target.value })} /></div>
                {!confirmDelete ? <button className="btn danger" onClick={() => setConfirmDelete(true)}>Delete this request</button> : (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Delete permanently?</span>
                    <button className="btn danger" onClick={() => deleteSponsorship(sp.id)}>Yes, delete</button>
                    <button className="btn ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="kv-grid">
                  <div><div className="kv-label">Region</div><div className="kv-val"><MapPin size={11} style={{ verticalAlign: -1, marginRight: 3 }} />{sp.region || "—"}</div></div>
                  <div><div className="kv-label">Event Type</div><div className="kv-val">{sp.eventType || "—"}</div></div>
                  <div><div className="kv-label">Value</div><div className="kv-val mono">{sp.valueType === "In-Kind" ? "In-Kind" : fmtMVR(sp.sponsorAmount)}{sp.valueType === "Cash + In-Kind" ? " + In-Kind" : ""}</div></div>
                  <div><div className="kv-label">Sponsorship Type</div><div className="kv-val">{sp.sponsorshipType || "—"}</div></div>
                  <div><div className="kv-label">Request Received</div><div className="kv-val">{fmtDate(sp.receivedDate)}</div></div>
                  <div><div className="kv-label">Event Date</div><div className="kv-val">{fmtDate(sp.eventDate)}</div></div>
                  <div><div className="kv-label">Budget Code</div><div className="kv-val mono">{sp.budgetCode || "—"}</div></div>
                  <div><div className="kv-label">Duration</div><div className="kv-val">{sp.duration || "—"}</div></div>
                </div>
                {sp.inKindDetails && (<><div className="section-label">In-Kind Details</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.inKindDetails}</div></>)}
                {sp.background && (<><div className="section-label">Background</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.background}</div></>)}
                {sp.benefits && (<><div className="section-label">Benefits</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.benefits}</div></>)}
                {sp.justification && (<><div className="section-label">Justification</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.justification}</div></>)}
                {sp.notes && (<><div className="section-label">Notes</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.notes}</div></>)}
              </>
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
                  {editMode ? (
                    <select className="form-select" style={{ width: 130 }} value={a.status} onChange={e => setApproverStatus(sp.id, a.approver, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  ) : <span className={`badge ${a.status === "Approved" ? "ok" : a.status === "Rejected" ? "crit" : "neutral"}`}>{a.status}</span>}
                </div>
              );
            })}
            {!cur && sp.stage === "Memo Approval" && <button className="btn ok" style={{ marginTop: 8 }} onClick={() => setStageDirect(sp.id, "Approved")}>Advance to Approved →</button>}
            {editMode && <button className="btn ghost" style={{ marginTop: 8, marginLeft: 8 }} onClick={() => resetApprovals(sp.id)}>Reset approval flow</button>}
          </>
        )}

        {tab === "deliverables" && (
          <>
            <div className="section-label">Deliverable Checklist</div>
            {sp.deliverables.length === 0 && <div className="panel-empty">No deliverables defined yet.</div>}
            {sp.deliverables.map(dl => {
              // Overdue = due date has already passed (fixed — was inverted before)
              const overdue = dl.status !== "Done" && daysBetween(TODAY, dl.dueDate) > 0;
              return (
                <div className="check-row" key={dl.id} style={overdue ? { background: "var(--signal-crit-soft)", borderRadius: 8 } : undefined}>
                  <div className={`check-box ${dl.status === "Done" ? "done" : dl.status === "In Progress" ? "progress" : ""}`} onClick={() => cycleDeliverable(sp.id, dl.id)}>
                    {dl.status === "Done" && <CheckCircle2 size={11} color="#0d1a14" />}
                    {dl.status === "In Progress" && <Circle size={7} color="var(--signal-warn)" fill="var(--signal-warn)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    {editMode ? (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <input className="form-input" style={{ width: 160 }} value={dl.name} onChange={e => editDeliverable(sp.id, dl.id, { name: e.target.value })} />
                        <input className="form-input" style={{ width: 100 }} value={dl.owner} onChange={e => editDeliverable(sp.id, dl.id, { owner: e.target.value })} placeholder="Owner" />
                        <input type="date" className="form-input" style={{ width: 140 }} value={dstr(dl.dueDate)} onChange={e => editDeliverable(sp.id, dl.id, { dueDate: parseDateInput(e.target.value) || dl.dueDate })} />
                      </div>
                    ) : (
                      <>
                        <div className={`check-label ${dl.status === "Done" ? "done" : ""}`}>{dl.name}</div>
                        <div className="check-meta">Owner: {dl.owner} · Due {fmtDate(dl.dueDate)} {dl.evidence && `· Evidence: ${dl.evidence}`}{dl.notes && ` · ${dl.notes}`}</div>
                      </>
                    )}
                  </div>
                  <span className={`badge ${overdue ? "crit" : dl.status === "Done" ? "ok" : dl.status === "In Progress" ? "warn" : "neutral"}`}>{overdue ? "Overdue" : dl.status}</span>
                  <X size={14} className="del-x" onClick={() => removeDeliverable(sp.id, dl.id)} title="Remove deliverable" />
                </div>
              );
            })}
            {editMode && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
                <input className="form-input" style={{ width: 160 }} placeholder="New deliverable name" value={newDl.name} onChange={e => setNewDl({ ...newDl, name: e.target.value })} />
                <input className="form-input" style={{ width: 100 }} placeholder="Owner" value={newDl.owner} onChange={e => setNewDl({ ...newDl, owner: e.target.value })} />
                <input type="date" className="form-input" style={{ width: 140 }} value={newDl.dueDate} onChange={e => setNewDl({ ...newDl, dueDate: e.target.value })} />
                <button className="btn" disabled={!newDl.name.trim()} onClick={() => {
                  if (!newDl.name.trim()) return;
                  addDeliverable(sp.id, { name: newDl.name, owner: newDl.owner || "Unassigned", dueDate: parseDateInput(newDl.dueDate) || TODAY });
                  setNewDl({ name: "", owner: "", dueDate: "" });
                }}>+ Add</button>
              </div>
            )}
          </>
        )}

        {tab === "payment" && sp.payment && (
          <>
            <div className="section-label">PR Issuance</div>
            {editMode ? (
              <div className="form-row-2">
                <div><div className="kv-label">Status</div>
                  <select className="form-select" value={sp.payment.pr.status} onChange={e => updatePaymentSub(sp.id, "pr", { status: e.target.value })}>
                    {["N/A", "Not Required", "Not Started", "Raised", "Approved"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><div className="kv-label">Due Date</div><input type="date" className="form-input" value={dstr(sp.payment.pr.dueDate)} onChange={e => updatePaymentSub(sp.id, "pr", { dueDate: parseDateInput(e.target.value) })} /></div>
              </div>
            ) : (
              <div className="kv-grid" style={{ marginTop: 4 }}>
                <div><div className="kv-label">Status</div><div className="kv-val"><span className={`badge ${["Approved","N/A","Not Required"].includes(sp.payment.pr.status) ? "ok" : "warn"}`}>{sp.payment.pr.status}</span></div></div>
                <div><div className="kv-label">Due Date</div><div className="kv-val">{fmtDate(sp.payment.pr.dueDate)}</div></div>
              </div>
            )}

            <div className="section-label">PO Issuance</div>
            {editMode ? (
              <div className="form-row-2">
                <div><div className="kv-label">Status</div>
                  <select className="form-select" value={sp.payment.po.status} onChange={e => updatePaymentSub(sp.id, "po", { status: e.target.value })}>
                    {["N/A", "Not Required", "Not Started", "Raised", "Approved"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><div className="kv-label">Due Date</div><input type="date" className="form-input" value={dstr(sp.payment.po.dueDate)} onChange={e => updatePaymentSub(sp.id, "po", { dueDate: parseDateInput(e.target.value) })} /></div>
              </div>
            ) : (
              <div className="kv-grid" style={{ marginTop: 4 }}>
                <div><div className="kv-label">Status</div><div className="kv-val"><span className={`badge ${["Approved","N/A","Not Required"].includes(sp.payment.po.status) ? "ok" : "warn"}`}>{sp.payment.po.status}</span></div></div>
                <div><div className="kv-label">Due Date</div><div className="kv-val">{fmtDate(sp.payment.po.dueDate)}</div></div>
              </div>
            )}

            <div className="section-label">Payment</div>
            {editMode ? (
              <>
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
            ) : (
              <div className="kv-grid" style={{ marginTop: 4 }}>
                <div><div className="kv-label">Invoice Status</div><div className="kv-val">{sp.payment.invoiceStatus}</div></div>
                <div><div className="kv-label">Payment Status</div><div className="kv-val"><span className={`badge ${sp.payment.payment.status === "Paid" ? "ok" : sp.payment.payment.status === "Pending" ? "warn" : "neutral"}`}>{sp.payment.payment.status}</span></div></div>
                <div><div className="kv-label">Payment Due</div><div className="kv-val">{fmtDate(sp.payment.payment.dueDate)}</div></div>
                <div><div className="kv-label">Finance Follow-up</div><div className="kv-val">{fmtDate(sp.payment.financeFollowUpDate)}</div></div>
              </div>
            )}
          </>
        )}

        {tab === "connectivity" && (
          <>
            <div className="section-label">Connectivity &amp; Devices</div>
            {(!sp.connectivity || sp.connectivity.length === 0) && <div className="panel-empty">No connectivity items yet.</div>}
            {(sp.connectivity || []).map(c => (
              <div className="conn-item" key={c.id}>
                {editMode ? (
                  <>
                    <div className="form-row-2">
                      <div><div className="kv-label">Type</div>
                        <select className="form-select" value={c.type} onChange={e => updateConnectivityItem(sp.id, c.id, { type: e.target.value, needsReturn: HARDWARE_TYPES.includes(e.target.value) })}>
                          {CONNECTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><div className="kv-label">Technical Team</div><input className="form-input" value={c.technicalTeam} onChange={e => updateConnectivityItem(sp.id, c.id, { technicalTeam: e.target.value })} /></div>
                    </div>
                    <div className="form-row-2">
                      <div><div className="kv-label">Setup Date</div><input type="date" className="form-input" value={dstr(c.setupDate)} onChange={e => updateConnectivityItem(sp.id, c.id, { setupDate: parseDateInput(e.target.value) })} /></div>
                      <div><div className="kv-label">Setup Status</div>
                        <select className="form-select" value={c.setupStatus} onChange={e => updateConnectivityItem(sp.id, c.id, { setupStatus: e.target.value })}>
                          {["Not Started", "Pending Setup", "Completed"].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" checked={c.needsReturn} onChange={e => updateConnectivityItem(sp.id, c.id, { needsReturn: e.target.checked })} />
                      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>This item involves hardware that needs to be returned</span>
                    </div>
                    {c.needsReturn && (
                      <div className="form-row-2">
                        <div><div className="kv-label">Device Return Date</div><input type="date" className="form-input" value={dstr(c.deviceReturnDate)} onChange={e => updateConnectivityItem(sp.id, c.id, { deviceReturnDate: parseDateInput(e.target.value) })} /></div>
                        <div><div className="kv-label">Return Status</div>
                          <select className="form-select" value={c.deviceReturnStatus || ""} onChange={e => updateConnectivityItem(sp.id, c.id, { deviceReturnStatus: e.target.value || null })}>
                            <option value="">Not yet due</option>
                            <option value="Pending Return">Pending Return</option>
                            <option value="Returned">Returned</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <button className="btn danger" onClick={() => removeConnectivityItem(sp.id, c.id)}>Remove this item</button>
                  </>
                ) : (
                  <div className="kv-grid" style={{ margin: 0 }}>
                    <div><div className="kv-label">Type</div><div className="kv-val">{c.type}</div></div>
                    <div><div className="kv-label">Technical Team</div><div className="kv-val">{c.technicalTeam || "—"}</div></div>
                    <div><div className="kv-label">Setup Date</div><div className="kv-val">{fmtDate(c.setupDate)}</div></div>
                    <div><div className="kv-label">Setup Status</div><div className="kv-val"><span className={`badge ${c.setupStatus === "Completed" ? "ok" : "warn"}`}>{c.setupStatus}</span></div></div>
                    {c.needsReturn && (
                      <>
                        <div><div className="kv-label">Device Return Date</div><div className="kv-val">{fmtDate(c.deviceReturnDate)}</div></div>
                        <div><div className="kv-label">Return Status</div><div className="kv-val"><span className={`badge ${c.deviceReturnStatus === "Pending Return" ? "crit" : "ok"}`}>{c.deviceReturnStatus || "—"}</span></div></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            {editMode && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6 }}>
                <select className="form-select" style={{ width: 200 }} value={newConn.type} onChange={e => setNewConn({ type: e.target.value })}>
                  {CONNECTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <button className="btn" onClick={() => addConnectivity(sp.id, { type: newConn.type })}>+ Add connectivity item</button>
              </div>
            )}
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
          </>
        )}
      </div>
    </>
  );
}
