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
  wearables: {
    backfillJobs: {
      getLatestByConnection: FunctionReference<
        "query",
        "internal",
        { connectionId: string },
        any | null
      >;
    };
    connections: {
      disconnect: FunctionReference<
        "mutation",
        "internal",
        {
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          userId: string;
        },
        any
      >;
      getByUserProvider: FunctionReference<
        "query",
        "internal",
        {
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          userId: string;
        },
        any | null
      >;
      getConnections: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<any>
      >;
      getSyncStatus: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<any>
      >;
    };
    dataPoints: {
      getAvailableSeriesTypes: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<string>
      >;
      getLatestDataPoint: FunctionReference<
        "query",
        "internal",
        { seriesType: string; userId: string },
        { provider: string; timestamp: number; value: number } | null
      >;
      getTimeSeries: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          dataSourceId: string;
          endDate: number;
          limit?: number;
          order?: "asc" | "desc";
          seriesType: string;
          startDate: number;
        },
        {
          hasMore: boolean;
          nextCursor: string | null;
          points: Array<{ timestamp: number; value: number }>;
        }
      >;
      getTimeSeriesForUser: FunctionReference<
        "query",
        "internal",
        {
          endDate: number;
          limit?: number;
          seriesType: string;
          startDate: number;
          userId: string;
        },
        Array<{ timestamp: number; value: number }>
      >;
    };
    dataSources: {
      getByUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<any>
      >;
      getByUserProvider: FunctionReference<
        "query",
        "internal",
        {
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          userId: string;
        },
        Array<any>
      >;
      getOrCreate: FunctionReference<
        "mutation",
        "internal",
        {
          connectionId?: string;
          deviceModel?: string;
          deviceType?: string;
          originalSourceName?: string;
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          softwareVersion?: string;
          source?: string;
          userId: string;
        },
        string
      >;
    };
    events: {
      getEvent: FunctionReference<
        "query",
        "internal",
        { eventId: string },
        any
      >;
      getEvents: FunctionReference<
        "query",
        "internal",
        {
          category: "workout" | "sleep";
          cursor?: string;
          endDate?: number;
          limit?: number;
          startDate?: number;
          userId: string;
        },
        { events: Array<any>; hasMore: boolean; nextCursor: string | null }
      >;
    };
    garminBackfill: {
      startGarminBackfill: FunctionReference<
        "action",
        "internal",
        {
          clientId?: string;
          clientSecret?: string;
          connectionId: string;
          lookbackDays?: number;
        },
        { backfillJobId: string; deduped: boolean; workflowId: string }
      >;
    };
    garminWebhooks: {
      processPushPayload: FunctionReference<
        "action",
        "internal",
        { garminClientId: string; payload?: any; payloadJson?: string },
        any
      >;
    };
    lifecycle: {
      deleteAllUserData: FunctionReference<
        "mutation",
        "internal",
        { userId: string },
        any
      >;
    };
    menstrualCycles: {
      getByUserDateRange: FunctionReference<
        "query",
        "internal",
        { endDate: string; startDate: string; userId: string },
        Array<any>
      >;
      getLatest: FunctionReference<
        "query",
        "internal",
        { userId: string },
        any
      >;
    };
    oauthActions: {
      generateAuthUrl: FunctionReference<
        "action",
        "internal",
        {
          clientId: string;
          clientSecret: string;
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          redirectUri: string;
          subscriptionKey?: string;
          userId: string;
        },
        string
      >;
      handleCallback: FunctionReference<
        "action",
        "internal",
        {
          clientId: string;
          clientSecret: string;
          code: string;
          state: string;
          subscriptionKey?: string;
        },
        { connectionId: string; provider: string; userId: string }
      >;
    };
    sdkPush: {
      ingestNormalizedPayload: FunctionReference<
        "action",
        "internal",
        {
          dailySummaries?: Array<{
            activeCalories?: number;
            activeMinutes?: number;
            avgHeartRate?: number;
            avgStressLevel?: number;
            awakeDuringMinutes?: number;
            bodyBattery?: number;
            bodyFatPercentage?: number;
            bodyMassIndex?: number;
            bodyTemperature?: number;
            category: string;
            date: string;
            deepSleepMinutes?: number;
            floorsClimbed?: number;
            hrvAvg?: number;
            hrvRmssd?: number;
            leanBodyMass?: number;
            lightSleepMinutes?: number;
            maxHeartRate?: number;
            minHeartRate?: number;
            recoveryScore?: number;
            remSleepMinutes?: number;
            restingHeartRate?: number;
            sleepDurationMinutes?: number;
            sleepEfficiency?: number;
            spo2Avg?: number;
            timeInBedMinutes?: number;
            totalCalories?: number;
            totalDistance?: number;
            totalSteps?: number;
            weight?: number;
          }>;
          dataPoints?: Array<{
            deviceModel?: string;
            deviceType?: string;
            externalId?: string;
            originalSourceName?: string;
            recordedAt: number;
            seriesType: string;
            softwareVersion?: string;
            source?: string;
            value: number;
          }>;
          device?: {
            deviceType?: string;
            model?: string;
            originalSourceName?: string;
            softwareVersion?: string;
            source?: string;
          };
          events?: Array<{
            averageSpeed?: number;
            averageWatts?: number;
            category: "workout" | "sleep";
            deviceModel?: string;
            deviceType?: string;
            distance?: number;
            durationSeconds?: number;
            elevHigh?: number;
            elevLow?: number;
            endDatetime?: number;
            energyBurned?: number;
            externalId?: string;
            heartRateAvg?: number;
            heartRateMax?: number;
            heartRateMin?: number;
            isNap?: boolean;
            maxSpeed?: number;
            maxWatts?: number;
            movingTimeSeconds?: number;
            originalSourceName?: string;
            sleepAwakeMinutes?: number;
            sleepDeepMinutes?: number;
            sleepEfficiencyScore?: number;
            sleepLightMinutes?: number;
            sleepRemMinutes?: number;
            sleepStages?: Array<{
              endTime: number;
              stage: string;
              startTime: number;
            }>;
            sleepTimeInBedMinutes?: number;
            sleepTotalDurationMinutes?: number;
            softwareVersion?: string;
            source?: string;
            sourceName?: string;
            startDatetime: number;
            stepsCount?: number;
            totalElevationGain?: number;
            type?: string;
          }>;
          provider: "apple" | "google" | "samsung";
          providerUserId?: string;
          providerUsername?: string;
          sourceMetadata?: {
            deviceModel?: string;
            deviceType?: string;
            originalSourceName?: string;
            softwareVersion?: string;
            source?: string;
          };
          summaries?: Array<{
            activeCalories?: number;
            activeMinutes?: number;
            avgHeartRate?: number;
            avgStressLevel?: number;
            awakeDuringMinutes?: number;
            bodyBattery?: number;
            bodyFatPercentage?: number;
            bodyMassIndex?: number;
            bodyTemperature?: number;
            category: string;
            date: string;
            deepSleepMinutes?: number;
            floorsClimbed?: number;
            hrvAvg?: number;
            hrvRmssd?: number;
            leanBodyMass?: number;
            lightSleepMinutes?: number;
            maxHeartRate?: number;
            minHeartRate?: number;
            recoveryScore?: number;
            remSleepMinutes?: number;
            restingHeartRate?: number;
            sleepDurationMinutes?: number;
            sleepEfficiency?: number;
            spo2Avg?: number;
            timeInBedMinutes?: number;
            totalCalories?: number;
            totalDistance?: number;
            totalSteps?: number;
            weight?: number;
          }>;
          syncTimestamp?: number;
          userId: string;
        },
        {
          connectionId: string;
          dataPointsStored: number;
          eventsStored: number;
          summariesStored: number;
        }
      >;
    };
    summaries: {
      getDailySummaries: FunctionReference<
        "query",
        "internal",
        {
          category: string;
          endDate: string;
          startDate: string;
          userId: string;
        },
        Array<any>
      >;
    };
    syncJobs: {
      getByUser: FunctionReference<
        "query",
        "internal",
        { limit?: number; userId: string },
        Array<any>
      >;
    };
    syncWorkflow: {
      syncAllActive: FunctionReference<
        "action",
        "internal",
        {
          clientCredentials: {
            garmin?: { clientId: string; clientSecret: string };
            polar?: { clientId: string; clientSecret: string };
            strava?: { clientId: string; clientSecret: string };
            suunto?: {
              clientId: string;
              clientSecret: string;
              subscriptionKey?: string;
            };
            whoop?: { clientId: string; clientSecret: string };
          };
          syncWindowHours?: number;
        },
        { deduped: number; enqueued: number; skipped: number }
      >;
      syncConnection: FunctionReference<
        "action",
        "internal",
        {
          clientId?: string;
          clientSecret?: string;
          connectionId: string;
          endDate?: number;
          provider:
            | "garmin"
            | "suunto"
            | "polar"
            | "whoop"
            | "strava"
            | "apple"
            | "samsung"
            | "google";
          startDate?: number;
          subscriptionKey?: string;
          syncWindowHours?: number;
        },
        { deduped: boolean; syncJobId: string; workflowId: string }
      >;
    };
  };
};
