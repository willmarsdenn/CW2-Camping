import { express, type Request, type Response } from "../deps.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { getWeekendForecast, isAccuWeatherError } from "../services/weather/openWeather.ts";
import { createSupabaseForRequest } from "../supabaseClient.ts";

const router = express.Router();
router.use(authMiddleware);

router.get(
    "/:campsiteId",
    async (req: Request<{ campsiteId: string }>, res: Response) => {
        try {
            const authz = req.headers.authorization; // "Bearer <supabase_jwt>"
            if (!authz) {
                return res.status(401).json({ error: "Missing token" });
            };

            const supabaseLoggedIn = createSupabaseForRequest(req);

            const { data, error } = await supabaseLoggedIn
                .from("campsites")
                .select("lat,lon")
                .eq("id", req.params.campsiteId)
                .single();

            if (error) {
                console.log(error)
                return res.status(404).json({ error: "Not found" });
            };
            const forecast = await getWeekendForecast(data.lat, data.lon);
            res.json(forecast);
        } catch (e) {
            console.error("weather GET failed:", e);
            if (isAccuWeatherError(e)) {
                return res.status(e.httpStatus).json({
                    error: e.message,
                    reason: e.reason,
                    ...(typeof e.upstreamStatus === "number"
                        ? { upstreamStatus: e.upstreamStatus }
                        : {}),
                });
            }
            else {
                return res.status(500).json({ error: "Internal server error" });
            }
        }
});

export const weatherRouter = router;
