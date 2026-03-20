"use client";

import type {
  Connection,
  DailySummary,
  ProviderName,
  SleepEvent,
  SyncStatus,
  WorkoutEvent,
} from "@clipin/convex-wearables";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

// Hardcoded demo user ID — in production this would come from auth
const DEMO_USER_ID = "demo-user-1";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "workouts" | "sleep" | "connections" | "summaries"
  >("connections");

  // Check for ?connected= query param (redirect from OAuth callback)
  const connectedProvider =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("connected")
      : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Wearables Demo
          </h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            @clipin/convex-wearables
          </span>
        </div>
      </header>

      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl gap-1 px-6">
          {(["workouts", "sleep", "connections", "summaries"] as const).map(
            (tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {connectedProvider && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200">
            Successfully connected to{" "}
            <span className="font-medium capitalize">{connectedProvider}</span>!
            Data will start flowing in via webhooks.
          </div>
        )}
        {activeTab === "workouts" && <WorkoutsTab />}
        {activeTab === "sleep" && <SleepTab />}
        {activeTab === "connections" && <ConnectionsTab />}
        {activeTab === "summaries" && <SummariesTab />}
      </main>
    </div>
  );
}

function WorkoutsTab() {
  const data = useQuery(api.workouts.list, {
    userId: DEMO_USER_ID,
  });

  if (data === undefined) return <Loading />;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Recent Workouts
      </h2>
      {data.events.length === 0 ? (
        <EmptyState message="No workouts yet. Connect a provider to start syncing." />
      ) : (
        <div className="space-y-3">
          {data.events
            .filter((e): e is WorkoutEvent => e.category === "workout")
            .map((event) => (
              <div
                key={event._id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {event.type ?? "workout"}
                    </span>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(event.startDatetime).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">
                    {event.sourceName}
                  </span>
                </div>
                <div className="mt-3 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  {event.durationSeconds && (
                    <span>{Math.round(event.durationSeconds / 60)} min</span>
                  )}
                  {event.distance && (
                    <span>{(event.distance / 1000).toFixed(1)} km</span>
                  )}
                  {event.heartRateAvg && (
                    <span>{event.heartRateAvg} bpm avg</span>
                  )}
                  {event.energyBurned && (
                    <span>{Math.round(event.energyBurned)} kcal</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function SleepTab() {
  const data = useQuery(api.sleep.list, {
    userId: DEMO_USER_ID,
  });

  if (data === undefined) return <Loading />;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Sleep Sessions
      </h2>
      {data.events.length === 0 ? (
        <EmptyState message="No sleep data yet." />
      ) : (
        <div className="space-y-3">
          {data.events
            .filter((e): e is SleepEvent => e.category === "sleep")
            .map((event) => (
              <div
                key={event._id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {event.isNap ? "nap" : "sleep"}
                    </span>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(event.startDatetime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  {event.sleepTotalDurationMinutes && (
                    <span>
                      {Math.floor(event.sleepTotalDurationMinutes / 60)}h{" "}
                      {event.sleepTotalDurationMinutes % 60}m
                    </span>
                  )}
                  {event.sleepDeepMinutes && (
                    <span>Deep: {event.sleepDeepMinutes}m</span>
                  )}
                  {event.sleepRemMinutes && (
                    <span>REM: {event.sleepRemMinutes}m</span>
                  )}
                  {event.sleepEfficiencyScore && (
                    <span>{event.sleepEfficiencyScore}% efficiency</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function ConnectionsTab() {
  const connections = useQuery(api.connections.list, {
    userId: DEMO_USER_ID,
  });
  const syncStatus = useQuery(api.connections.syncStatus, {
    userId: DEMO_USER_ID,
  });
  const disconnectMutation = useMutation(api.connections.disconnect);
  const getGarminAuthUrl = useAction(api.garminOAuth.getAuthUrl);
  const [connecting, setConnecting] = useState<ProviderName | null>(null);
  const [copiedProvider, setCopiedProvider] = useState<ProviderName | null>(
    null,
  );

  if (connections === undefined) return <Loading />;

  // Providers with OAuth support implemented
  const oauthProviders = new Set<ProviderName>(["garmin", "strava"]);

  const providers: ProviderName[] = [
    "garmin",
    "strava",
    "whoop",
    "polar",
    "suunto",
  ];

  async function handleConnect(provider: ProviderName) {
    setConnecting(provider);
    try {
      let authUrl: string;
      if (provider === "garmin") {
        authUrl = await getGarminAuthUrl({ userId: DEMO_USER_ID });
      } else {
        // Other providers not yet wired up
        alert(`${provider} OAuth not yet configured`);
        return;
      }
      // Redirect to provider authorization page
      window.location.href = authUrl;
    } catch (e) {
      alert(`Failed to start OAuth: ${e instanceof Error ? e.message : e}`);
    } finally {
      setConnecting(null);
    }
  }

  async function handleCopyUserId(
    provider: ProviderName,
    providerUserId: string,
  ) {
    try {
      await navigator.clipboard.writeText(providerUserId);
      setCopiedProvider(provider);
      window.setTimeout(() => {
        setCopiedProvider((current) => (current === provider ? null : current));
      }, 1500);
    } catch (e) {
      alert(`Failed to copy user ID: ${e instanceof Error ? e.message : e}`);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Provider Connections
      </h2>
      <div className="space-y-3">
        {providers.map((provider) => {
          const conn = connections.find(
            (c: Connection) => c.provider === provider,
          );
          const status = syncStatus?.find(
            (s: SyncStatus) => s.provider === provider,
          );
          const isConnected = conn?.status === "active";
          const hasOAuth = oauthProviders.has(provider);

          return (
            <div
              key={provider}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                  {provider}
                </p>
                {isConnected && (
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {conn?.providerUserId && (
                      <>
                        <span className="select-all font-mono text-zinc-600 dark:text-zinc-300">
                          ID: {conn.providerUserId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const id = conn.providerUserId;
                            if (id) void handleCopyUserId(provider, id);
                          }}
                          className="rounded border border-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          aria-label={`Copy ${provider} user ID`}
                        >
                          {copiedProvider === provider ? "Copied" : "Copy ID"}
                        </button>
                        <span aria-hidden="true">&middot;</span>
                      </>
                    )}
                    <span>
                      {status?.lastSyncedAt
                        ? `Last synced: ${new Date(status.lastSyncedAt).toLocaleString()}`
                        : "Not yet synced"}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Not connected"}
                </span>
                {isConnected ? (
                  <button
                    type="button"
                    onClick={() =>
                      disconnectMutation({
                        userId: DEMO_USER_ID,
                        provider,
                      })
                    }
                    className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(provider)}
                    disabled={!hasOAuth || connecting === provider}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                      hasOAuth
                        ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    {connecting === provider
                      ? "Connecting..."
                      : hasOAuth
                        ? "Connect"
                        : "Coming soon"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummariesTab() {
  const [{ today, weekAgo }] = useState(() => {
    const today = new Date();
    return {
      today: today.toISOString().split("T")[0],
      weekAgo: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };
  });

  const summaries = useQuery(api.summaries.daily, {
    userId: DEMO_USER_ID,
    category: "activity",
    startDate: weekAgo,
    endDate: today,
  });

  if (summaries === undefined) return <Loading />;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Weekly Activity Summary
      </h2>
      {summaries.length === 0 ? (
        <EmptyState message="No activity summaries yet." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s: DailySummary) => (
            <div
              key={s._id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {s.date}
              </p>
              <div className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                {s.totalSteps != null && (
                  <p>{s.totalSteps.toLocaleString()} steps</p>
                )}
                {s.totalCalories != null && (
                  <p>{Math.round(s.totalCalories)} kcal</p>
                )}
                {s.activeMinutes != null && <p>{s.activeMinutes} active min</p>}
                {s.totalDistance != null && (
                  <p>{(s.totalDistance / 1000).toFixed(1)} km</p>
                )}
                {s.avgHeartRate != null && <p>{s.avgHeartRate} bpm avg HR</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}
