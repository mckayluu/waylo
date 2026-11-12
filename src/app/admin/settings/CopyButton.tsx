"use client";
import { useState } from "react";
export function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }} className="text-xs font-medium text-navy-700 hover:underline">{ok ? "Copied ✓" : "Copy"}</button>;
}
