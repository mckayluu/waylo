import { AuthCard } from "../AuthCard";
import { ForgotForm } from "./ForgotForm";
export const dynamic = "force-dynamic";
export default function Forgot() {
  return <AuthCard title="Reset your password" sub="Enter the email you were invited with and we'll send a reset link."><ForgotForm /></AuthCard>;
}
