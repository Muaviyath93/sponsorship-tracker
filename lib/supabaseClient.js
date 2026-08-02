import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaces a clear error in the browser console instead of a cryptic Supabase failure
  // if someone forgets to set up .env.local (see .env.local.example).
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "Copy .env.local.example to .env.local and fill in your Supabase project's URL and anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
