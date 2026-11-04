import { redirect } from "next/navigation";
export default function S({ searchParams }: { searchParams: { plan?: string } }) { redirect(searchParams.plan ? `/admin/signup?plan=${encodeURIComponent(searchParams.plan)}` : "/admin/signup"); }
