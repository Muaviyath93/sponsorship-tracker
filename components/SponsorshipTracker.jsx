"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, ListChecks, Users, Calendar as CalendarIcon, Search, Bell,
  Wifi, CreditCard, Clock, AlertTriangle, CheckCircle2, ChevronRight, X,
  ArrowLeft, Building2, FileText, Smartphone, TrendingUp, Circle, MapPin, Settings as SettingsIcon
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

  /* Sidebar */
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

  /* Main */
  .sot .main { flex: 1; min-width: 0; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .sot .topbar { display: flex; align-items: center; gap: 14px; padding: 14px 22px; border-bottom: 1px solid var(--line-soft); flex-shrink: 0; }
  .sot .page-title { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; }
  .sot .page-sub { font-size: 12px; color: var(--text-faint); margin-top: 1px; }
  .sot .search-wrap { position: relative; margin-left: auto; width: 320px; }
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

  /* Grid + cards */
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

  /* Attention feed - signature element */
  .sot .attn-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 10px; border-radius: 9px; cursor: pointer; }
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
  .sot .attn-item .chev { margin-left: auto; color: var(--text-faint); flex-shrink: 0; margin-top: 2px; }

  /* Badges / pills */
  .sot .badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 20px; white-space: nowrap; }
  .sot .badge.info { background: var(--signal-info-soft); color: var(--signal-info); }
  .sot .badge.warn { background: var(--signal-warn-soft); color: var(--signal-warn); }
  .sot .badge.crit { background: var(--signal-crit-soft); color: var(--signal-crit); }
  .sot .badge.ok { background: var(--signal-ok-soft); color: var(--signal-ok); }
  .sot .badge.neutral { background: var(--signal-neutral-soft); color: var(--signal-neutral); }
  .sot .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Table / list rows */
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

  /* Buttons */
  .sot .btn { font-size: 12px; font-weight: 600; padding: 7px 13px; border-radius: 8px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .sot .btn:hover { border-color: var(--text-faint); }
  .sot .btn.ghost { background: none; }

  /* Detail slide-over */
  .sot .overlay { position: fixed; inset: 0; background: rgba(6,7,10,0.6); z-index: 50; display: flex; justify-content: flex-end; }
  .sot .detail-panel { width: 620px; max-width: 92vw; height: 100%; background: var(--bg-raised); border-left: 1px solid var(--line); overflow-y: auto; }
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

  .sot .tabs { display: flex; gap: 3px; border-bottom: 1px solid var(--line-soft); margin: 18px 0 14px 0; }
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

  .sot .task-chip { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; background: var(--panel); border: 1px solid var(--line-soft); margin-bottom: 6px; cursor: pointer; font-size: 12px; }
  .sot .task-chip.done { opacity: .5; }
  .sot .task-chip .idx { font-size: 10px; color: var(--text-faint); }

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

  @media (max-width: 900px) {
    .sot .sidebar { position: fixed; z-index: 60; height: 100%; transform: translateX(-100%); transition: transform .2s; }
    .sot .sidebar.open { transform: translateX(0); }
    .sot .stat-row { grid-template-columns: 1fr 1fr; }
    .sot .two-col { grid-template-columns: 1fr; }
    .sot .t-row { grid-template-columns: 1fr; }
    .sot .kv-grid { grid-template-columns: 1fr; }
    .sot .detail-panel { width: 100%; }
    .sot .search-wrap { width: 160px; }
  }
`;

/* ============================== SEED DATA ============================== */
const TODAY = new Date(2026, 6, 21); // 21 Jul 2026
const d = (s) => new Date(s + "T00:00:00");
const daysBetween = (a, b) => Math.round((a - b) / 86400000);

const STAGES = [
  "New Request", "Information Required", "Under Review", "Pending Manager Review",
  "Pending CCO Review", "Memo Preparation", "Pending Finance Approval",
  "Pending CEO Approval", "Approved", "Execution", "Completed"
];
const TERMINAL_ONLY = ["Rejected", "Archived"];

const STAGE_TASKS = {
  "Approved": ["Notify organizer of approval", "Arrange sponsorship agreement signing", "Schedule partner photo"],
  "Execution": ["Raise PR request", "Raise PO request", "Follow up with Finance on payment", "Send connectivity/device request if required"],
  "Completed": ["Collect event photos", "Confirm deliverables evidence received", "Update monthly report", "Archive coverage"],
  "Memo Preparation": ["Draft sponsorship memo", "Confirm budget code with Finance", "Route memo to Manager for review"],
  "Pending Manager Review": ["Await Manager decision", "Prepare evaluation notes if requested"],
  "Pending CCO Review": ["Present case to CCO", "Address CCO queries"],
  "Pending Finance Approval": ["Confirm budget availability with Financial Control", "Route to Director Finance"],
  "Pending CEO Approval": ["Prepare CEO briefing note", "Track approval turnaround"],
  "New Request": ["Read proposal", "Validate mandatory information", "Log request and assign Request ID"],
  "Information Required": ["Request missing information from organizer", "Set follow-up reminder"],
  "Under Review": ["Evaluate strategic alignment", "Evaluate audience size & location", "Check budget reasonability", "Negotiate terms if required"],
};

const ORGS = [
  { id: "org-1", name: "Maldives Youth Football Association", category: "Sports", relationshipNotes: "Reliable partner, strong turnaround on deliverable evidence.", pastEvents: [{ event: "Foari Kids Fest 2025", year: 2025, amount: 150000 }] },
  { id: "org-2", name: "Ooredoo CSR Programme (Internal)", category: "Internal / CSR", relationshipNotes: "Internal anniversary programme, coordinated via CSR team.", pastEvents: [{ event: "20th Anniversary CSR Drive", year: 2025, amount: 110000 }] },
  { id: "org-3", name: "Ministry of Islamic Affairs — Regional Eid Committees", category: "Government", relationshipNotes: "Recurring annual regional sponsorships across atolls.", pastEvents: [{ event: "Eid Al-Fitr Regional Events 2025", year: 2025, amount: 210000 }] },
  { id: "org-4", name: "World Cup Partner Consortium", category: "Retail / Partner Brands", relationshipNotes: "Multi-brand giveaway campaign, press coverage strong.", pastEvents: [{ event: "World Cup Final Giveaway", year: 2026, amount: 75000 }] },
  { id: "org-5", name: "Ministry of Youth, Sports & Community Empowerment", category: "Government", relationshipNotes: "High-value events, longer approval cycles historically.", pastEvents: [{ event: "National Youth Games 2025", year: 2025, amount: 180000 }] },
  { id: "org-6", name: "National Quiz Association", category: "Education", relationshipNotes: "New relationship, first proposal received.", pastEvents: [] },
  { id: "org-7", name: "Male' City Marathon Organizing Committee", category: "Sports", relationshipNotes: "Annual flagship sports sponsorship, high visibility.", pastEvents: [{ event: "Male' City Marathon 2025", year: 2025, amount: 190000 }] },
];

const SEED_SPONSORSHIPS = [
  {
    id: "sp-14", requestId: "SP-2026-014", eventName: "Football Foari Kids Fest 2026", organizer: "Maldives Youth Football Association", sponsorOrgId: "org-1",
    eventType: "Community / Sports", region: "Malé — Central Park", sponsorAmount: 185000, sponsorshipType: "Cash + Connectivity",
    stage: "Execution", stageEnteredDate: d("2026-07-10"), receivedDate: d("2026-06-02"), eventDate: d("2026-08-15"),
    memoNumber: "MEMO-2026-041", budgetCode: "MKT-CSR-0426",
    background: "Children's football festival aimed at grassroots participation across Malé schools.",
    benefits: "Logo on all branding, MC mentions, booth space, social media coverage.", justification: "Aligns with youth & community engagement pillar.", duration: "1 day event",
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-08-10"), status: "Done", evidence: "Banner proof received", notes: "" },
      { id: "dl2", name: "Booth", owner: "Events Team", dueDate: d("2026-08-14"), status: "In Progress", evidence: "", notes: "Booth layout confirmed" },
      { id: "dl3", name: "MC Mentions", owner: "Mua", dueDate: d("2026-08-15"), status: "Pending", evidence: "", notes: "" },
      { id: "dl4", name: "Facebook Post", owner: "Social Media Team", dueDate: d("2026-08-16"), status: "Pending", evidence: "", notes: "" },
      { id: "dl5", name: "Connectivity Setup", owner: "Technical Team", dueDate: d("2026-08-13"), status: "Pending", evidence: "", notes: "" },
      { id: "dl6", name: "Photos Received", owner: "Organizer", dueDate: d("2026-08-17"), status: "Pending", evidence: "", notes: "" },
      { id: "dl7", name: "Monthly Report", owner: "Mua", dueDate: d("2026-09-05"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: { invoiceStatus: "Received", prStatus: "Raised", poStatus: "Pending", paymentStatus: "Pending", paymentDueDate: d("2026-08-05"), financeFollowUpDate: d("2026-07-14") },
    connectivity: { type: "5G AirFibre", technicalTeam: "Network Ops", setupDate: d("2026-08-13"), setupStatus: "Pending Setup", deviceReturnDate: null, deviceReturnStatus: null },
    monthlyReportDone: false, notes: "", taskProgress: {},
  },
  {
    id: "sp-21", requestId: "SP-2026-021", eventName: "21st Anniversary — Kudagiri Picnic Day", organizer: "Ooredoo CSR Programme (Internal)", sponsorOrgId: "org-2",
    eventType: "Internal CSR", region: "Hulhumalé — Kudagiri", sponsorAmount: 92000, sponsorshipType: "Cash",
    stage: "Pending CEO Approval", stageEnteredDate: d("2026-07-15"), receivedDate: d("2026-06-20"), eventDate: d("2026-08-05"),
    memoNumber: "MEMO-2026-047", budgetCode: "MKT-CSR-0429",
    background: "Senior citizen picnic day as part of 21st anniversary CSR programme.", benefits: "Internal comms, photo coverage, partner acknowledgement.",
    justification: "Flagship anniversary CSR initiative.", duration: "1 day event",
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-07-30"), status: "Pending", evidence: "", notes: "" },
      { id: "dl2", name: "Transport Coordination", owner: "CSR Team", dueDate: d("2026-08-01"), status: "In Progress", evidence: "", notes: "" },
      { id: "dl3", name: "Photos", owner: "Events Team", dueDate: d("2026-08-06"), status: "Pending", evidence: "", notes: "" },
      { id: "dl4", name: "Monthly Report", owner: "Mua", dueDate: d("2026-09-01"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: { invoiceStatus: "Not Required", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "N/A", paymentDueDate: null, financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: false, notes: "", taskProgress: {},
  },
  {
    id: "sp-22", requestId: "SP-2026-022", eventName: "21st Anniversary — Senior Citizen Activity Day", organizer: "Ooredoo CSR Programme (Internal)", sponsorOrgId: "org-2",
    eventType: "Internal CSR", region: "Malé", sponsorAmount: 45000, sponsorshipType: "Cash",
    stage: "Memo Preparation", stageEnteredDate: d("2026-07-18"), receivedDate: d("2026-06-25"), eventDate: d("2026-08-02"),
    memoNumber: "", budgetCode: "MKT-CSR-0430",
    background: "Activity day for senior citizens in Malé, anniversary CSR programme.", benefits: "Internal engagement, community goodwill.",
    justification: "Part of 21st anniversary flagship CSR calendar.", duration: "Half day",
    deliverables: [
      { id: "dl1", name: "Venue Booking", owner: "CSR Team", dueDate: d("2026-07-25"), status: "In Progress", evidence: "", notes: "" },
      { id: "dl2", name: "Activity Plan", owner: "Mua", dueDate: d("2026-07-24"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: { invoiceStatus: "Not Required", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "N/A", paymentDueDate: null, financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: false, notes: "", taskProgress: {},
  },
  {
    id: "sp-9", requestId: "SP-2026-009", eventName: "Eid Al-Adha Regional Event — Addu City", organizer: "Ministry of Islamic Affairs — Regional Eid Committees", sponsorOrgId: "org-3",
    eventType: "Regional / Religious", region: "Addu City", sponsorAmount: 60000, sponsorshipType: "Cash",
    stage: "Completed", stageEnteredDate: d("2026-06-20"), receivedDate: d("2026-05-10"), eventDate: d("2026-06-18"),
    memoNumber: "MEMO-2026-029", budgetCode: "MKT-REG-0411",
    background: "Regional Eid Al-Adha celebration sponsorship.", benefits: "Branding, VIP mentions, media coverage.", justification: "Recurring annual regional goodwill sponsorship.", duration: "1 day",
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-06-17"), status: "Done", evidence: "Photo on file", notes: "" },
      { id: "dl2", name: "Media Coverage", owner: "Organizer", dueDate: d("2026-06-20"), status: "Done", evidence: "Local news clip", notes: "" },
      { id: "dl3", name: "Photos Received", owner: "Organizer", dueDate: d("2026-06-22"), status: "Done", evidence: "Album shared", notes: "" },
      { id: "dl4", name: "Monthly Report", owner: "Mua", dueDate: d("2026-07-15"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: { invoiceStatus: "Received", prStatus: "Raised", poStatus: "Raised", paymentStatus: "Paid", paymentDueDate: d("2026-06-25"), financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: false, notes: "", taskProgress: {},
  },
  {
    id: "sp-10", requestId: "SP-2026-010", eventName: "Eid Al-Adha Regional Event — Kulhudhuffushi", organizer: "Ministry of Islamic Affairs — Regional Eid Committees", sponsorOrgId: "org-3",
    eventType: "Regional / Religious", region: "Kulhudhuffushi", sponsorAmount: 60000, sponsorshipType: "Cash",
    stage: "Pending Finance Approval", stageEnteredDate: d("2026-07-16"), receivedDate: d("2026-06-28"), eventDate: d("2026-07-28"),
    memoNumber: "MEMO-2026-044", budgetCode: "MKT-REG-0412",
    background: "Regional Eid Al-Adha celebration sponsorship, northern atoll.", benefits: "Branding, VIP mentions.", justification: "Recurring annual regional goodwill sponsorship.", duration: "1 day",
    deliverables: [
      { id: "dl1", name: "Logo Placement", owner: "Mua", dueDate: d("2026-07-25"), status: "Pending", evidence: "", notes: "" },
      { id: "dl2", name: "Media Coverage", owner: "Organizer", dueDate: d("2026-07-29"), status: "Pending", evidence: "", notes: "" },
    ],
    payment: { invoiceStatus: "Pending", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "Pending", paymentDueDate: d("2026-07-26"), financeFollowUpDate: d("2026-07-20") },
    connectivity: null, monthlyReportDone: false, notes: "", taskProgress: {},
  },
  {
    id: "sp-5", requestId: "SP-2026-005", eventName: "World Cup Final Giveaway Campaign", organizer: "World Cup Partner Consortium", sponsorOrgId: "org-4",
    eventType: "Retail / Social Campaign", region: "Nationwide", sponsorAmount: 75000, sponsorshipType: "In-kind + Media",
    stage: "Archived", stageEnteredDate: d("2026-07-05"), receivedDate: d("2026-05-01"), eventDate: d("2026-06-14"),
    memoNumber: "MEMO-2026-018", budgetCode: "MKT-PRM-0388",
    background: "Multi-brand social media giveaway tied to World Cup Final.", benefits: "Press article, partner cross-promotion.", justification: "Strong partner co-marketing reach.", duration: "2 week campaign",
    deliverables: [
      { id: "dl1", name: "Press Release", owner: "Mua", dueDate: d("2026-06-16"), status: "Done", evidence: "Published", notes: "" },
      { id: "dl2", name: "Social Media", owner: "Social Media Team", dueDate: d("2026-06-15"), status: "Done", evidence: "Posts live", notes: "" },
      { id: "dl3", name: "Monthly Report", owner: "Mua", dueDate: d("2026-07-05"), status: "Done", evidence: "Filed", notes: "" },
    ],
    payment: { invoiceStatus: "Received", prStatus: "Raised", poStatus: "Raised", paymentStatus: "Paid", paymentDueDate: d("2026-06-20"), financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: true, notes: "", taskProgress: {},
  },
  {
    id: "sp-30", requestId: "SP-2026-030", eventName: "National Quiz Championship", organizer: "National Quiz Association", sponsorOrgId: "org-6",
    eventType: "Education", region: "Malé", sponsorAmount: 40000, sponsorshipType: "Cash",
    stage: "Information Required", stageEnteredDate: d("2026-07-20"), receivedDate: d("2026-07-20"), eventDate: d("2026-09-12"),
    memoNumber: "", budgetCode: "",
    background: "Proposal for national schools quiz championship.", benefits: "TBD pending full proposal.", justification: "TBD", duration: "TBD",
    deliverables: [], payment: { invoiceStatus: "N/A", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "N/A", paymentDueDate: null, financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: false, notes: "Proposal missing budget breakdown and audience size estimate — awaiting resubmission from organizer.", taskProgress: {},
  },
  {
    id: "sp-25", requestId: "SP-2026-025", eventName: "Inter-Atoll Swimming Championship", organizer: "Ministry of Youth, Sports & Community Empowerment", sponsorOrgId: "org-5",
    eventType: "Sports", region: "Multi-atoll", sponsorAmount: 150000, sponsorshipType: "Cash + Connectivity + Devices",
    stage: "Pending Manager Review", stageEnteredDate: d("2026-07-19"), receivedDate: d("2026-07-08"), eventDate: d("2026-09-02"),
    memoNumber: "", budgetCode: "",
    background: "Multi-atoll swimming championship requiring live results connectivity.", benefits: "Branding, connectivity naming rights, VIP access.",
    justification: "High visibility national sports event.", duration: "3 days",
    deliverables: [{ id: "dl1", name: "Evaluation Notes", owner: "Mua", dueDate: d("2026-07-24"), status: "In Progress", evidence: "", notes: "" }],
    payment: { invoiceStatus: "N/A", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "N/A", paymentDueDate: null, financeFollowUpDate: null },
    connectivity: { type: "ILL Event Connectivity + Temporary Devices", technicalTeam: "Network Ops", setupDate: d("2026-08-30"), setupStatus: "Not Started", deviceReturnDate: d("2026-07-19"), deviceReturnStatus: "Pending Return" },
    monthlyReportDone: false, notes: "Temporary AirFibre device from prior test run is overdue for return.", taskProgress: {},
  },
  {
    id: "sp-18", requestId: "SP-2026-018", eventName: "Male' City Marathon 2026", organizer: "Male' City Marathon Organizing Committee", sponsorOrgId: "org-7",
    eventType: "Sports", region: "Malé", sponsorAmount: 200000, sponsorshipType: "Cash + Connectivity",
    stage: "Under Review", stageEnteredDate: d("2026-07-12"), receivedDate: d("2026-07-01"), eventDate: d("2026-09-20"),
    memoNumber: "", budgetCode: "",
    background: "Annual flagship marathon, nationwide visibility.", benefits: "Title branding, booth, live connectivity, VIP.", justification: "Highest-reach annual sports sponsorship.", duration: "1 day",
    deliverables: [], payment: { invoiceStatus: "N/A", prStatus: "Not Started", poStatus: "Not Started", paymentStatus: "N/A", paymentDueDate: null, financeFollowUpDate: null },
    connectivity: null, monthlyReportDone: false, notes: "", taskProgress: {},
  },
];

/* ============================== FOLLOW-UP ENGINE ============================== */
const DEFAULT_THRESHOLDS = {
  approvalWarnDays: 3, approvalUrgentDays: 4, approvalCriticalDays: 6,
  connectivityWindowDays: 7, connectivityCriticalDays: 2,
  eventApprovalWindowDays: 5, monthlyReportStaleDays: 20, intakeStallDays: 3,
};
let THRESHOLDS = { ...DEFAULT_THRESHOLDS };

function generateFollowUps(sp) {
  const T = THRESHOLDS;
  const items = [];
  const daysInStage = daysBetween(TODAY, sp.stageEnteredDate);
  const daysToEvent = daysBetween(sp.eventDate, TODAY);
  const approvalStages = ["Pending Manager Review", "Pending CCO Review", "Memo Preparation", "Pending Finance Approval", "Pending CEO Approval", "Under Review"];
  const APPROVAL_OWNER = {
    "Pending Manager Review": "Manager", "Pending CCO Review": "Chief Commercial Officer",
    "Memo Preparation": "You", "Pending Finance Approval": "Financial Control", "Pending CEO Approval": "CEO", "Under Review": "You",
  };

  if (approvalStages.includes(sp.stage) && daysInStage >= T.approvalWarnDays) {
    items.push({
      text: `${sp.stage.includes("Memo") ? "Memo" : "Request"} pending at "${sp.stage}" for ${daysInStage} days.`,
      level: daysInStage >= T.approvalCriticalDays ? 4 : daysInStage >= T.approvalUrgentDays ? 3 : 2, category: "Approval",
      owner: APPROVAL_OWNER[sp.stage] || "You", sortDate: sp.stageEnteredDate,
    });
  }
  if (sp.payment && ["Execution", "Completed"].includes(sp.stage) && sp.payment.paymentStatus === "Pending") {
    const overdue = sp.payment.paymentDueDate ? daysBetween(TODAY, sp.payment.paymentDueDate) : 0;
    items.push({
      text: `Finance payment still pending${overdue > 0 ? ` (${overdue} days past due)` : ""}.`,
      level: overdue > 0 ? 4 : 2, category: "Payment", owner: "Finance", sortDate: sp.payment.paymentDueDate || TODAY,
    });
  }
  if (sp.connectivity && sp.connectivity.setupStatus && sp.connectivity.setupStatus !== "Completed" && daysToEvent >= 0) {
    if (daysToEvent <= T.connectivityWindowDays) {
      items.push({
        text: `Technical setup due in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"}.`,
        level: daysToEvent <= T.connectivityCriticalDays ? 4 : 3, category: "Connectivity", owner: "Technical Team", sortDate: sp.connectivity.setupDate,
      });
    }
  }
  if (sp.connectivity && sp.connectivity.deviceReturnStatus === "Pending Return" && sp.connectivity.deviceReturnDate) {
    const overdue = daysBetween(TODAY, sp.connectivity.deviceReturnDate);
    if (overdue >= 0) items.push({
      text: `Temporary device should be returned (${overdue} day${overdue === 1 ? "" : "s"} overdue).`,
      level: 4, category: "Device", owner: "You", sortDate: sp.connectivity.deviceReturnDate,
    });
  }
  if (sp.deliverables && sp.deliverables.length) {
    const overdueItems = sp.deliverables.filter(x => x.status !== "Done" && daysBetween(TODAY, x.dueDate) < 0);
    if (overdueItems.length > 0 && !["Rejected", "Archived"].includes(sp.stage)) {
      items.push({
        text: `${overdueItems.length} deliverable${overdueItems.length === 1 ? "" : "s"} past due date (${overdueItems.map(x => x.name).join(", ")}).`,
        level: 4, category: "Deliverables", owner: "You", sortDate: overdueItems.sort((a, b) => a.dueDate - b.dueDate)[0].dueDate,
      });
    }
  }
  if (daysToEvent >= 0 && daysToEvent <= T.eventApprovalWindowDays && !["Approved", "Execution", "Completed", "Archived", "Rejected"].includes(sp.stage)) {
    items.push({
      text: `Event starts in ${daysToEvent} day${daysToEvent === 1 ? "" : "s"} — sponsorship not yet approved.`,
      level: 4, category: "Deadline", owner: "You", sortDate: sp.eventDate,
    });
  }
  if (sp.stage === "Completed" && !sp.monthlyReportDone) {
    items.push({
      text: `Monthly report not completed.`, level: daysBetween(TODAY, sp.stageEnteredDate) > T.monthlyReportStaleDays ? 3 : 2,
      category: "Reporting", owner: "You", sortDate: sp.stageEnteredDate,
    });
  }
  if (sp.stage === "Information Required") {
    items.push({
      text: `Organizer has not submitted required information (${daysInStage} day${daysInStage === 1 ? "" : "s"} since flagged).`,
      level: daysInStage >= T.intakeStallDays ? 3 : 1, category: "Intake", owner: "Organizer", sortDate: sp.stageEnteredDate,
    });
  }
  return items.map(it => ({
    ...it, sponsorshipId: sp.id, requestId: sp.requestId, eventName: sp.eventName,
    key: `${sp.id}::${it.category}`,
  }));
}

