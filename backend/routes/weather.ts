import { Router } from "../deps.ts";
import { OPENWEATHER_KEY } from "../utils/env.ts";

const router = new Router({ prefix: "/api" });

router.get("/weather", async (ctx) => {
    const { lat, lon } = ctx.request.url.searchParams;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`);
    const json = await res.json();
    
    ctx.response.body = json;
});

export default router;