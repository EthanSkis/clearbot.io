import { requireUser } from '@/lib/auth/require';

export const metadata = { title: 'Overview · ClearBot Portal' };

export default async function ClientDashboard() {
  // Layout already asserted the session + redirected team users.
  const { user, supabase } = await requireUser();
  const [{ data: projects }, { data: activity }, { data: unread }] = await Promise.all([
    supabase.from('projects').select('id, name, status, progress, next_milestone, updated_at').eq('user_id', user!.id).order('updated_at', { ascending: false }).limit(5),
    supabase.from('activity').select('id, text, project_name, created_at').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(6),
    supabase.from('message_threads').select('unread_count').eq('user_id', user!.id)
  ]);

  const totalUnread = (unread || []).reduce((n, t) => n + (t.unread_count || 0), 0);
  const name = user!.user_metadata?.full_name || user!.email?.split('@')[0] || 'there';

  return (
    <main>
      <h1 className="dash-title">Hi, {name}.</h1>
      <p style={{ color: 'var(--cb-ink-dim)', marginBottom: 24 }}>
        {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread === 1 ? '' : 's'}.` : 'Everything up to date.'}
      </p>

      <h2 style={{ fontFamily: 'var(--cb-mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cb-ink-dim)', margin: '16px 0 12px' }}>Active projects</h2>
      {!projects || projects.length === 0 ? (
        <div className="dash-empty">No projects yet. Book an intro call to get started.</div>
      ) : (
        projects.map((p) => (
          <div key={p.id} className="dash-card">
            <div className="meta">{p.status} · {p.progress}% complete</div>
            <h3>{p.name}</h3>
            {p.next_milestone && <p style={{ color: 'var(--cb-ink-dim)' }}>Next: {p.next_milestone}</p>}
          </div>
        ))
      )}

      <h2 style={{ fontFamily: 'var(--cb-mono)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cb-ink-dim)', margin: '32px 0 12px' }}>Recent activity</h2>
      {!activity || activity.length === 0 ? (
        <div className="dash-empty">No activity yet.</div>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {activity.map((a) => (
            <li key={a.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--cb-rule)', color: 'var(--cb-ink-dim)', fontSize: 12 }}>
              <span style={{ color: 'var(--cb-ink)' }}>{a.text}</span>
              {a.project_name && <span> · {a.project_name}</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
