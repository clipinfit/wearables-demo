import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = sp.connected;
  const connected = Array.isArray(raw) ? raw[0] : raw;
  const suffix = connected ? `?connected=${encodeURIComponent(connected)}` : "";
  redirect(`/workouts${suffix}`);
}
