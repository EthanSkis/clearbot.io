import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { ProviderLookupSchema } from '@/lib/validation/auth';

// Wraps the auth_providers_for_email RPC so the login page can surface
// "looks like you signed up with GitHub" hints without exposing the RPC
// itself to the browser (which would also leak the list of providers
// for any arbitrary email to scrapers).
export async function POST(req: Request) {
  const parsed = ProviderLookupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ providers: [] });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.rpc('auth_providers_for_email', { p_email: parsed.data.email });
  if (error || !data) return NextResponse.json({ providers: [] });
  return NextResponse.json({ providers: Array.isArray(data) ? data : [] });
}
