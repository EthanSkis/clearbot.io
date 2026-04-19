import { requireUser } from '@/lib/auth/require';
import { SettingsForm } from './settings-form';

export const metadata = { title: 'Settings · ClearBot Portal' };

export default async function SettingsPage() {
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user!.id).maybeSingle();

  return (
    <main>
      <h1 className="dash-title">Settings</h1>
      <p style={{ color: 'var(--cb-ink-dim)', marginBottom: 20, fontSize: 12 }}>Signed in as {user!.email}</p>
      <SettingsForm initial={profile || {}} />
    </main>
  );
}
