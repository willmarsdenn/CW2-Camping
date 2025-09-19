import { loadDotEnv } from "../deps.ts";

await loadDotEnv({ export: true });

function requireEnvVar(name: string): string {
    const value = Deno.env.get(name);
    if (!value) {
        throw new Error(
            `Missing required environment variable "${name}". ` +
            "Set it in your environment or .env file before starting the server.",
        );
    }
    return value;
}

export const SUPABASE_URL = requireEnvVar("SUPABASE_URL");
export const SUPABASE_ANON_KEY = requireEnvVar("SUPABASE_ANON_KEY");
export const SUPABASE_SERVICE_ROLE = requireEnvVar("SUPABASE_SERVICE_ROLE");
export const JWT_SECRET = requireEnvVar("JWT_SECRET");
export const GEOAPIFY_KEY = requireEnvVar("GEOAPIFY_KEY");
export const ACCUWEATHER_API_KEY = requireEnvVar("ACCUWEATHER_API_KEY");