import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/session";
import { currentSession } from "@/lib/auth";
import { AuthCard } from "../AuthCard";
import { SignupForm } from "./SignupForm";
import { getTry } from "@/lib/trysession";
export const dynamic = "force-dynamic";
export const metadata = { title: "Create your Waylo workspace" };
export default async function Signup({ searchParams }: { searchParams: { plan?: string; try?: string } }) {
  if (!authEnabled()) redirect("/admin");
  if (await currentSession()) redirect(searchParams.plan ? `/admin/billing?plan=${encodeURIComponent(searchParams.plan)}` : "/admin");
  const t = getTry(searchParams.try); const tried = t?.status === "done" ? { id: t.id, siteName: t.siteName, url: t.url, host: t.host, pages: t.pages.length } : undefined;
  return <AuthCard title="Create your workspace" sub="One workspace per company. You'll be the Owner and can invite your team after."><SignupForm plan={searchParams.plan} tried={tried} /></AuthCard>;
}
