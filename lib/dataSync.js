import { supabase } from "./supabaseClient";

// JSONB has no native Date type, so anything read back from Supabase has Date fields as
// plain ISO strings. This walks the object tree and turns them back into real Date
// instances, so the rest of the app (which calls .getTime(), .toDateString(), etc. all
// over the place) doesn't need to know or care that the data passed through a database.
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
export function reviveDates(value) {
  if (Array.isArray(value)) return value.map(reviveDates);
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = reviveDates(value[k]);
    return out;
  }
  if (typeof value === "string" && ISO_DATE_RE.test(value)) return new Date(value);
  return value;
}

// Load every sponsorship. Returns [] if the table is empty (e.g. a brand new project) —
// the caller decides whether to bootstrap it with demo data.
export async function fetchSponsorships() {
  const { data, error } = await supabase.from("sponsorships").select("data").order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(row => reviveDates(row.data));
}

// Upsert a full snapshot of sponsorships. Dates serialize to ISO strings automatically
// (Date has a toJSON method) when supabase-js sends the request body as JSON, so no
// manual conversion is needed on the way out — only on the way back in.
export async function upsertSponsorships(sponsorships) {
  if (!sponsorships.length) return;
  const rows = sponsorships.map(sp => ({ id: sp.id, data: sp }));
  const { error } = await supabase.from("sponsorships").upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

export async function deleteSponsorshipRow(id) {
  const { error } = await supabase.from("sponsorships").delete().eq("id", id);
  if (error) throw error;
}

export async function bootstrapIfEmpty(seedSponsorships) {
  const { count, error } = await supabase.from("sponsorships").select("id", { count: "exact", head: true });
  if (error) throw error;
  if ((count || 0) === 0) {
    await upsertSponsorships(seedSponsorships);
    return true;
  }
  return false;
}

// Shared team settings (follow-up thresholds + annual budget) — one row, id = 'default'.
export async function fetchSettings() {
  const { data, error } = await supabase.from("app_settings").select("*").eq("id", "default").maybeSingle();
  if (error) throw error;
  if (!data) return { thresholds: null, annualBudget: 2500000 };
  return { thresholds: data.thresholds || null, annualBudget: Number(data.annual_budget) || 2500000 };
}

export async function saveSettings({ thresholds, annualBudget }) {
  const { error } = await supabase.from("app_settings").upsert(
    { id: "default", thresholds, annual_budget: annualBudget },
    { onConflict: "id" }
  );
  if (error) throw error;
}
