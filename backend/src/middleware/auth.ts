import { jwt } from "../deps.ts";
import { JWT_SECRET } from "../config/env.ts";
import type { Request, Response, NextFunction } from "../deps.ts";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ error: "Missing token" });
    const token = header.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
        req.user = { id: payload.sub };
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};