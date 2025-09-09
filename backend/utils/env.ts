// local
import { load } from "../deps.ts";

const env = await load();

// loads config from .env, reexport said configs
// isolates environment concerns
export const SUPABASE_URL = env.SUPABASE_URL!;
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY!;
export const SUPABASE_SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE!;
export const OPENWEATHER_KEY = env.OPENWEATHER_KEY!;
