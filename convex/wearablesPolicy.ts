import type { WearablesClient } from "@clipin/convex-wearables";
import { mutation, query } from "./_generated/server";
import { wearables } from "./wearables";

type DemoTimeSeriesPolicyInput = Parameters<
  WearablesClient["replaceTimeSeriesPolicyConfiguration"]
>[1];

const DEMO_TIME_SERIES_POLICY: DemoTimeSeriesPolicyInput = {
  defaultRules: [
    {
      // Keep unspecified metrics in raw form for 30 days, then delete them.
      tiers: [{ kind: "raw", fromAge: "0m", toAge: "30d" }],
    },
    {
      seriesType: "heart_rate",
      tiers: [
        { kind: "raw", fromAge: "0m", toAge: "48h" },
        { kind: "rollup", fromAge: "48h", toAge: "14d", bucket: "15m" },
        { kind: "rollup", fromAge: "14d", toAge: "30d", bucket: "1h" },
      ],
    },
    {
      seriesType: "oxygen_saturation",
      tiers: [
        { kind: "raw", fromAge: "0m", toAge: "24h" },
        { kind: "rollup", fromAge: "24h", toAge: "30d", bucket: "30m" },
      ],
    },
    {
      seriesType: "respiratory_rate",
      tiers: [
        { kind: "raw", fromAge: "0m", toAge: "24h" },
        { kind: "rollup", fromAge: "24h", toAge: "30d", bucket: "30m" },
      ],
    },
    {
      provider: "garmin",
      seriesType: "garmin_stress_level",
      tiers: [
        { kind: "raw", fromAge: "0m", toAge: "24h" },
        { kind: "rollup", fromAge: "24h", toAge: "30d", bucket: "30m" },
      ],
    },
    {
      provider: "garmin",
      seriesType: "garmin_body_battery",
      tiers: [
        { kind: "raw", fromAge: "0m", toAge: "24h" },
        { kind: "rollup", fromAge: "24h", toAge: "30d", bucket: "30m" },
      ],
    },
  ],
  maintenance: {
    enabled: true,
    interval: "1h",
  },
};

/**
 * Read the currently stored time-series policy configuration.
 */
export const getTimeSeriesStoragePolicy = query({
  args: {},
  handler: async (ctx) => {
    return await wearables.getTimeSeriesPolicyConfiguration(ctx);
  },
});

/**
 * Persist the demo's default 30-day retention policy.
 */
export const applyDemoTimeSeriesStoragePolicy = mutation({
  args: {},
  handler: async (ctx) => {
    const result = await wearables.replaceTimeSeriesPolicyConfiguration(
      ctx,
      DEMO_TIME_SERIES_POLICY,
    );
    const configuration = await wearables.getTimeSeriesPolicyConfiguration(ctx);

    return { result, configuration };
  },
});
