import "npm:express@4";

declare module "express-serve-static-core" {
    interface Request {
        user: { id: string }; // set by our auth middleware
    }
}