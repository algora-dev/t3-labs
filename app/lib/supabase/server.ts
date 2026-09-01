/**
 * T3 LABS DEMO PORT — types-only stub of quotecore-plus `app/lib/supabase/server.ts`.
 *
 * The ported supplier pricing tool only imports TYPES from this module
 * (`Database`, `Tables`, `TablesInsert` via `app/lib/types.ts`). No runtime
 * Supabase client exists on the t3labs demo stack, so we re-export types from
 * the copied generated schema file without pulling in `@supabase/ssr`.
 */
import type { Database } from './database.types';

export type { Database };

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
