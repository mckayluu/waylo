import { NextResponse } from "next/server";
import { getBilling, stripeConfigured } from "@/lib/stripe";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ configured: stripeConfigured(), ...(await getBilling()) }); }
