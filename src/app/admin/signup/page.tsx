import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/session";
import { currentSession } from "@/lib/auth";
import { AuthCard } from "../AuthCard";
import { SignupForm } from "./SignupForm";
export const dynamic = "force-dynamic";
export const metadata = { title: "Create your Waylo workspace" };
export default async function Signup({ searchParams }: { searchParams: { plan?: string } }) {
  if (!authEnabled()) redirect("/admin");
  if (await currentSession()) redirect(searchParams.plan ? `/admin/billing?plan=${encodeURIComponent(searchParams.plan)}` : "/admin");
  return <AuthCard title="Create your workspace" sub="One workspace per company. You'll be the Owner and can invite your team after."><SignupForm plan={searchParams.plan} /></AuthCard>;
}
