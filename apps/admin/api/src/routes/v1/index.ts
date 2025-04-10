import { jwtAuth } from "@/middlewares/auth";
import { Hono } from "hono";
import { adminuserRoute } from "./adminuser";

export const apiRoute = new Hono();

apiRoute.use("/*", jwtAuth);

apiRoute.route("/adminuser", adminuserRoute);
