import { v } from "convex/values";
import { query } from "./_generated/server";
import { wearables } from "./wearables";

/**
 * Get recent workouts for a user.
 */
export const list = query({
  args: {
    userId: v.string(),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await wearables.getEvents(ctx, {
      userId: args.userId,
      category: "workout",
      limit: 20,
      cursor: args.cursor ?? undefined,
    });
  },
});

/**
 * Get a single workout by ID.
 */
export const get = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    return await wearables.getEvent(ctx, { eventId: args.eventId });
  },
});
