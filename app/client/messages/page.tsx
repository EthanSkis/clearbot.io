import { requireUser } from '@/lib/auth/require';

export const metadata = { title: 'Messages · ClearBot Portal' };

export default async function MessagesPage() {
  const { user, supabase } = await requireUser();
  const { data: threads, error } = await supabase
    .from('message_threads')
    .select('id, title, preview, project_name, unread_count, status, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  return (
    <main>
      <h1 className="dash-title">Messages</h1>
      {error && <div className="dash-error">Couldn’t load threads: {error.message}</div>}
      {(!threads || threads.length === 0) && !error ? (
        <div className="dash-empty">No messages yet.</div>
      ) : (
        threads?.map((t) => (
          <div key={t.id} className="dash-card">
            <div className="meta">
              {t.project_name || 'General'}
              {t.unread_count ? ` · ${t.unread_count} unread` : ''}
              {' · '}
              {new Date(t.updated_at).toLocaleDateString()}
            </div>
            <h3>{t.title}</h3>
            {t.preview && <p style={{ color: 'var(--cb-ink-dim)', fontSize: 13 }}>{t.preview}</p>}
          </div>
        ))
      )}
      <p style={{ color: 'var(--cb-ink-faint)', fontSize: 11, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
        Thread detail + inline reply: POST /api/messages → returns message row; see app/api/messages/route.ts.
      </p>
    </main>
  );
}
