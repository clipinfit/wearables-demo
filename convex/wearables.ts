/**
 * Wearables component client — singleton for the demo app.
 */
import { WearablesClient } from "@clipin/convex-wearables";
import { components } from "./_generated/api";

const garminClientId = process.env.GARMIN_CLIENT_ID;
const garminClientSecret = process.env.GARMIN_CLIENT_SECRET;

if (Boolean(garminClientId) !== Boolean(garminClientSecret)) {
  throw new Error(
    "GARMIN_CLIENT_ID and GARMIN_CLIENT_SECRET must be set together",
  );
}

export const wearables = new WearablesClient(components.wearables, {
  providers: {
    ...(garminClientId && garminClientSecret
      ? {
          garmin: {
            clientId: garminClientId,
            clientSecret: garminClientSecret,
          },
        }
      : {}),
  },
});
