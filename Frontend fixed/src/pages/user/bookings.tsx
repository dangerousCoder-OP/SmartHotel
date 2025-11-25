import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Booking } from '@/models/types';
import { listBookings } from '@/services/hotel';
import './bookings.css';

export default function UserBookingsPage() {
  useEffect(() => { document.title = 'My Bookings | Smart Hotel'; }, []);
  const { auth } = useAuth();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if auth and user are available
    if (!auth?.user?.email) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    listBookings(auth.user.email)
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [auth?.user?.email]);

  // Show loading state
  if (loading) {
    return (
      <div className="user-bookings-page">
        <header>
          <h1>My Bookings</h1>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </header>
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch your bookings.</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (!auth?.user) {
    return (
      <div className="user-bookings-page">
        <header>
          <h1>My Bookings</h1>
          <p className="text-muted-foreground">Please log in to view your bookings.</p>
        </header>
        <div className="empty-state">
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-bookings-page">
      <header>
        <h1>My Bookings</h1>
        <p className="text-muted-foreground">Track all your hotel reservations and booking history.</p>
      </header>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Start exploring and book your perfect stay!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {items.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div className="booking-header">
                <div className="booking-info">
                  <h3>{booking.hotelName}</h3>
                  <p>Booking ID: #{booking.id}</p>
                  <p>Room Type: {booking.roomType}</p>
                </div>
                <div className={`booking-status ${booking.status}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="booking-details">
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Check-in</span>
                  <span className="booking-detail-value">{new Date(booking.checkin).toLocaleDateString()}</span>
                </div>
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Check-out</span>
                  <span className="booking-detail-value">{new Date(booking.checkout).toLocaleDateString()}</span>
                </div>
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Nights</span>
                  <span className="booking-detail-value">{booking.nights}</span>
                </div>
                <div className="booking-detail-item">
                  <span className="booking-detail-label">Total Amount</span>
                  <span className="booking-detail-value booking-price">${booking.total}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
