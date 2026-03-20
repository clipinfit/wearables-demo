"use client";

import type {
  DailySummary,
  SleepEvent,
  WorkoutEvent,
} from "@clipin/convex-wearables";
import { useQuery } from "convex/react";
import {
  Activity,
  BatteryCharging,
  Check,
  Flame,
  Footprints,
  Heart,
  Link2,
  Moon,
  Route,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../convex/_generated/api";

const DEMO_USER_ID = "demo-user-1";

// ── Helpers ──────────────────────────────────────────────────────────

function useDateRange() {
  return useState(() => {
    const today = new Date();
    return {
      today: today.toISOString().split("T")[0],
      weekAgo: new Date(today.getTime() - 7 * 86_400_000)
        .toISOString()
        .split("T")[0],
    };
  })[0];
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "--";
  return n.toLocaleString();
}

function fmtDuration(mins: number | null | undefined): string {
  if (mins == null) return "--";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function dayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

// ── Health Score ─────────────────────────────────────────────────────

const TARGETS = { calories: 350, steps: 3500, sleepMinutes: 7 * 60 };

function computeDayScore(
  calories: number,
  steps: number,
  sleepMins: number,
): number {
  const calPct = Math.min((calories || 0) / TARGETS.calories, 1);
  const stepPct = Math.min((steps || 0) / TARGETS.steps, 1);
  const sleepPct = Math.min((sleepMins || 0) / TARGETS.sleepMinutes, 1);
  return Math.round(((calPct + stepPct + sleepPct) / 3) * 100);
}

function ProgressRing({
  size,
  stroke,
  progress,
  color,
  children,
}: {
  size: number;
  stroke: number;
  progress: number;
  color: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(progress, 1));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="img"
        aria-label="Progress ring"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#27272a"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function getSleepForDate(sleepEvents: SleepEvent[], dateStr: string): number {
  // Match sleep to the day the user woke up.
  // If sleep starts after 6pm, it belongs to the next calendar day.
  for (const s of sleepEvents) {
    if (s.sleepTotalDurationMinutes == null) continue;
    const start = new Date(s.startDatetime);
    const wakeDate =
      start.getHours() >= 18
        ? new Date(start.getTime() + 86_400_000).toISOString().split("T")[0]
        : start.toISOString().split("T")[0];
    if (wakeDate === dateStr) return s.sleepTotalDurationMinutes;
  }
  return 0;
}

function HealthScoreSection({
  summaries,
  sleepEvents,
}: {
  summaries: DailySummary[] | undefined;
  sleepEvents: { events: Array<SleepEvent | { category: string }> } | undefined;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!summaries) return <Shimmer />;

  const sleeps = (sleepEvents?.events ?? []).filter(
    (e): e is SleepEvent => e.category === "sleep",
  );

  // Build per-day data
  const days = summaries.map((s) => {
    const sleepMins = getSleepForDate(sleeps, s.date);
    const calories = s.totalCalories ?? 0;
    const steps = s.totalSteps ?? 0;
    return {
      date: s.date,
      day: dayLabel(s.date),
      calories,
      steps,
      sleepMins,
      score: computeDayScore(calories, steps, sleepMins),
    };
  });

  const activeIdx = selectedIdx ?? days.length - 1;
  const active = days[activeIdx];

  if (!active) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-zinc-500">
          No score data available yet
        </p>
      </Card>
    );
  }

  const calPct = Math.min(active.calories / TARGETS.calories, 1);
  const stepPct = Math.min(active.steps / TARGETS.steps, 1);
  const sleepPct = Math.min(active.sleepMins / TARGETS.sleepMinutes, 1);

  const scoreColor =
    active.score >= 80 ? "#06d6a0" : active.score >= 50 ? "#ffc145" : "#ff6b6b";

  return (
    <Card accent={scoreColor}>
      <SectionTitle icon={<Activity size={16} className="text-violet-400" />}>
        Daily Health Score
      </SectionTitle>

      {/* Week pills */}
      <div className="mt-5 flex justify-center gap-2">
        {days.map((d, i) => {
          const isActive = i === activeIdx;
          const met = d.score >= 80;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setSelectedIdx(i)}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-medium transition-all ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>{d.day}</span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  isActive ? "border-current" : ""
                }`}
                style={{
                  borderColor: met
                    ? "#06d6a0"
                    : isActive
                      ? scoreColor
                      : "rgba(255,255,255,0.12)",
                  color: met ? "#06d6a0" : undefined,
                }}
              >
                {met ? (
                  <Check size={14} />
                ) : (
                  <span className="text-xs font-bold">{d.score}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main ring */}
      <div className="mt-6 flex justify-center">
        <ProgressRing
          size={160}
          stroke={10}
          progress={active.score / 100}
          color={scoreColor}
        >
          <div className="text-center">
            <span className="text-5xl font-bold text-white">
              {active.score}
            </span>
            <p className="mt-0.5 text-[10px] tracking-widest text-zinc-500 uppercase">
              score
            </p>
          </div>
        </ProgressRing>
      </div>

      {/* Three sub-metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2">
          <ProgressRing size={64} stroke={5} progress={calPct} color="#ff6b6b">
            <Flame size={18} className="text-red-400" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {Math.round(active.calories)}
              <span className="text-xs font-normal text-zinc-500">
                /{TARGETS.calories}
              </span>
            </p>
            <p className="text-[10px] tracking-wider text-zinc-500 uppercase">
              Active Cal
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ProgressRing size={64} stroke={5} progress={stepPct} color="#06d6a0">
            <Footprints size={18} className="text-emerald-400" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {active.steps.toLocaleString()}
              <span className="text-xs font-normal text-zinc-500">
                /{(TARGETS.steps / 1000).toFixed(1)}K
              </span>
            </p>
            <p className="text-[10px] tracking-wider text-zinc-500 uppercase">
              Steps
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ProgressRing
            size={64}
            stroke={5}
            progress={sleepPct}
            color="#ffc145"
          >
            <Moon size={18} className="text-amber-400" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {fmtDuration(active.sleepMins)}
              <span className="text-xs font-normal text-zinc-500">
                /{TARGETS.sleepMinutes / 60}h
              </span>
            </p>
            <p className="text-[10px] tracking-wider text-zinc-500 uppercase">
              Sleep
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Tiny reusable pieces ─────────────────────────────────────────────

function Card({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-[#111318] p-5 ${className}`}
      style={accent ? { borderTopColor: accent, borderTopWidth: 2 } : undefined}
    >
      {children}
    </div>
  );
}

