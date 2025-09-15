import { express, z, type Request, type Response } from "../deps.ts";
import { publicAuthClient } from "../supabaseClient.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { NoParams } from "../types/http.ts";

const router = express.Router();
router.use(authMiddleware);

router.get(
    "/",
    async (req: Request, res: Response) => {
        const { data, error } = await publicAuthClient
            .from("favourites")
            .select("id,campsite_id,campsites(name,lat,lon)")
            .eq("user_id", req.user.id);
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
    }
);

router.post(
    "/:campsiteId",
    async (req: Request<{ campsiteId: string }>, res: Response) => {
        const { data, error } = await publicAuthClient
            .from("favourites")
            .insert({ user_id: req.user.id, campsite_id: req.params.campsiteId })
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
    }
);

router.delete(
    "/:campsiteId",
    async (req: Request<{ campsiteId: string }>, res: Response) => {
        const { error } = await publicAuthClient
            .from("favourites")
            .delete()
            .eq("user_id", req.user.id)
            .eq("campsite_id", req.params.campsiteId);
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json({ ok: true });
    }
);

const SubscribeSchema = z.object({
    campsite_id: z.string().uuid(),
    alert_type: z.string().default("weather"),
});
type SubscribeBody = z.infer<typeof SubscribeSchema>;

router.post(
    "/alerts/subscribe",
    async (req: Request<NoParams, unknown, SubscribeBody>, res: Response) => {
        const schema = z.object({
            campsite_id: z.string().uuid(),
            alert_type: z.string().default("weather"),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        };

        const { data, error } = await publicAuthClient
            .from("alerts")
            .insert({ ...parsed.data, user_id: req.user.id })
            .select()
            .single();
        if (error) {
            return res.status(400).json({ error: error.message });
        };
        res.json(data);
    }
);

export const favouritesRouter = router;
