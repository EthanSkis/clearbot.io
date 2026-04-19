import { BookingForm } from './booking-form';

export const metadata = { title: 'Book an intro · ClearBot' };

export default function BookPage() {
  return (
    <article className="auth-card panel" style={{ maxWidth: 560 }}>
      <span className="bracket bracket-tl" />
      <span className="bracket bracket-br" />
      <h1 className="auth-title">
        <em>Book a</em> 30-minute intro.
      </h1>
      <p className="auth-sub">
        We’ll walk through what you need, show sample work in your brand, and send a fixed monthly number — no hourly billing, ever.
      </p>
      <BookingForm />
    </article>
  );
}