function IconCircle({
  children,
  color,
}: {
  children: ReactNode;
  color: string;
}) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl"
      style={{ background: `${color}22`, color }}
    >
      {children}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  color,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
  sub?: string;
}) {
  return (
    <Card accent={color}>
      <div className="flex items-start justify-between">
        <IconCircle color={color}>{icon}</IconCircle>
        {sub && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
            style={{ background: `${color}18`, color }}
          >
            {sub}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium tracking-widest text-zinc-400 uppercase">
        {label}
      </p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-base text-zinc-500">{unit}</span>
      </p>
    </Card>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-300 uppercase">
      {icon}
      {children}
    </h2>
  );
}

function Shimmer() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl bg-zinc-800/50"
        />
      ))}
    </div>
  );
}

function Pulse({ color }: { color: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
        style={{ background: color }}
      />
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
    </span>
  );
}

// ── Chart tooltip ────────────────────────────────────────────────────

function ChartTooltipContent({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400">{label}</p>
      <p className="font-semibold text-white">
        {payload[0].value.toLocaleString()} {unit}
      </p>
    </div>
  );
}

// ── Hero Metrics ─────────────────────────────────────────────────────

function HeroMetrics({
  summaries,
  sleepEvents,
  hrData,
}: {
  summaries: DailySummary[] | undefined;
  sleepEvents: { events: Array<SleepEvent | { category: string }> } | undefined;
  hrData: Array<{ timestamp: number; value: number }> | undefined;
}) {
  const todaySummary = summaries?.[summaries.length - 1];

  const latestSleep = sleepEvents?.events?.filter(
    (e): e is SleepEvent => e.category === "sleep",
  )?.[0];

  const avgHr =
    hrData && hrData.length > 0
      ? Math.round(hrData.reduce((a, d) => a + d.value, 0) / hrData.length)
      : summaries && summaries.length > 0
        ? (() => {
            const hrs = summaries.filter((s) => s.avgHeartRate != null);
            return hrs.length > 0
              ? Math.round(
                  hrs.reduce((a, s) => a + (s.avgHeartRate ?? 0), 0) /
                    hrs.length,
                )
              : null;
          })()
        : null;

  const avgSteps =
    summaries && summaries.length > 0
      ? Math.round(
          summaries.reduce((a, s) => a + (s.totalSteps ?? 0), 0) /
            summaries.length,
        )
      : null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        icon={<Footprints size={24} />}
        label="Steps Today"
        value={fmtNum(todaySummary?.totalSteps)}
        unit="steps"
        color="#06d6a0"
        sub={avgSteps != null ? `avg ${fmtNum(avgSteps)}` : undefined}
      />
      <MetricCard
        icon={<Flame size={24} />}
        label="Calories"
        value={
          todaySummary?.totalCalories != null
            ? Math.round(todaySummary.totalCalories).toLocaleString()
            : "--"
        }
        unit="kcal"
        color="#ff6b6b"
      />
      <MetricCard
        icon={<Heart size={24} />}
        label="Heart Rate"
        value={avgHr != null ? String(avgHr) : "--"}
        unit="bpm"
        color="#e040fb"
        sub="24h avg"
      />
      <MetricCard
        icon={<Moon size={24} />}
        label="Last Sleep"
        value={fmtDuration(latestSleep?.sleepTotalDurationMinutes)}
        unit=""
        color="#738cff"
        sub={
          latestSleep?.sleepEfficiencyScore != null
            ? `${latestSleep.sleepEfficiencyScore}% eff`
            : undefined
        }
      />
    </div>
  );
}

