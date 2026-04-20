import type { ProviderName } from "@clipin/convex-wearables";
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { wearables } from "./wearables";

const providerName = v.union(
  v.literal("garmin"),
  v.literal("suunto"),
  v.literal("polar"),
  v.literal("whoop"),
  v.literal("strava"),
  v.literal("apple"),
  v.literal("samsung"),
  v.literal("google"),
);

/**
 * Providers the host app has configured with OAuth credentials in {@link wearables}.
 * Use this to enable or disable "Connect" in the UI — unconfigured providers cannot call
 * {@link WearablesClient.generateAuthUrl}.
 */
export const configuredProviders = query({
  args: {},
  returns: v.array(providerName),
  handler: async () => wearables.getConfiguredProviders(),
});

/**
 * Get all connections for a user.
 */
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await wearables.getConnections(ctx, { userId: args.userId });
  },
});

/**
 * Get sync status across all providers.
 */
export const syncStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await wearables.getSyncStatus(ctx, { userId: args.userId });
  },
});

/**
 * Get the latest Garmin backfill job for a connection.
 */
export const garminBackfillStatus = query({
  args: { connectionId: v.string() },
  handler: async (ctx, args) => {
    return await wearables.getGarminBackfillStatus(ctx, {
      connectionId: args.connectionId,
    });
  },
});

/**
 * Trigger a Garmin historical backfill so the dashboard can populate
 * activity summaries and time-series data that are not fetched by sync.
 */
export const startGarminBackfill = action({
  args: {
    connectionId: v.string(),
    lookbackDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await wearables.startGarminBackfill(ctx, {
      connectionId: args.connectionId,
      lookbackDays: args.lookbackDays,
    });
  },
});

/**
 * Disconnect a provider.
 */
export const disconnect = mutation({
  args: {
    userId: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    await wearables.disconnect(ctx, {
      userId: args.userId,
      provider: args.provider as ProviderName,
    });
  },
});
