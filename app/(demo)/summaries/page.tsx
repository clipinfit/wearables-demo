"use client";

import type { DailySummary } from "@clipin/convex-wearables";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

const DEMO_USER_ID = "demo-user-1";

export default function SummariesPage() {
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
      <h2 className="mb-4 text-lg font-semibold text-zinc-100">
        Weekly Activity Summary
      </h2>
      {summaries.length === 0 ? (
        <EmptyState message="No activity summaries yet." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaries.map((s: DailySummary) => (
            <div
              key={s._id}
              className="rounded-2xl border border-zinc-800 bg-[#111318] p-4"
            >
              <p className="text-sm font-medium text-zinc-400">
                {s.date}
              </p>
              <div className="mt-2 space-y-1 text-sm text-zinc-300">
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
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center">
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}
