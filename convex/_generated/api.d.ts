/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as connections from "../connections.js";
import type * as garminOAuth from "../garminOAuth.js";
import type * as http from "../http.js";
import type * as sleep from "../sleep.js";
import type * as summaries from "../summaries.js";
import type * as timeseries from "../timeseries.js";
import type * as wearables from "../wearables.js";
import type * as wearablesPolicy from "../wearablesPolicy.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  connections: typeof connections;
  garminOAuth: typeof garminOAuth;
  http: typeof http;
  sleep: typeof sleep;
  summaries: typeof summaries;
  timeseries: typeof timeseries;
  wearables: typeof wearables;
  wearablesPolicy: typeof wearablesPolicy;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  wearables: import("@clipin/convex-wearables/_generated/component.js").ComponentApi<"wearables">;
};
