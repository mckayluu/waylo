# Self-hosted brand fonts (Raspberry Navy rebrand)

Loaded with `next/font/local` in `src/app/layout.tsx`. No Google Fonts requests.

| File | Source | Notes |
|---|---|---|
| `Fraunces-Variable.woff2` | Fraunces variable (SIL OFL 1.1) | Display. Instanced to SOFT 18, WONK 0, wght 400–700, opsz kept. Latin subset. |
| `SourceSans3-Variable.woff2`, `SourceSans3-Italic-Variable.woff2` | Source Sans 3 (SIL OFL 1.1) | UI and body. wght 200–900. Latin subset. |
| `IBMPlexMono-Regular.woff2`, `IBMPlexMono-Medium.woff2` | IBM Plex Mono (SIL OFL 1.1) | Code and hex values. Latin subset. |

Built from `/workspace/waylo-launch/brand/fonts/src/faces/` with fontTools (`pyftsubset`, `varLib.instancer`).
