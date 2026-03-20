/**
 * Wearables component client — singleton for the demo app.
 */
import { WearablesClient } from "@clipin/convex-wearables";
import { components } from "./_generated/api";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`${name} must be set`);
  }
  return value;
}

export const wearables = new WearablesClient(components.wearables, {
  providers: {
    garmin: {
      clientId: requireEnv("GARMIN_CLIENT_ID"),
      clientSecret: requireEnv("GARMIN_CLIENT_SECRET"),
    },
    strava: {
      clientId: requireEnv("STRAVA_CLIENT_ID"),
      clientSecret: requireEnv("STRAVA_CLIENT_SECRET"),
    },
  },
});
