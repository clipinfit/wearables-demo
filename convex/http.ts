import { registerRoutes } from "@clipin/convex-wearables";
import { httpRouter } from "convex/server";
import { components } from "./_generated/api";

const http = httpRouter();

registerRoutes(http, components.wearables, {
  garmin: {
    clientId: process.env.GARMIN_CLIENT_ID,
    clientSecret: process.env.GARMIN_CLIENT_SECRET,
    webhookPath: "/webhooks/garmin/push", // optional
    healthPath: "/webhooks/garmin/health", // optional
    oauthCallbackPath: "/oauth/garmin/callback", // optional
    successRedirectUrl:
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
});

export default http;
