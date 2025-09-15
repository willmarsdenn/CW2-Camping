import "./types/express.d.ts";
import { express, type Express, type Request, type Response, cors } from "./deps.ts";
import { authRouter } from "./routes/auth.ts";
import { campsitesRouter } from "./routes/campsites.ts";
import { favouritesRouter } from "./routes/favourites.ts";
import { weatherRouter } from "./routes/weathers.ts";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/campsites", campsitesRouter);
app.use("/favourites", favouritesRouter);
app.use("/weather", weatherRouter);

// simple health check
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

app.listen(8000, () =>
    console.log("Server running on http://localhost:8000")
);