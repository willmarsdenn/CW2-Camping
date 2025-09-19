import { express, type Request, type Response } from "../deps.ts";
import { adminSupabase } from "../supabaseClient.ts";

const router = express.Router();

router.delete("/cleanup-user", async (req: Request, res: Response) => {
    // Hard gate: only available in dev when explicitly enabled
    if (Deno.env.get("ALLOW_TEST_CLEANUP") !== "true") {
        return res.status(404).json({ error: "Not enabled" });
    };

    // Simple auth for the test hook
    if (req.header("x-test-secret") !== Deno.env.get("TEST_SECRET")) {
        return res.status(401).json({ error: "Unauthorized" });
    };

    const { user_id } = req.body ?? {};
    if (!user_id) {
        return res.status(400).json({ error: "user_id required" });
    };

    // this uses the admin key to delete the test users with admin privileges
    const { error } = await adminSupabase.auth.admin.deleteUser(user_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    };

    return res.status(204).send();
});

export const testCleanupRouter = router;