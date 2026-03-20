/**
 * Garmin OAuth flow — Convex actions for the demo app.
 *
 * These are host-app level actions that call the component's
 * OAuth utilities with credentials from environment variables.
 */

import { v } from "convex/values";
import { components } from "./_generated/api";
import { action } from "./_generated/server";

/**
 * Generate the Garmin authorization URL.
 * Called from the frontend when user clicks "Connect Garmin".
 */
export const getAuthUrl = action({
  args: { userId: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    const clientId = process.env.GARMIN_CLIENT_ID;
    const clientSecret = process.env.GARMIN_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error("GARMIN_CLIENT_ID and GARMIN_CLIENT_SECRET must be set");
    }

    const siteUrl = process.env.CONVEX_SITE_URL;
    if (!siteUrl) {
      throw new Error("CONVEX_SITE_URL must be set");
    }

    const redirectUri = `${siteUrl}/oauth/garmin/callback`;

    // Use the component's generateAuthUrl action
    const url = await ctx.runAction(
      components.wearables.oauthActions.generateAuthUrl,
      {
        userId: args.userId,
        provider: "garmin",
        clientId,
        clientSecret,
        redirectUri,
      },
    );

    return url;
  },
});

/**
 * Trigger a Garmin backfill to get historical data.
 * Call this after a successful connection to pull in recent data.
 */
export const triggerBackfill = action({
  args: {
    userId: v.string(),
    daysBack: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    // The backfill API triggers Garmin to push data to our webhooks
    // For now, we log that it should be triggered — the actual backfill
    // call requires the access token which is stored in the component
    console.log(
      `Backfill requested for ${args.userId}, ${args.daysBack ?? 30} days back`,
    );
  },
});
