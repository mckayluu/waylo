import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const r: [string, number][] = [["/", 1], ["/features", 0.9], ["/use-cases", 0.9], ["/pricing", 0.9], ["/faq", 0.8], ["/docs", 0.8], ["/docs/install", 0.8], ["/docs/embed-modes", 0.7], ["/resources", 0.7], ["/solutions/marketing", 0.8], ["/solutions/sales", 0.8], ["/solutions/saas", 0.8], ["/solutions/agencies", 0.8], ["/demo", 0.6], ["/privacy", 0.3], ["/terms", 0.3]];
  return r.map(([p, priority]) => ({ url: `${SITE_URL}${p}`, lastModified: new Date(), changeFrequency: "weekly", priority }));
}
