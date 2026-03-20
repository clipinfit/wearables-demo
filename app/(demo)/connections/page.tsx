"use client";

import type {
  Connection,
  ProviderName,
  SyncStatus,
} from "@clipin/convex-wearables";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

const DEMO_USER_ID = "demo-user-1";

export default function ConnectionsPage() {
  const connections = useQuery(api.connections.list, {
    userId: DEMO_USER_ID,
  });
  const configuredProviders = useQuery(api.connections.configuredProviders);
  const syncStatus = useQuery(api.connections.syncStatus, {
    userId: DEMO_USER_ID,
  });
  const disconnectMutation = useMutation(api.connections.disconnect);
  const getGarminAuthUrl = useAction(api.garminOAuth.getAuthUrl);
  const [connecting, setConnecting] = useState<ProviderName | null>(null);
  const [copiedProvider, setCopiedProvider] = useState<ProviderName | null>(
    null,
  );

  if (connections === undefined || configuredProviders === undefined) {
    return <Loading />;
  }

  const oauthReady = new Set(configuredProviders);

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
        alert(
          `${provider} OAuth redirect is not wired in this demo app (only Garmin has a callback route).`,
        );
        return;
      }
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
          const hasOAuth = oauthReady.has(provider);

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

function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
    </div>
  );
}
