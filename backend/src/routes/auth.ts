import { express, z, type Request, type Response } from "../deps.ts";
import { publicAuthClient } from "../supabaseClient.ts";
import { NoParams } from "../types/http.ts";

const router = express.Router();


const RegisterSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(6),
});
type RegisterBody = z.infer<typeof RegisterSchema>;

router.post(
    "/register",
    async (req: Request<NoParams, unknown, RegisterBody>, res: Response) => {

        console.log("raw body:", req.body);
        console.log("email repr:", JSON.stringify(req.body?.email));
        const parsed = RegisterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        };

        const { data, error } = await publicAuthClient.auth.signUp(parsed.data);
        if (error) {
            return res.status(400).json({ error: error.message });
        };

        res.json(data);
    }
);

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
type LoginBody = z.infer<typeof LoginSchema>;

router.post(
    "/login",
    async (req: Request<NoParams, unknown, LoginBody>, res: Response) => {

        const parsed = LoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json(parsed.error);
        };

        const { data, error } = await publicAuthClient.auth.signInWithPassword(parsed.data);
        if (error) {
            return res.status(401).json({ error: error.message });
        };

        res.json(data);
    }
);

export const authRouter = router;
