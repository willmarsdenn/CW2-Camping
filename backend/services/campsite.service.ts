import { supabase } from "../supabase/client.ts";

// these are thin wrappers over our Supabase queries
// makes it easier to unit test by mocking of services
export async function listCampsites() {
    return await supabase.from("campsites").select("*");
}

export async function createCampsite(data: {name: string; location: string; features?: string; user_id: string;}) {
    return await supabase.from("campsites").insert(data).select().single();
}

export async function updateCampsite(id: number, data: Record<string, unknown>) {
    return await supabase.from("campsites").update(data).eq("id", id).select().single();
}

export async function deleteCampsite(id: number) {
    return await supabase.from("campsites").delete().eq("id", id);
}