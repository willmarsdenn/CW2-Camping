import { express, z, type Request, type Response } from "../deps.ts";
import { publicAuthClient } from "../supabaseClient.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { searchCampsites } from "../services/places/geoapify.ts";
import { NoParams } from "../types/http.ts";

const router = express.Router();
router.use(authMiddleware);

// -- using zod schemas and inferred types --
const CampsiteSchema = z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    description: z.string().optional(),
});
type NewCampsite = z.infer<typeof CampsiteSchema>;
type UpdateCampsite = Partial<NewCampsite>;


// POST / – create a campsite data entry
router.post(
    "/",
    async (req: Request<NoParams, unknown, NewCampsite>, res: Response) => {
        const parsed = CampsiteSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        };

        const { data, error } = await publicAuthClient
            .from("campsites")
            .insert({ ...parsed.data, user_id: req.user.id })
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
    }
);

// GET / – list the session user’s campsites
router.get(
    "/",
    async (req: Request, res: Response) => {
        const { data, error } = await publicAuthClient
            .from("campsites")
            .select("*")
            .eq("user_id", req.user.id);
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
    }
);

// GET /search?q=... , based on a constructed query
router.get(
    "/search",
    async (req: Request<NoParams, unknown, unknown, { q?: string }>, res: Response) => {
        const q = req.query.q as string;
        const results = await searchCampsites(q);
        res.json(results);
});

// GET /:id – fetch one by the id
router.get(
    "/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        const { data, error } = await publicAuthClient
            .from("campsites")
            .select("*")
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .single();
        if (error) {
            return res.status(404).json({ error: "Not found" });
        };

        res.json(data);
});

// PUT /:id - update by id
router.put(
    "/:id",
    async (req: Request<{ id: string }, unknown, UpdateCampsite>, res: Response) => {
        const parsed = CampsiteSchema.partial().safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        };

        const { data, error } = await publicAuthClient
            .from("campsites")
            .update(parsed.data)
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
});

// DELETE /:id delete by id
router.delete(
    "/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        const { error } = await publicAuthClient
            .from("campsites")
            .delete()
            .eq("id", req.params.id)
            .eq("user_id", req.user.id);
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json({ ok: true });
});

export const campsitesRouter = router;
