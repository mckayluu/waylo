export const WAYLO_URL = (process.env.NEXT_PUBLIC_WAYLO_URL || process.env.RENDER_EXTERNAL_URL || "https://waylo-j5hv.onrender.com").replace(/\/$/, "");
export const snippet = (site = "default") => `<script src="${WAYLO_URL}/waylo.js" data-site="${site}" async></script>`;
