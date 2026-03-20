"use client";

import type { WorkoutEvent } from "@clipin/convex-wearables";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DEMO_USER_ID = "demo-user-1";

export default function WorkoutsPage() {
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
