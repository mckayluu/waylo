import type { Config } from "tailwindcss";
// Raspberry Navy (refined) brand scales. Marketing pages use navy / rasp / warm.
// Admin (src/app/admin, `.ad` scope) uses navy / rasp / warm too; amber is kept for warnings only.
const navy = { 50: "#F3F6F9", 100: "#E8EEF3", 200: "#CBD7E3", 300: "#9FB3C8", 400: "#6F8AA8", 500: "#4A6789", 600: "#2F4F74", 700: "#163352", 800: "#12294A", 900: "#0F1C33", 950: "#0A1424" };
const rasp = { 50: "#FBF4F6", 100: "#F6E8EC", 200: "#F0CFD9", 300: "#E8A8B8", 400: "#D9708F", 500: "#C23E66", 600: "#A81B48", 700: "#8C1640", 800: "#701234", 900: "#560E28", 950: "#360818" };
const warm = { 50: "#F5F0EA", 100: "#EFE9E1", 200: "#E4DDD4", 300: "#D2C9BE", 400: "#A39A90", 500: "#6F665E", 600: "#5A534C", 700: "#45403A", 800: "#2D2925", 900: "#1A1714", 950: "#100E0C" };
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { navy, rasp, warm, blush: "#E8A8B8", paper: "#F5F0EA", card: "#FFFCF8", ink: "#1A1714", cream: "#D8D0C6" },
    fontFamily: { display: ["var(--font-display)", "Georgia", "serif"], brand: ["var(--font-ui)", "system-ui", "sans-serif"], plex: ["var(--font-mono)", "ui-monospace", "monospace"] },
  } },
  plugins: [],
} satisfies Config;
