import { BookingForm } from './booking-form';

export const metadata = { title: 'Book intro · ClearBot' };

export default function BookPage() {
  return (
    <div className="stage stage--book">
      <svg className="ghost-logo" aria-hidden="true">
        <use href="#clearbot-logo" />
      </svg>

      <section className="card" aria-labelledby="book-title">
        <BookingForm />
      </section>
    </div>
  );
}
