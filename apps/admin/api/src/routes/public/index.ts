import { Hono } from "hono";
import { authRoute } from "./auth.route";

export const publicRoute = new Hono().route("/auth", authRoute);
