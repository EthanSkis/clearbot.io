import { requireUser } from '@/lib/auth/require';

export const metadata = { title: 'Invoices · ClearBot Portal' };

function money(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function InvoicesPage() {
  const { user, supabase } = await requireUser();
  const { data: items, error } = await supabase
    .from('invoices')
    .select('id, number, project_name, amount_cents, issued_at, due_at, paid_at, status, pdf_url')
    .eq('user_id', user!.id)
    .order('issued_at', { ascending: false });

  return (
    <main>
      <h1 className="dash-title">Invoices</h1>
      {error && <div className="dash-error">Couldn’t load invoices: {error.message}</div>}
      {(!items || items.length === 0) && !error ? (
        <div className="dash-empty">No invoices yet.</div>
      ) : (
        items?.map((inv) => (
          <div key={inv.id} className="dash-card">
            <div className="meta">{inv.project_name || ''} · {inv.status || ''}{inv.due_at ? ` · due ${new Date(inv.due_at).toLocaleDateString()}` : ''}</div>
            <h3>{inv.number || 'Invoice'} · {money(inv.amount_cents || 0)}</h3>
            {inv.pdf_url && (
              <a className="secondary-btn" href={inv.pdf_url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                Download PDF
              </a>
            )}
          </div>
        ))
      )}
    </main>
  );
}
