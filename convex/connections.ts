import type { ProviderName } from "@clipin/convex-wearables";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { wearables } from "./wearables";

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
