// SSRF guard for user-supplied crawl URLs: the host must resolve only to public addresses.
import { lookup } from "dns/promises";
const PRIVATE4 = [/^10\./, /^127\./, /^0\./, /^169\.254\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^22[4-9]\./, /^2[3-5]\d\./];
const isPrivate = (ip: string) => ip.includes(":") ? /^(::1?$|fc|fd|fe80|::ffff:(10|127|192\.168|169\.254)\.)/i.test(ip) : PRIVATE4.some((r) => r.test(ip));
export async function assertPublicUrl(raw: string): Promise<URL> {
  let u: URL; try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch { throw new Error("That doesn't look like a website address."); }
  if (!/^https?:$/.test(u.protocol) || u.username || u.password) throw new Error("Use an http(s) website address.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard web ports can be crawled.");
  const h = u.hostname.toLowerCase();
  if (!h.includes(".") || /\.(local|internal|localhost)$/.test(h) || h === "localhost") throw new Error("Private/local URLs can't be crawled.");
  let addrs: { address: string }[] = [];
  try { addrs = await lookup(h, { all: true }); } catch { throw new Error(`We couldn't find ${h}. Check the address.`); }
  if (!addrs.length || addrs.some((a) => isPrivate(a.address))) throw new Error("Private/local URLs can't be crawled.");
  return u;
}
