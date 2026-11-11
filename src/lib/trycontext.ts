// Instant try (no account): answers come from an in-memory page set, never from a workspace in the database.
import { AsyncLocalStorage } from "async_hooks";
import type { Page } from "./store-types";
export type TryCtx = { id: string; siteName: string; pages: Page[] };
const g = globalThis as unknown as { __wayloTry?: AsyncLocalStorage<TryCtx> };
const als = (g.__wayloTry ||= new AsyncLocalStorage<TryCtx>());
export const runWithTry = <T,>(ctx: TryCtx, fn: () => T): T => als.run(ctx, fn);
export const tryCtx = () => als.getStore();
