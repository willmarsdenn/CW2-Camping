import { loadDotEnv } from "./deps.ts";

await loadDotEnv({ export: true });

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
export const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
export const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;
export const JWT_SECRET = Deno.env.get("JWT_SECRET")!;
export const GEOAPIFY_KEY = Deno.env.get("GEOAPIFY_KEY")!;
export const OWM_KEY = Deno.env.get("OWM_KEY")!;