// ── Heart Rate Chart ─────────────────────────────────────────────────

function HeartRateSection({
  hrData,
}: {
  hrData: Array<{ timestamp: number; value: number }> | undefined;
}) {
  if (!hrData) return <Shimmer />;

  const chartData = hrData.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    bpm: Math.round(d.value),
  }));

  const avg =
    chartData.length > 0
      ? Math.round(chartData.reduce((a, d) => a + d.bpm, 0) / chartData.length)
      : 0;
  const max =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.bpm)) : 0;
  const min =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.bpm)) : 0;

  return (
    <Card accent="#e040fb">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle
          icon={<Activity size={16} className="text-fuchsia-400" />}
        >
          Heart Rate — 24h
        </SectionTitle>
        <div className="flex gap-4 text-xs text-zinc-400">
          <span>
            Avg <strong className="text-white">{avg}</strong>
          </span>
          <span>
            Max <strong className="text-rose-400">{max}</strong>
          </span>
          <span>
            Min <strong className="text-emerald-400">{min}</strong>
          </span>
        </div>
      </div>
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No heart rate data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e040fb" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#e040fb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="time"
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              width={36}
            />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload as unknown as Array<{ value: number }>}
                  label={label as string}
                  unit="bpm"
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="bpm"
              stroke="#e040fb"
              strokeWidth={2}
              fill="url(#hrGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#e040fb",
                stroke: "#fff",
                strokeWidth: 1,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ── Weekly Activity Bar Chart ────────────────────────────────────────

const BAR_COLORS = [
  "#06d6a0",
  "#00c9db",
  "#738cff",
  "#e040fb",
  "#ff6b6b",
  "#ffc145",
  "#06d6a0",
];

