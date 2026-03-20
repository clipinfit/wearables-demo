"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, Suspense } from "react";

const NAV = [
  { href: "/workouts", label: "Workouts" },
  { href: "/sleep", label: "Sleep" },
  { href: "/summaries", label: "Summaries" },
  { href: "/connections", label: "Connections" },
] as const;

function ConnectedFlash() {
  const searchParams = useSearchParams();
  const connectedProvider = searchParams.get("connected");
  if (!connectedProvider) return null;

  return (
    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200">
      Successfully connected to{" "}
      <span className="font-medium capitalize">{connectedProvider}</span>! Data
      will start flowing in via webhooks.
    </div>
  );
}

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

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
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Suspense fallback={null}>
          <ConnectedFlash />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
