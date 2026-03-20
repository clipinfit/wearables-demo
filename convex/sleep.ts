import { v } from "convex/values";
import { query } from "./_generated/server";
import { wearables } from "./wearables";

/**
 * Get recent sleep sessions for a user.
 */
export const list = query({
  args: {
    userId: v.string(),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await wearables.getEvents(ctx, {
      userId: args.userId,
      category: "sleep",
      limit: 20,
      cursor: args.cursor ?? undefined,
    });
  },
});
