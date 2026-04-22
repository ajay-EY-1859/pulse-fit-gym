import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';

type BookingItem = {
  _id: string;
  classType: string;
  date: string;
};

export default function Booking() {
  const [form, setForm] = useState({ classType: 'Strength', date: '' });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [message, setMessage] = useState('');

  async function loadBookings() {
    try {
      const response = await api.get<BookingItem[]>('/book');
      setBookings(response.data);
    } catch {
      setBookings([]);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/book', form);
      setMessage('Class booked.');
      setForm({ classType: 'Strength', date: '' });
      loadBookings();
    } catch {
      setMessage('Please login before booking a class.');
    }
  }

  return (
    <main className="booking-page">
      <section className="booking-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Class booking</p>
          <h1>Reserve your spot</h1>
          <label>
            Class type
            <select value={form.classType} onChange={(event) => setForm({ ...form, classType: event.target.value })}>
              <option>Strength</option>
              <option>Boxing</option>
              <option>Mobility</option>
              <option>HIIT</option>
              <option>Hypertrophy</option>
            </select>
          </label>
          <label>
            Date
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
          </label>
          {message && <p className="form-message">{message}</p>}
          <button className="primary-button" type="submit">
            Book class
          </button>
        </form>
        <div className="booking-list">
          <p className="eyebrow">Your bookings</p>
          <h2>Upcoming sessions</h2>
          {bookings.length === 0 ? (
            <p>No bookings loaded yet.</p>
          ) : (
            bookings.map((booking) => (
              <article key={booking._id}>
                <strong>{booking.classType}</strong>
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