function WeeklyActivitySection({
  summaries,
}: {
  summaries: DailySummary[] | undefined;
}) {
  if (!summaries) return <Shimmer />;

  const chartData = summaries.map((s, i) => ({
    date: s.date,
    day: dayLabel(s.date),
    steps: s.totalSteps ?? 0,
    calories: s.totalCalories ? Math.round(s.totalCalories) : 0,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  const totalSteps = summaries.reduce((a, s) => a + (s.totalSteps ?? 0), 0);
  const totalCals = summaries.reduce((a, s) => a + (s.totalCalories ?? 0), 0);

  return (
    <Card accent="#06d6a0">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle
          icon={<TrendingUp size={16} className="text-emerald-400" />}
        >
          Weekly Activity
        </SectionTitle>
        <div className="flex gap-4 text-xs text-zinc-400">
          <span>
            Total{" "}
            <strong className="text-white">
              {totalSteps.toLocaleString()}
            </strong>{" "}
            steps
          </span>
          <span>
            <strong className="text-white">
              {Math.round(totalCals).toLocaleString()}
            </strong>{" "}
            kcal
          </span>
        </div>
      </div>
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No activity data this week
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload as unknown as Array<{ value: number }>}
                  label={label as string}
                  unit="steps"
                />
              )}
            />
            <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.date} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ── Recent Workouts ──────────────────────────────────────────────────

function RecentWorkouts({
  data,
}: {
  data: { events: Array<WorkoutEvent | { category: string }> } | undefined;
}) {
  if (!data) return <Shimmer />;

  const workouts = data.events
    .filter((e): e is WorkoutEvent => e.category === "workout")
    .slice(0, 4);

  return (
    <Card>
      <SectionTitle icon={<Zap size={18} className="text-amber-400" />}>
        Recent Workouts
      </SectionTitle>
      {workouts.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No workouts recorded yet</p>
      ) : (
        <div className="mt-4 space-y-3">
          {workouts.map((w) => (
            <div
              key={w._id}
              className="flex items-center gap-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <Route size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-zinc-200">
                  {w.type ?? "Workout"}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(w.startDatetime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-3.5 text-xs text-zinc-400">
                {w.durationSeconds != null && (
                  <span className="flex items-center gap-1">
                    <Timer size={14} />
                    {Math.round(w.durationSeconds / 60)}m
                  </span>
                )}
                {w.energyBurned != null && (
                  <span className="flex items-center gap-1">
                    <Flame size={14} className="text-red-400" />
                    {Math.round(w.energyBurned)}
                  </span>
                )}
                {w.heartRateAvg != null && (
                  <span className="flex items-center gap-1">
                    <Heart size={14} className="text-fuchsia-400" />
                    {w.heartRateAvg}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        href="/workouts"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
      >
        View all workouts &rarr;
      </Link>
    </Card>
  );
}

// ── Recent Sleep ─────────────────────────────────────────────────────

function RecentSleep({
  data,
}: {
  data: { events: Array<SleepEvent | { category: string }> } | undefined;
}) {
  if (!data) return <Shimmer />;

  const sleeps = data.events
    .filter((e): e is SleepEvent => e.category === "sleep")
    .slice(0, 4);

  return (
    <Card>
      <SectionTitle icon={<Moon size={18} className="text-indigo-400" />}>
        Recent Sleep
      </SectionTitle>
      {sleeps.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No sleep data yet</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sleeps.map((s) => (
            <div
              key={s._id}
              className="flex items-center gap-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <Moon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-zinc-200">
                  {s.isNap ? "Nap" : "Sleep"}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(s.startDatetime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-3.5 text-xs text-zinc-400">
                {s.sleepTotalDurationMinutes != null && (
                  <span>{fmtDuration(s.sleepTotalDurationMinutes)}</span>
                )}
                {s.sleepDeepMinutes != null && (
                  <span className="text-indigo-400">
                    Deep {s.sleepDeepMinutes}m
                  </span>
                )}
                {s.sleepEfficiencyScore != null && (
                  <span className="font-semibold text-emerald-400">
                    {s.sleepEfficiencyScore}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        href="/sleep"
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
      >
        View all sleep &rarr;
      </Link>
    </Card>
  );
}

// ── Connection Status ────────────────────────────────────────────────

function ConnectionStatus() {
  const connections = useQuery(api.connections.list, {
    userId: DEMO_USER_ID,
  });
  const syncStatus = useQuery(api.connections.syncStatus, {
    userId: DEMO_USER_ID,
  });

  const connected =
    connections?.filter((c) => (c.status as string) === "active") ?? [];

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Link2 size={16} className="text-cyan-400" />}>
          Connections
        </SectionTitle>
        <Link
          href="/connections"
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
        >
          Manage &rarr;
        </Link>
      </div>
      {connected.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-zinc-700 px-4 py-5 text-center">
          <BatteryCharging size={18} className="text-zinc-500" />
          <p className="text-sm text-zinc-500">
            No providers connected.{" "}
            <Link
              href="/connections"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Connect one
            </Link>{" "}
            to power the dashboard.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {connected.map((c) => {
            const sync = syncStatus?.find((s) => s.provider === c.provider);
            return (
              <div
                key={c.provider}
                className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5"
              >
                <Pulse color="#06d6a0" />
                <span className="text-xs font-medium capitalize text-zinc-300">
                  {c.provider}
                </span>
                {sync?.lastSyncedAt && (
                  <span className="text-[10px] text-zinc-500">
                    {new Date(sync.lastSyncedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────

export default function DashboardPage() {
  const { today, weekAgo } = useDateRange();

  const summaries = useQuery(api.summaries.daily, {
    userId: DEMO_USER_ID,
    category: "activity",
    startDate: weekAgo,
    endDate: today,
  });

  const workouts = useQuery(api.workouts.list, {
    userId: DEMO_USER_ID,
  });

  const sleepData = useQuery(api.sleep.list, {
    userId: DEMO_USER_ID,
  });

  const hrData = useQuery(api.timeseries.heartRate, {
    userId: DEMO_USER_ID,
    hoursBack: 24,
  });

  const allLoading =
    summaries === undefined &&
    workouts === undefined &&
    sleepData === undefined &&
    hrData === undefined;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08090e]">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Health Dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <nav className="flex gap-1">
            {[
              { href: "/", label: "Dashboard" },
              { href: "/workouts", label: "Workouts" },
              { href: "/sleep", label: "Sleep" },
              { href: "/summaries", label: "Summaries" },
              { href: "/connections", label: "Connections" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  link.href === "/"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        {allLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hero Metric Cards */}
            <HeroMetrics
              summaries={summaries}
              sleepEvents={sleepData}
              hrData={hrData}
            />

            {/* Health Score + Charts Row */}
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <HealthScoreSection
                  summaries={summaries}
                  sleepEvents={sleepData}
                />
              </div>
              <div className="lg:col-span-3 grid gap-6">
                <HeartRateSection hrData={hrData} />
                <WeeklyActivitySection summaries={summaries} />
              </div>
            </div>

            {/* Detail Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <RecentWorkouts data={workouts} />
              </div>
              <div className="lg:col-span-1">
                <RecentSleep data={sleepData} />
              </div>
              <div className="lg:col-span-1">
                <ConnectionStatus />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
