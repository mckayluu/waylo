import { redirect } from "next/navigation";
import { currentSession } from "@/lib/auth";
import { AuthCard } from "../AuthCard";
import { ForgotForm } from "./ForgotForm";
export const dynamic = "force-dynamic";
export default async function Forgot() {
  if (await currentSession()) redirect("/admin");
  return <AuthCard title="Reset your password" sub="Enter the email you were invited with and we'll send a reset link."><ForgotForm /></AuthCard>;
}
