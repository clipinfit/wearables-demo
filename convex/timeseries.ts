import { v } from "convex/values";
import { query } from "./_generated/server";
import { wearables } from "./wearables";

/**
 * Get heart rate data for the last N hours.
 */
export const heartRate = query({
  args: {
    userId: v.string(),
    hoursBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const hours = args.hoursBack ?? 24;
    return await wearables.getTimeSeries(ctx, {
      userId: args.userId,
      seriesType: "heart_rate",
      startDate: now - hours * 60 * 60 * 1000,
      endDate: now,
    });
  },
});

/**
 * Get the latest value for any metric.
 */
export const latest = query({
  args: {
    userId: v.string(),
    seriesType: v.string(),
  },
  handler: async (ctx, args) => {
    return await wearables.getLatestDataPoint(ctx, args);
  },
});

/**
 * Get available metric types for a user.
 */
export const availableTypes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await wearables.getAvailableSeriesTypes(ctx, args);
  },
});
