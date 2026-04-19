import { requireTeam } from '@/lib/auth/require';
import { BookingsTable } from './bookings-table';

export const metadata = { title: 'Bookings · ClearBot Team' };
export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const { supabase } = await requireTeam();
  const { data: bookings, error } = await supabase
    .from('booking_requests')
    .select('id, name, email, company, focus, preferred_slot, preferred_slot_label, timezone, notes, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <main>
      <h1 className="dash-title">Bookings</h1>
      {error && <div className="dash-error">Couldn’t load bookings: {error.message}</div>}
      <BookingsTable initial={bookings || []} />
    </main>
  );
}
