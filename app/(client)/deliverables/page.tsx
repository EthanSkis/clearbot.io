import { requireUser } from '@/lib/auth/require';

export const metadata = { title: 'Deliverables · ClearBot Portal' };

export default async function DeliverablesPage() {
  const { user, supabase } = await requireUser();
  const { data: items, error } = await supabase
    .from('deliverables')
    .select('id, project_name, name, file_type, size_label, status, version, url, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  return (
    <main>
      <h1 className="dash-title">Deliverables</h1>
      {error && <div className="dash-error">Couldn’t load deliverables: {error.message}</div>}
      {(!items || items.length === 0) && !error ? (
        <div className="dash-empty">No deliverables yet.</div>
      ) : (
        items?.map((d) => (
          <div key={d.id} className="dash-card">
            <div className="meta">{d.project_name || 'General'} · {d.file_type || 'asset'} · {d.size_label || ''} · {d.status || ''} · v{d.version || '1'}</div>
            <h3>{d.name}</h3>
            {d.url && (
              <a className="secondary-btn" href={d.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                Download
              </a>
            )}
          </div>
        ))
      )}
    </main>
  );
}
