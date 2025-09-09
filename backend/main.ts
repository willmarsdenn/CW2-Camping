import { Application } from "./deps.ts";
import authRoutes from "./routes/auth.ts";
import campsiteRoutes from "./routes/campsites.ts";
import weatherRoutes from "./routes/weather.ts";

const app = new Application();

app.use(async (ctx, next) => {
    try {
        ctx.response.headers.set("Content-Type", "application/json");
        await next();
    } catch (err) {
        ctx.response.status = err.status || 500;
        ctx.response.body = { error: err.message };
    };
});

// CORS
app.use((ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    if (ctx.request.method === "OPTIONS") return;
    return next();
});

// routes
app.use(authRoutes.routes());
app.use(campsiteRoutes.routes());
app.use(weatherRoutes.routes());

app.addEventListener("listen", ({ port }) => console.log(`Server running on http://localhost:${port}`));
await app.listen({ port: 8000 });