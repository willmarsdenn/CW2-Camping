// local
import { createClient, SupabaseClient } from "../src/deps.ts";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../src/env.ts";

// client using the anon-key
export const publicAuthClient: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
);