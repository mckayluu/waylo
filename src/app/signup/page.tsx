import { redirect } from "next/navigation";
export default function S({ searchParams }: { searchParams: { plan?: string; try?: string } }) {
  const q = new URLSearchParams(); if (searchParams.plan) q.set("plan", searchParams.plan); if (searchParams.try) q.set("try", searchParams.try);
  const qs = q.toString(); redirect(`/admin/signup${qs ? `?${qs}` : ""}`);
}
