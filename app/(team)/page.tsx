import { requireTeam } from '@/lib/auth/require';

export const metadata = { title: 'Team · ClearBot' };

export default async function TeamHome() {
  const { supabase } = await requireTeam();
  const { count: newBookings } = await supabase
    .from('booking_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  const { count: activeProjects } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'completed');

  return (
    <main>
      <h1 className="dash-title">Team console</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div className="dash-card">
          <div className="meta">Booking inbox</div>
          <h3>{newBookings ?? 0} new</h3>
          <a className="secondary-btn" href="/bookings" style={{ marginTop: 10 }}>Review</a>
        </div>
        <div className="dash-card">
          <div className="meta">Active projects</div>
          <h3>{activeProjects ?? 0}</h3>
        </div>
      </div>
    </main>
  );
}
