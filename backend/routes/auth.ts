import { Router, Context } from "../deps.ts";
import { supabase } from "../supabase/client.ts";

// `/auth/register` uses `auth.admin.createUser` (requires service role), `/auth/login` signs in and returns a session.
    // this is a risk as it bypasses email confirmation workflow
    // consider using `signup` (anon) for public registration
// to hide Supabase details and control the onboarding

const router = new Router({ prefix: "/auth" });

router.post("/register", async (ctx: Context) => {
    // Expecting JSON body with email/password.
    const { email, password } = await ctx.request.body({ type: "json" }).value;
    // `email_confirm: true` auto‑verifies — convenient for demos/tests; dangerous for production flows.
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) ctx.throw(400, error.message);
    ctx.response.body = data.user;
});


router.post("/login", async (ctx: Context) => {
    // Sign in with email/password. returns a session (access/refresh tokens)
    const { email, password } = await ctx.request.body({ type: "json" }).value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) ctx.throw(401, error.message);
    ctx.response.body = data.session;
});

export default router;