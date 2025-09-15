import { express, type Request, type Response } from "../deps.ts";
import { publicAuthClient } from "../supabaseClient.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { getWeekendForecast } from "../services/weather/openWeather.ts";

const router = express.Router();
router.use(authMiddleware);

router.get(
    "/:campsiteId",
    async (req: Request<{ campsiteId: string }>, res: Response) => {
        const { data, error } = await publicAuthClient
            .from("campsites")
            .select("lat,lon")
            .eq("id", req.params.campsiteId)
            .eq("user_id", req.user.id)
            .single();

        if (error) {
            return res.status(404).json({ error: "Not found" });
        };
        const forecast = await getWeekendForecast(data.lat, data.lon);
        res.json(forecast);
});

export const weatherRouter = router;
