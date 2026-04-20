import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Narrow schema for the RPCs we actually call. Without this, createClient's
// default Schema has no Functions, so `admin.rpc('name', { ... })` resolves
// Args to `never` and TS rejects the arg object. Tables/Views stay
// permissive because we haven't generated full DB types yet.
type PermissiveTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};
type AdminDatabase = {
  public: {
    Tables: Record<string, PermissiveTable>;
    Views: Record<string, PermissiveTable>;
    Functions: {
      consume_access_code: {
        Args: { code_input: string };
        Returns: boolean;
      };
      verify_access_code: {
        Args: { code_input: string };
        Returns: boolean;
      };
      auth_providers_for_email: {
        Args: { p_email: string };
        Returns: string[];
      };
    };
  };
};

// Bypasses RLS. Only use inside route handlers / server actions that
// have already authenticated + authorized the caller.
let cached: ReturnType<typeof createClient<AdminDatabase>> | null = null;

export function getSupabaseAdmin() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Issue one from Supabase dashboard → Project Settings → API.'
    );
  }
  cached = createClient<AdminDatabase>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return cached;
}
