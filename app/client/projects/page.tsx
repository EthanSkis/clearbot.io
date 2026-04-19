import { requireUser } from '@/lib/auth/require';

export const metadata = { title: 'Projects · ClearBot Portal' };

export default async function ProjectsPage() {
  const { user, supabase } = await requireUser();
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, description, status, progress, next_milestone, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  return (
    <main>
      <h1 className="dash-title">Projects</h1>
      {error && <div className="dash-error">Couldn’t load projects: {error.message}</div>}
      {(!projects || projects.length === 0) && !error ? (
        <div className="dash-empty">No projects yet.</div>
      ) : (
        projects?.map((p) => (
          <div key={p.id} className="dash-card">
            <div className="meta">{p.status} · {p.progress}% complete</div>
            <h3>{p.name}</h3>
            {p.description && <p style={{ color: 'var(--cb-ink-dim)', marginBottom: 8 }}>{p.description}</p>}
            {p.next_milestone && <p style={{ color: 'var(--cb-ink-dim)', fontSize: 12 }}>Next: {p.next_milestone}</p>}
          </div>
        ))
      )}
    </main>
  );
}
