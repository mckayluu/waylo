import { redirect } from "next/navigation";
import { authEnabled } from "@/lib/session";
import { AuthCard } from "../AuthCard";
import { LoginForm } from "./LoginForm";
export const dynamic = "force-dynamic";
export default function Login({ searchParams }: { searchParams: { next?: string } }) {
  if (!authEnabled()) redirect("/admin");
  return <AuthCard title="Sign in to Waylo" sub="Owner: use the admin password. Members: your email and the password you set from your invite."><LoginForm next={searchParams.next || "/admin"} askEmail={!!process.env.WAYLO_ADMIN_EMAIL} /></AuthCard>;
}
