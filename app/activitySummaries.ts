import type { DailySummary } from "@clipin/convex-wearables";
import {
  addLocalDays,
  formatLocalDateKey,
  localDateKeyToDate,
} from "./dateUtils";

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface ActivitySummaryView {
  date: string;
  totalSteps?: number | null;
  activeCalories?: number | null;
  avgHeartRate?: number | null;
  activeMinutes?: number | null;
  totalDistance?: number | null;
}

function mapDailySummary(summary: DailySummary): ActivitySummaryView {
  return {
    date: summary.date,
    totalSteps: summary.totalSteps,
    activeCalories: summary.activeCalories,
    avgHeartRate: summary.avgHeartRate,
    activeMinutes: summary.activeMinutes,
    totalDistance: summary.totalDistance,
  };
}

function enumerateDateKeys(startDate: string, endDate: string): string[] {
  const keys: string[] = [];
  let cursor = localDateKeyToDate(startDate);
  const end = localDateKeyToDate(endDate);

  while (cursor <= end) {
    keys.push(formatLocalDateKey(cursor));
    cursor = addLocalDays(cursor, 1);
  }

  return keys;
}

function sumSeriesByDate(points: TimeSeriesPoint[]): Map<string, number> {
  return points.reduce((totals, point) => {
    const dateKey = formatLocalDateKey(point.timestamp);
    totals.set(dateKey, (totals.get(dateKey) ?? 0) + point.value);
    return totals;
  }, new Map<string, number>());
}

export function buildActivitySummaries(args: {
  summaries: DailySummary[] | undefined;
  stepPoints: TimeSeriesPoint[] | undefined;
  energyPoints: TimeSeriesPoint[] | undefined;
  startDate: string;
  endDate: string;
}): ActivitySummaryView[] | undefined {
  const { summaries, stepPoints, energyPoints, startDate, endDate } = args;

  if (summaries && summaries.length > 0) {
    return summaries.map(mapDailySummary);
  }

  if (stepPoints === undefined || energyPoints === undefined) {
    return summaries === undefined ? undefined : [];
  }

  const stepsByDate = sumSeriesByDate(stepPoints);
  const caloriesByDate = sumSeriesByDate(energyPoints);
  const hasFallbackData = [
    ...stepsByDate.values(),
    ...caloriesByDate.values(),
  ].some((value) => value > 0);

  if (!hasFallbackData) {
    return [];
  }

  return enumerateDateKeys(startDate, endDate).map((date) => ({
    date,
    totalSteps: stepsByDate.get(date) ?? 0,
    activeCalories: caloriesByDate.get(date) ?? 0,
    avgHeartRate: null,
  }));
}
