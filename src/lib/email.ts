// Transactional email via Resend (https://resend.com). Without RESEND_API_KEY we log the link and
// return { ok: true, sent: false, warning } so local/dev flows still work (admin UI shows "copy link").
export type EmailResult = { ok: boolean; sent: boolean; warning?: string; error?: string };
export const emailConfigured = () => !!process.env.RESEND_API_KEY;
export const DEFAULT_PUBLIC_URL = process.env.NODE_ENV === "production" ? "https://waylo-j5hv.onrender.com" : "http://localhost:3000";
export const publicUrl = () => (process.env.WAYLO_PUBLIC_URL || DEFAULT_PUBLIC_URL).replace(/\/$/, "");
export function emailStatus() {
  const key = process.env.RESEND_API_KEY || "", from = process.env.WAYLO_FROM_EMAIL || "";
  const issues: string[] = [];
  if (!key) issues.push("RESEND_API_KEY not set — invites/resets show a copy-link instead of emailing.");
  else if (!key.startsWith("re_")) issues.push("RESEND_API_KEY doesn't look like a Resend key (should start with re_).");
  if (key && (!from || /resend\.dev/.test(from))) issues.push("WAYLO_FROM_EMAIL uses onboarding@resend.dev — only delivers to your own Resend account email until you verify a domain.");
  return { configured: !!key, from: from || "Waylo <onboarding@resend.dev>", issues };
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
function layout(title: string, body: string, cta: string, link: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1c1917">
<p style="font-weight:700;color:#0f766e;font-size:18px;margin:0 0 16px">Waylo</p>
<h1 style="font-size:20px;margin:0 0 12px">${esc(title)}</h1>${body}
<p style="margin:24px 0"><a href="${esc(link)}" style="background:#0d9488;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">${esc(cta)}</a></p>
<p style="font-size:12px;color:#78716c">Or paste this link: ${esc(link)}</p></div>`;
}
async function send(to: string, subject: string, html: string, text: string, link: string): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn(`[waylo:email] RESEND_API_KEY not set — not sending "${subject}" to ${to}. Link: ${link}`); return { ok: true, sent: false, warning: "Email not configured — copy the link instead." }; }
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000), body: JSON.stringify({ from: process.env.WAYLO_FROM_EMAIL || "Waylo <onboarding@resend.dev>", to: [to], subject, html, text }) });
    if (!r.ok) {
      const e = await r.text().catch(() => ""); console.error(`[waylo:email] Resend ${r.status}: ${e}`);
      const hint = r.status === 401 || r.status === 403 ? (/domain/i.test(e) ? "sender domain not verified in Resend (or onboarding@resend.dev can only send to your own account email)" : "invalid RESEND_API_KEY")
        : r.status === 422 ? "invalid from/to address — check WAYLO_FROM_EMAIL" : r.status === 429 ? "Resend rate limit hit" : `Resend error ${r.status}`;
      return { ok: false, sent: false, error: `Email not sent: ${hint}. Copy the link instead.` };
    }
    return { ok: true, sent: true };
  } catch (e) { console.error("[waylo:email]", e); return { ok: false, sent: false, error: "Email failed — copy the link instead." }; }
}
export function sendInviteEmail(to: string, link: string, opts: { siteName: string; role: string; inviter?: string }) {
  const t = `You're invited to ${opts.siteName} on Waylo`;
  return send(to, t, layout(t, `<p>${esc(opts.inviter || "An owner")} invited you to join as <b>${esc(opts.role)}</b>. Choose a password to get started.</p>`, "Accept invite", link),
    `${t}\n\nYou were invited as ${opts.role}. Accept here: ${link}`, link);
}
export function sendPasswordResetEmail(to: string, link: string) {
  const t = "Reset your Waylo password";
  return send(to, t, layout(t, `<p>Someone asked to reset the password for ${esc(to)}. This link expires in 1 hour. If it wasn't you, ignore this email.</p>`, "Set a new password", link),
    `${t}\n\nSet a new password (expires in 1 hour): ${link}\n\nIf you didn't ask for this, ignore this email.`, link);
}
