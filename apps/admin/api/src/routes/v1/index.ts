import { jwtAuth } from "@/middlewares/auth";
import { Hono } from "hono";
import { adminuserRoute } from "./adminuser";
import { apikeyRoute } from "./apikey";
import { modelRoute } from "./model";
import { providerRoute } from "./provider";

export const apiRoute = new Hono();

apiRoute.use("/*", jwtAuth);

apiRoute.route("/adminuser", adminuserRoute);
apiRoute.route("/apikey", apikeyRoute);
apiRoute.route("/model", modelRoute);
apiRoute.route("/provider", providerRoute);
