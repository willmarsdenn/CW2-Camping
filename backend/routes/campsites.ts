// Campsite CRUD routes with a minimal auth middleware.

// Notes / Risks:
// - This middleware verifies the token via Supabase but uses a global service‑role client for DB writes.
// Without RLS, DB authorization relies entirely on route logic.
// - `Number(ctx.params.id)` assumes numeric IDs; if DB uses UUIDs, this will break.

import { Router, Context, validate as is_uuid } from "../deps.ts";
import { listCampsites, createCampsite, updateCampsite, deleteCampsite } from "../services/campsite.service.ts";
import { supabase } from "../supabase/client.ts";

const router = new Router({ prefix: "/api/campsites" });

// simple auth middleware using Supabase's session
async function auth(ctx: Context, next: () => Promise<unknown>) {
    // Extracts bearer token from Authorization header.
    const token = ctx.request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
        ctx.throw(401, "No token");
    };

    // Validates token by asking Supabase for the associated user.
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        ctx.throw(401, "Invalid token");
    };

    // validation entity is produced and accessible by all route handlers at ctx.state.user
    ctx.state.user = data.user;
    await next();
};


// get the a list of all the campsite in the campsite-table
router.get("/", async (ctx) => {
    // Public listing endpoint; consider pagination and filters for real apps.
    const { data, error } = await listCampsites();

    if (error) {
        ctx.throw(500, error.message);
    };
    ctx.response.body = data;
});

// create a new data entry into campsite table,
// which is attributed to authenticated user
router.post("/", auth, async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    body.user_id = ctx.state.user.id;
    const { data, error } = await createCampsite(body);

    if (error) {
        ctx.throw(400, error.message);
    };
    ctx.response.body = data;
});

// update an existing campsite data point if it exists by ID
router.put("/:id", auth, async (ctx) => {
    const id = ctx.params.id ?? "";
    if(!is_uuid(id)) {
        ctx.throw(400, "Invalid campsite id");
    };

    const body = await ctx.request.body({ type: "json" }).value;
    const { data, error } = await updateCampsite(id, body);

    if (error) {
        ctx.throw(400, error.message);
    };
    ctx.response.body = data;
});

// delete an existing campsite from the database
router.delete("/:id", auth, async (ctx) => {
    const id = ctx.params.id ?? "";
    const { error } = await deleteCampsite(id);

    if (error) {
        ctx.throw(400, error.message);
    };
    ctx.response.status = 204;
});

export default router;
