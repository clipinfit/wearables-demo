import { v } from "convex/values";
import { query } from "./_generated/server";
import { wearables } from "./wearables";

/**
 * Get daily summaries for a date range.
 */
export const daily = query({
  args: {
    userId: v.string(),
    category: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await wearables.getDailySummaries(ctx, args);
  },
});
