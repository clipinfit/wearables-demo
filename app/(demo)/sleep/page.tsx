"use client";

import type { SleepEvent } from "@clipin/convex-wearables";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DEMO_USER_ID = "demo-user-1";

export default function SleepPage() {
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
