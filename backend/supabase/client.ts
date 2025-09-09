// local
import { createClient, SupabaseClient } from "../deps.ts";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE } from "../utils/env.ts";

// using the service_role key, this is the private one - need to change later
// for now it is okay as we are scaffolding 
export const supabase: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE,
);