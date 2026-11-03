import { Pool } from "pg";
const g = globalThis as unknown as { __wayloPool?: Pool };
export const usePostgres = () => !!process.env.DATABASE_URL;
export function pool(): Pool {
  if (!g.__wayloPool) {
    const url = process.env.DATABASE_URL!;
    const local = /localhost|127\.0\.0\.1/.test(url) || /sslmode=disable/.test(url);
    g.__wayloPool = new Pool({ connectionString: url, max: Number(process.env.PG_POOL_MAX || 5), ssl: local ? undefined : { rejectUnauthorized: false } });
  }
  return g.__wayloPool;
}
export async function q<T = any>(text: string, params: unknown[] = []): Promise<T[]> { return (await pool().query(text, params)).rows as T[]; }
