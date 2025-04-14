import { jwtAuth } from "../../middlewares/auth";
import { Hono } from "hono";
import { adminUserRoute } from "./adminUser.route";
import { apiKeyRoute } from "./apiKey.route";
import { modelRoute } from "./model.route";
import { providerRoute } from "./provider.route";

export const apiRoute = new Hono()
  .use("/*", jwtAuth)
  .route("/adminUser", adminUserRoute)
  .route("/apiKey", apiKeyRoute)
  .route("/model", modelRoute)
  .route("/provider", providerRoute);