function computeHealth(sp) {
  if (["Archived"].includes(sp.stage)) return { status: "archived", label: "Archived", cls: "neutral" };
  if (["Rejected"].includes(sp.stage)) return { status: "rejected", label: "Rejected", cls: "crit" };
  const fu = generateFollowUps(sp);
  const top = fu.reduce((m, f) => Math.max(m, f.level), 0);
  if (top >= 4) return { status: "critical", label: "Critical", cls: "crit" };
  if (top === 3) return { status: "at-risk", label: "At Risk", cls: "warn" };
  if (top === 2) return { status: "watch", label: "Watch", cls: "warn" };
  if (sp.stage === "Completed" && sp.monthlyReportDone) return { status: "healthy", label: "Healthy", cls: "ok" };
  return { status: "healthy", label: "On Track", cls: "ok" };
}

/* ============================== SMALL HELPERS ============================== */
function stageBadgeClass(stage) {
  if (["Approved"].includes(stage)) return "ok";
  if (["Execution"].includes(stage)) return "info";
  if (["Completed"].includes(stage)) return "ok";
  if (["Rejected"].includes(stage)) return "crit";
  if (["Archived"].includes(stage)) return "neutral";
  if (["Information Required"].includes(stage)) return "warn";
  return "warn";
}
function fmtDate(dt) {
  if (!dt) return "—";
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtMVR(n) {
  if (n == null) return "—";
  return "MVR " + n.toLocaleString("en-US");
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
  const [dismissed, setDismissed] = useState({}); // key -> true
  const [showAcked, setShowAcked] = useState(false);
  const [feedExpanded, setFeedExpanded] = useState(false);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Load persisted acknowledge state + threshold settings on mount
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

  // Keep the module-level engine config in sync every render (cheap plain assignment)
  THRESHOLDS = thresholds;

  // Persist acknowledged state whenever it changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("sot:acknowledged", JSON.stringify(dismissed));
      setSaveError(false);
    } catch (e) { setSaveError(true); }
  }, [dismissed, loaded]);

  // Persist threshold settings whenever they change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("sot:thresholds", JSON.stringify(thresholds)); } catch (e) { /* best effort */ }
  }, [thresholds, loaded]);

  const allFollowUpsRaw = useMemo(() => {
    const arr = sponsorships.flatMap(generateFollowUps);
    return arr.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return daysBetween(a.sortDate, TODAY) - daysBetween(b.sortDate, TODAY);
    });
  }, [sponsorships, thresholds]);

  const allFollowUps = allFollowUpsRaw.filter(f => !dismissed[f.key]);
  const ackedFollowUps = allFollowUpsRaw.filter(f => dismissed[f.key]);

  function acknowledge(key) { setDismissed(prev => ({ ...prev, [key]: true })); }
  function unacknowledge(key) { setDismissed(prev => { const n = { ...prev }; delete n[key]; return n; }); }

  const selected = sponsorships.find(s => s.id === selectedId) || null;

  const pendingApprovals = sponsorships.filter(s =>
    ["Pending Manager Review", "Pending CCO Review", "Pending Finance Approval", "Pending CEO Approval"].includes(s.stage));
  const upcomingEvents = sponsorships
    .filter(s => daysBetween(s.eventDate, TODAY) >= 0 && daysBetween(s.eventDate, TODAY) <= 21)
    .sort((a, b) => a.eventDate - b.eventDate);
  const pendingPayments = sponsorships.filter(s => s.payment && s.payment.paymentStatus === "Pending");
  const financeFollowUps = sponsorships.filter(s => s.payment && s.payment.financeFollowUpDate && daysBetween(TODAY, s.payment.financeFollowUpDate) >= 0 && s.payment.paymentStatus === "Pending");
  const connectivityPending = sponsorships.filter(s => s.connectivity && s.connectivity.setupStatus && s.connectivity.setupStatus !== "Completed");
  const deviceReturns = sponsorships.filter(s => s.connectivity && s.connectivity.deviceReturnStatus === "Pending Return");
  const overdueCount = allFollowUps.filter(f => f.level === 4).length;
  const recentRequests = [...sponsorships].sort((a, b) => b.receivedDate - a.receivedDate).slice(0, 5);
  const recentApprovals = sponsorships.filter(s => ["Approved", "Execution", "Completed"].includes(s.stage)).sort((a, b) => b.stageEnteredDate - a.stageEnteredDate).slice(0, 5);
  const sponsorsRequiringAction = ORGS.filter(o => sponsorships.some(s => s.sponsorOrgId === o.id && generateFollowUps(s).some(f => f.level >= 3)));

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sponsorships.filter(s =>
      s.eventName.toLowerCase().includes(q) || s.organizer.toLowerCase().includes(q) ||
      s.requestId.toLowerCase().includes(q) || s.memoNumber.toLowerCase().includes(q) ||
      s.stage.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, sponsorships]);

  function openDetail(id) { setSelectedId(id); setDetailTab("overview"); }
  function closeDetail() { setSelectedId(null); }

  function cycleDeliverable(spId, dlId) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      return {
        ...s,
        deliverables: s.deliverables.map(dl => {
          if (dl.id !== dlId) return dl;
          const next = dl.status === "Pending" ? "In Progress" : dl.status === "In Progress" ? "Done" : "Pending";
          return { ...dl, status: next };
        }),
      };
    }));
  }
  function toggleTask(spId, task) {
    setSponsorships(prev => prev.map(s => {
      if (s.id !== spId) return s;
      const tp = { ...s.taskProgress, [task]: !s.taskProgress[task] };
      return { ...s, taskProgress: tp };
    }));
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

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Signal size={14} color="#fff" /></div>
          <div>
            <div className="brand-title disp">Sponsorship Ops</div>
            <div className="brand-sub">Command Center</div>
          </div>
        </div>
        {NAV.map(n => (
          <button key={n.key} className={`navitem ${view === n.key ? "active" : ""}`} onClick={() => setView(n.key)}>
            <n.icon size={15} />
            {n.label}
            {n.count ? <span className="nav-count">{n.count}</span> : null}
          </button>
        ))}
        <div className="sidebar-foot">
          {sponsorships.length} active sponsorships tracked · Today, {fmtDate(TODAY)}
        </div>
      </div>

      {/* MAIN */}
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
              {view === "dashboard" && `${overdueCount} critical item${overdueCount === 1 ? "" : "s"} · ${pendingApprovals.length} pending approvals`}
              {view === "pipeline" && `${filteredPipeline.length} of ${sponsorships.length} requests`}
              {view === "sponsors" && `${sponsorships.length} sponsorship profiles on file`}
              {view === "calendar" && `${upcomingEvents.length} events in the next 21 days`}
            </div>
          </div>
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search organizer, event, memo, request ID…"
              value={query} onChange={e => setQuery(e.target.value)} />
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
          <button className="close-btn" title="Follow-up rules" onClick={() => setSettingsOpen(true)}><SettingsIcon size={14} /></button>
        </div>

        <div className="content">
          {view === "dashboard" && (
            <DashboardView
              overdueCount={overdueCount} pendingApprovals={pendingApprovals} upcomingEvents={upcomingEvents}
              pendingPayments={pendingPayments} financeFollowUps={financeFollowUps} connectivityPending={connectivityPending}
              deviceReturns={deviceReturns} allFollowUps={allFollowUps} ackedFollowUps={ackedFollowUps}
              recentRequests={recentRequests} recentApprovals={recentApprovals} sponsorsRequiringAction={sponsorsRequiringAction}
              openDetail={openDetail} sponsorships={sponsorships} acknowledge={acknowledge} unacknowledge={unacknowledge}
              showAcked={showAcked} setShowAcked={setShowAcked} feedExpanded={feedExpanded} setFeedExpanded={setFeedExpanded}
            />
          )}
          {view === "pipeline" && (
            <PipelineView sponsorships={filteredPipeline} stageFilter={stageFilter} setStageFilter={setStageFilter} openDetail={openDetail} />
          )}
          {view === "sponsors" && <SponsorshipProfilesView sponsorships={sponsorships} openDetail={openDetail} />}
          {view === "calendar" && <CalendarView sponsorships={sponsorships} openDetail={openDetail} />}
        </div>
      </div>

      {selected && (
        <div className="overlay" onClick={closeDetail}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            <DetailPanel sp={selected} tab={detailTab} setTab={setDetailTab} close={closeDetail}
              cycleDeliverable={cycleDeliverable} toggleTask={toggleTask} advanceStage={advanceStage} />
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

/* Need a small Signal icon fallback since lucide's "Signal" may differ by version */
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
  const { overdueCount, pendingApprovals, upcomingEvents, pendingPayments, financeFollowUps,
    connectivityPending, deviceReturns, allFollowUps, ackedFollowUps, recentRequests, recentApprovals,
    sponsorsRequiringAction, openDetail, sponsorships, acknowledge, unacknowledge,
    showAcked, setShowAcked, feedExpanded, setFeedExpanded } = props;

  const health = sponsorships
    .filter(s => !["Archived", "Rejected"].includes(s.stage))
    .map(s => ({ sp: s, h: computeHealth(s) }));
  const critCount = health.filter(x => x.h.status === "critical").length;
  const riskCount = health.filter(x => x.h.status === "at-risk" || x.h.status === "watch").length;
  const healthyCount = health.filter(x => x.h.status === "healthy").length;

  const visibleFeed = feedExpanded ? allFollowUps : allFollowUps.slice(0, 6);

  return (
    <>
      <div className="grid stat-row">
        <StatCard label="Pending Approvals" num={pendingApprovals.length} icon={<ListChecks size={14} />} color="warn" />
        <StatCard label="Events (Next 21 Days)" num={upcomingEvents.length} icon={<CalendarIcon size={14} />} color="info" />
        <StatCard label="Pending Payments" num={pendingPayments.length} icon={<CreditCard size={14} />} color="warn" />
        <StatCard label="Critical Items" num={overdueCount} icon={<AlertTriangle size={14} />} color="crit" hot={overdueCount > 0} />
      </div>

      {/* Project Health Rollup — one computed status per sponsorship instead of reading 4 badges */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><TrendingUp size={13} /> Project Health</div>
          <div className="panel-title-count">{critCount} critical · {riskCount} at risk · {healthyCount} on track</div>
        </div>
        <div className="panel-body">
          {health
            .sort((a, b) => { const order = { critical: 0, "at-risk": 1, watch: 2, healthy: 3 }; return order[a.h.status] - order[b.h.status]; })
            .map(({ sp, h }) => {
              const daysToEvent = daysBetween(sp.eventDate, TODAY);
              return (
                <div className="row" key={sp.id} onClick={() => openDetail(sp.id)}>
                  <div className={`dot`} style={{ color: h.cls === "crit" ? "var(--signal-crit)" : h.cls === "warn" ? "var(--signal-warn)" : "var(--signal-ok)", width: 7, height: 7, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="row-title">{sp.eventName}</div>
                    <div className="row-sub">{sp.stage} · {daysToEvent >= 0 ? `event in ${daysToEvent}d` : "event passed"}</div>
                  </div>
                  <span className={`badge ${h.cls}`}>{h.label}</span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Attention Feed — signature element, now acknowledgeable and owner-aware */}
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div className="panel-title"><Bell size={13} /> Attention Feed</div>
          <div className="panel-title-count">{allFollowUps.length} open{ackedFollowUps.length > 0 ? ` · ${ackedFollowUps.length} acknowledged` : ""}</div>
        </div>
        <div className="panel-body">
          {allFollowUps.length === 0 && <div className="panel-empty">Nothing needs attention right now.</div>}
          {visibleFeed.map((f, i) => (
            <div className="attn-item" key={f.key + i}>
              <div onClick={() => openDetail(f.sponsorshipId)} style={{ display: "flex", gap: 10, flex: 1, cursor: "pointer" }}>
                <SignalBars level={f.level} />
                <div>
                  <div className="attn-text">{f.text}</div>
                  <div className="attn-meta">{f.requestId} · {f.eventName} · <span style={{ color: "var(--text-dim)" }}>owner: {f.owner}</span></div>
                </div>
              </div>
              <button className="btn ghost" style={{ padding: "5px 9px", fontSize: 11, flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); acknowledge(f.key); }}>
                <CheckCircle2 size={12} /> Ack
              </button>
            </div>
          ))}
          {allFollowUps.length > 6 && (
            <div style={{ textAlign: "center", padding: "8px 0 2px 0" }}>
              <button className="btn ghost" onClick={() => setFeedExpanded(!feedExpanded)}>
                {feedExpanded ? "Show less" : `Show ${allFollowUps.length - 6} more`}
              </button>
            </div>
          )}
          {ackedFollowUps.length > 0 && (
            <div style={{ textAlign: "center", padding: "6px 0 2px 0" }}>
              <button className="btn ghost" style={{ fontSize: 11, color: "var(--text-faint)" }} onClick={() => setShowAcked(!showAcked)}>
                {showAcked ? "Hide" : "Show"} {ackedFollowUps.length} acknowledged item{ackedFollowUps.length === 1 ? "" : "s"}
              </button>
            </div>
          )}
          {showAcked && ackedFollowUps.map((f, i) => (
            <div className="attn-item" key={"ack-" + f.key + i} style={{ opacity: 0.5 }}>
              <div onClick={() => openDetail(f.sponsorshipId)} style={{ display: "flex", gap: 10, flex: 1, cursor: "pointer" }}>
                <SignalBars level={f.level} />
                <div>
                  <div className="attn-text">{f.text}</div>
                  <div className="attn-meta">{f.requestId} · {f.eventName}</div>
                </div>
              </div>
              <button className="btn ghost" style={{ padding: "5px 9px", fontSize: 11, flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); unacknowledge(f.key); }}>
                Unack
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid two-col">
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><CalendarIcon size={13} /> Upcoming Events</div></div>
          <div className="panel-body">
            {upcomingEvents.length === 0 && <div className="panel-empty">No events in the next 21 days.</div>}
            {upcomingEvents.map(s => (
              <div className="row" key={s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}>
                  <div className="row-title">{s.eventName}</div>
                  <div className="row-sub">{fmtDate(s.eventDate)} · {s.region}</div>
                </div>
                <span className={`badge ${daysBetween(s.eventDate, TODAY) <= 5 ? "crit" : "info"}`}>{daysBetween(s.eventDate, TODAY)}d</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><Wifi size={13} /> Connectivity &amp; Device Returns</div></div>
          <div className="panel-body">
            {connectivityPending.length === 0 && deviceReturns.length === 0 && <div className="panel-empty">No pending technical items.</div>}
            {connectivityPending.map(s => (
              <div className="row" key={"c-" + s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}>
                  <div className="row-title">{s.connectivity.type}</div>
                  <div className="row-sub">{s.eventName} · setup {fmtDate(s.connectivity.setupDate)}</div>
                </div>
                <span className="badge warn">Setup Pending</span>
              </div>
            ))}
            {deviceReturns.map(s => (
              <div className="row" key={"r-" + s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}>
                  <div className="row-title">Device return — {s.eventName}</div>
                  <div className="row-sub">Due {fmtDate(s.connectivity.deviceReturnDate)}</div>
                </div>
                <span className="badge crit">Overdue</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid two-col">
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><CreditCard size={13} /> Payments &amp; Finance Follow-ups</div></div>
          <div className="panel-body">
            {pendingPayments.length === 0 && <div className="panel-empty">No pending payments.</div>}
            {pendingPayments.map(s => (
              <div className="row" key={s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}>
                  <div className="row-title">{s.eventName}</div>
                  <div className="row-sub">PR: {s.payment.prStatus} · PO: {s.payment.poStatus}</div>
                </div>
                <div className="row-amt mono">{fmtMVR(s.sponsorAmount)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div className="panel-title"><FileText size={13} /> Recent Requests</div></div>
          <div className="panel-body">
            {recentRequests.map(s => (
              <div className="row" key={s.id} onClick={() => openDetail(s.id)}>
                <div style={{ flex: 1 }}>
                  <div className="row-title">{s.eventName}</div>
                  <div className="row-sub">{s.requestId} · received {fmtDate(s.receivedDate)}</div>
                </div>
                <span className={`badge ${stageBadgeClass(s.stage)}`}>{s.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><div className="panel-title"><Users size={13} /> Sponsors Requiring Action</div></div>
        <div className="panel-body">
          {sponsorsRequiringAction.length === 0 && <div className="panel-empty">No sponsors flagged.</div>}
          {sponsorsRequiringAction.map(o => (
            <div className="row" key={o.id} style={{ cursor: "default" }}>
              <div style={{ flex: 1 }}>
                <div className="row-title">{o.name}</div>
                <div className="row-sub">{o.category}</div>
              </div>
              <span className="badge warn">Follow up</span>
            </div>
          ))}
          {recentApprovals.length > 0 && (
            <>
              <div className="section-label" style={{ margin: "12px 8px 4px 8px" }}>Recent Approvals</div>
              {recentApprovals.map(s => (
                <div className="row" key={"ap-" + s.id} onClick={() => openDetail(s.id)}>
                  <div style={{ flex: 1 }}>
                    <div className="row-title">{s.eventName}</div>
                    <div className="row-sub">Moved to {s.stage} on {fmtDate(s.stageEnteredDate)}</div>
                  </div>
                  <CheckCircle2 size={14} color="var(--signal-ok)" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const THRESHOLD_FIELDS = [
  { key: "approvalWarnDays", label: "Flag an approval as stalled after (days)", group: "Approvals" },
  { key: "approvalUrgentDays", label: "Escalate to Urgent after (days)", group: "Approvals" },
  { key: "approvalCriticalDays", label: "Escalate to Critical after (days)", group: "Approvals" },
  { key: "connectivityWindowDays", label: "Start warning about setup this many days before the event", group: "Connectivity" },
  { key: "connectivityCriticalDays", label: "Escalate setup warning to Critical inside (days)", group: "Connectivity" },
  { key: "eventApprovalWindowDays", label: "Flag unapproved requests once event is within (days)", group: "Deadlines" },
  { key: "monthlyReportStaleDays", label: "Escalate an unfiled monthly report after (days)", group: "Reporting" },
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
        <div className="row-sub" style={{ marginTop: 3 }}>
          Controls when the Attention Feed escalates an item. Changes apply immediately and save automatically{saveError ? " — save failed, changes are for this session only." : "."}
        </div>
      </div>
      <div className="detail-body">
        {groups.map(g => (
          <div key={g} style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ margin: "0 0 8px 0" }}>{g}</div>
            {THRESHOLD_FIELDS.filter(f => f.group === g).map(f => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1, fontSize: 12.5, color: "var(--text-dim)" }}>{f.label}</div>
                <input
                  type="number" min={0}
                  value={thresholds[f.key]}
                  onChange={e => {
                    const v = Math.max(0, parseInt(e.target.value || "0", 10));
                    setThresholds(prev => ({ ...prev, [f.key]: v }));
                  }}
                  style={{
                    width: 56, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 7,
                    color: "var(--text)", fontSize: 12.5, padding: "6px 8px", textAlign: "center",
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        <button className="btn" onClick={() => setThresholds(DEFAULT_THRESHOLDS)}>Reset to defaults</button>
      </div>
    </>
  );
}

function StatCard({ label, num, icon, color, hot }) {
  const colorMap = { warn: "var(--signal-warn)", info: "var(--signal-info)", crit: "var(--signal-crit)", ok: "var(--signal-ok)" };
  const softMap = { warn: "var(--signal-warn-soft)", info: "var(--signal-info-soft)", crit: "var(--signal-crit-soft)", ok: "var(--signal-ok-soft)" };
  return (
    <div className={`stat-card ${hot ? "hot" : ""}`}>
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        <div className="stat-icon" style={{ background: softMap[color], color: colorMap[color] }}>{icon}</div>
      </div>
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
        {filters.map(f => (
          <div key={f} className={`filter-chip ${stageFilter === f ? "active" : ""}`} onClick={() => setStageFilter(f)}>{f}</div>
        ))}
      </div>
      <div className="table-wrap">
        <div className="t-row t-head">
          <div></div><div>Request ID</div><div>Event</div><div>Organizer</div><div>Amount</div><div>Event Date</div><div>Stage</div>
        </div>
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
              <div className="mono" style={{ fontSize: 12 }}>{fmtMVR(s.sponsorAmount)}</div>
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
              {s.payment && s.payment.paymentStatus !== "N/A" && (
                <span className={`badge ${s.payment.paymentStatus === "Paid" ? "ok" : "warn"}`}>Payment: {s.payment.paymentStatus}</span>
              )}
              {s.connectivity && <span className="badge neutral">Connectivity</span>}
            </div>

            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div className="org-stat"><div className="num mono">{fmtMVR(s.sponsorAmount)}</div><div className="lbl">Sponsor Amount</div></div>
              <div className="org-stat">
                <div className="num">{daysToEvent >= 0 ? `${daysToEvent}d` : "Past"}</div>
                <div className="lbl">{daysToEvent >= 0 ? "To Event" : "Event Date"}</div>
              </div>
            </div>

            {total > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-faint)", marginBottom: 4 }}>
                  <span>Deliverables</span><span>{done}/{total}</span>
                </div>
                <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "var(--signal-ok)" : "var(--brand)" }} />
                </div>
              </div>
            )}

            {followUps.length > 0 ? (
              <div className="row-sub" style={{ lineHeight: 1.5 }}>{followUps[0].text} <span style={{ color: "var(--text-faint)" }}>(owner: {followUps[0].owner})</span>{followUps.length > 1 ? ` +${followUps.length - 1} more` : ""}</div>
            ) : (
              <div className="row-sub">No open follow-ups.</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== CALENDAR (agenda view) ============================== */
function CalendarView({ sponsorships, openDetail }) {
  const events = [];
  sponsorships.forEach(s => {
    events.push({ date: s.eventDate, type: "Event", label: s.eventName, sub: s.region, sp: s });
    if (s.payment && s.payment.paymentDueDate) events.push({ date: s.payment.paymentDueDate, type: "Payment", label: `Payment due — ${s.eventName}`, sub: fmtMVR(s.sponsorAmount), sp: s });
    if (s.connectivity && s.connectivity.setupDate) events.push({ date: s.connectivity.setupDate, type: "Connectivity", label: `Technical setup — ${s.eventName}`, sub: s.connectivity.type, sp: s });
    if (s.connectivity && s.connectivity.deviceReturnDate) events.push({ date: s.connectivity.deviceReturnDate, type: "Device Return", label: `Device return — ${s.eventName}`, sub: s.connectivity.type, sp: s });
  });
  const upcoming = events.filter(e => daysBetween(e.date, TODAY) >= -3).sort((a, b) => a.date - b.date);
  const grouped = [];
  upcoming.forEach(e => {
    const key = e.date.toDateString();
    let g = grouped.find(x => x.key === key);
    if (!g) { g = { key, date: e.date, items: [] }; grouped.push(g); }
    g.items.push(e);
  });
  const typeColor = { Event: "info", Payment: "warn", Connectivity: "neutral", "Device Return": "crit" };

  return (
    <div className="panel">
      <div className="panel-head"><div className="panel-title"><CalendarIcon size={13} /> Agenda</div></div>
      <div className="panel-body pad">
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
                    <span className={`badge ${typeColor[it.type]}`}>{it.type}</span>
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
  );
}

/* ============================== DETAIL PANEL ============================== */
function DetailPanel({ sp, tab, setTab, close, cycleDeliverable, toggleTask, advanceStage }) {
  const followUps = generateFollowUps(sp);
  const tasks = STAGE_TASKS[sp.stage] || [];
  const stageIdx = STAGES.indexOf(sp.stage);

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
        <div className="disp" style={{ fontSize: 18, fontWeight: 700 }}>{sp.eventName}</div>
        <div className="row-sub" style={{ marginTop: 3 }}><Building2 size={11} style={{ verticalAlign: -2, marginRight: 4 }} />{sp.organizer}</div>

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

        {STAGES.includes(sp.stage) && (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" onClick={() => advanceStage(sp.id, -1)} disabled={stageIdx === 0}>← Move back</button>
            <button className="btn" onClick={() => advanceStage(sp.id, 1)} disabled={stageIdx === STAGES.length - 1}>Advance stage →</button>
          </div>
        )}

        <div className="tabs">
          {["overview", "deliverables", "payment", "connectivity", "tasks"].map(t => (
            (t !== "connectivity" || sp.connectivity) && (
              <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            )
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
                  {followUps.map((f, i) => {
                    const b = levelBadge(f.level);
                    return (
                      <div className="attn-item" key={i} style={{ cursor: "default" }}>
                        <SignalBars level={f.level} />
                        <div>
                          <div className="attn-text">{f.text}</div>
                          <div className="attn-meta">{f.category} · owner: {f.owner}</div>
                        </div>
                        <span className={`badge ${b.cls}`} style={{ marginLeft: "auto" }}>{b.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="kv-grid">
              <div><div className="kv-label">Region</div><div className="kv-val"><MapPin size={11} style={{ verticalAlign: -1, marginRight: 3 }} />{sp.region}</div></div>
              <div><div className="kv-label">Event Type</div><div className="kv-val">{sp.eventType}</div></div>
              <div><div className="kv-label">Sponsor Amount</div><div className="kv-val mono">{fmtMVR(sp.sponsorAmount)}</div></div>
              <div><div className="kv-label">Sponsorship Type</div><div className="kv-val">{sp.sponsorshipType}</div></div>
              <div><div className="kv-label">Request Received</div><div className="kv-val">{fmtDate(sp.receivedDate)}</div></div>
              <div><div className="kv-label">Event Date</div><div className="kv-val">{fmtDate(sp.eventDate)}</div></div>
              <div><div className="kv-label">Budget Code</div><div className="kv-val mono">{sp.budgetCode || "—"}</div></div>
              <div><div className="kv-label">Duration</div><div className="kv-val">{sp.duration || "—"}</div></div>
            </div>

            {sp.background && (<><div className="section-label">Background</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.background}</div></>)}
            {sp.benefits && (<><div className="section-label">Benefits</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.benefits}</div></>)}
            {sp.justification && (<><div className="section-label">Justification</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.justification}</div></>)}
            {sp.notes && (<><div className="section-label">Notes</div><div style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>{sp.notes}</div></>)}
          </>
        )}

        {tab === "deliverables" && (
          <>
            <div className="section-label">Deliverable Checklist</div>
            {sp.deliverables.length === 0 && <div className="panel-empty">No deliverables defined yet.</div>}
            {sp.deliverables.map(dl => {
              const overdue = dl.status !== "Done" && daysBetween(TODAY, dl.dueDate) < 0;
              return (
                <div className="check-row" key={dl.id} style={overdue ? { background: "var(--signal-crit-soft)", borderRadius: 8 } : undefined}>
                  <div className={`check-box ${dl.status === "Done" ? "done" : dl.status === "In Progress" ? "progress" : ""}`} onClick={() => cycleDeliverable(sp.id, dl.id)}>
                    {dl.status === "Done" && <CheckCircle2 size={11} color="#0d1a14" />}
                    {dl.status === "In Progress" && <Circle size={7} color="var(--signal-warn)" fill="var(--signal-warn)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={`check-label ${dl.status === "Done" ? "done" : ""}`}>{dl.name}</div>
                    <div className="check-meta">Owner: {dl.owner} · Due {fmtDate(dl.dueDate)} {dl.evidence && `· Evidence: ${dl.evidence}`}{dl.notes && ` · ${dl.notes}`}</div>
                  </div>
                  <span className={`badge ${overdue ? "crit" : dl.status === "Done" ? "ok" : dl.status === "In Progress" ? "warn" : "neutral"}`}>{overdue ? "Overdue" : dl.status}</span>
                </div>
              );
            })}
          </>
        )}

        {tab === "payment" && sp.payment && (
          <>
            <div className="section-label">Payment Tracker</div>
            <div className="kv-grid">
              <div><div className="kv-label">Sponsor Amount</div><div className="kv-val mono">{fmtMVR(sp.sponsorAmount)}</div></div>
              <div><div className="kv-label">Invoice Status</div><div className="kv-val">{sp.payment.invoiceStatus}</div></div>
              <div><div className="kv-label">PR Status</div><div className="kv-val">{sp.payment.prStatus}</div></div>
              <div><div className="kv-label">PO Status</div><div className="kv-val">{sp.payment.poStatus}</div></div>
              <div><div className="kv-label">Payment Status</div><div className="kv-val"><span className={`badge ${sp.payment.paymentStatus === "Paid" ? "ok" : sp.payment.paymentStatus === "Pending" ? "warn" : "neutral"}`}>{sp.payment.paymentStatus}</span></div></div>
              <div><div className="kv-label">Payment Due</div><div className="kv-val">{fmtDate(sp.payment.paymentDueDate)}</div></div>
              <div><div className="kv-label">Finance Follow-up</div><div className="kv-val">{fmtDate(sp.payment.financeFollowUpDate)}</div></div>
            </div>
          </>
        )}

        {tab === "connectivity" && sp.connectivity && (
          <>
            <div className="section-label">Connectivity &amp; Device Module</div>
            <div className="kv-grid">
              <div><div className="kv-label">Type</div><div className="kv-val">{sp.connectivity.type}</div></div>
              <div><div className="kv-label">Technical Team</div><div className="kv-val">{sp.connectivity.technicalTeam}</div></div>
              <div><div className="kv-label">Setup Date</div><div className="kv-val">{fmtDate(sp.connectivity.setupDate)}</div></div>
              <div><div className="kv-label">Setup Status</div><div className="kv-val"><span className={`badge ${sp.connectivity.setupStatus === "Completed" ? "ok" : "warn"}`}>{sp.connectivity.setupStatus}</span></div></div>
              {sp.connectivity.deviceReturnDate && (
                <>
                  <div><div className="kv-label">Device Return Date</div><div className="kv-val">{fmtDate(sp.connectivity.deviceReturnDate)}</div></div>
                  <div><div className="kv-label">Return Status</div><div className="kv-val"><span className={`badge ${sp.connectivity.deviceReturnStatus === "Pending Return" ? "crit" : "ok"}`}>{sp.connectivity.deviceReturnStatus}</span></div></div>
                </>
              )}
            </div>
          </>
        )}

        {tab === "tasks" && (
          <>
            <div className="section-label">Suggested Tasks — "{sp.stage}"</div>
            {tasks.length === 0 && <div className="panel-empty">No suggested tasks for this stage.</div>}
            {tasks.map((t, i) => (
              <div key={i} className={`task-chip ${sp.taskProgress[t] ? "done" : ""}`} onClick={() => toggleTask(sp.id, t)}>
                <div className={`check-box ${sp.taskProgress[t] ? "done" : ""}`} style={{ width: 15, height: 15 }}>
                  {sp.taskProgress[t] && <CheckCircle2 size={10} color="#0d1a14" />}
                </div>
                <span className="idx mono">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
