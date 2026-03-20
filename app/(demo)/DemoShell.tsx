"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, Suspense } from "react";

const NAV = [
  { href: "/", label: "Dashboard" },
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
    <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/60 px-4 py-3 text-sm text-emerald-300">
      Successfully connected to{" "}
      <span className="font-medium capitalize">{connectedProvider}</span>! Data
      will start flowing in via webhooks.
    </div>
  );
}

export function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-[#08090e]">
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
            <Link href="/">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Health Dashboard
              </h1>
            </Link>
            <p className="mt-1 text-sm text-zinc-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <nav className="flex gap-1">
            {NAV.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main>
          <Suspense fallback={null}>
            <ConnectedFlash />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
