import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Payment } from '@/models/types';
import { listPayments } from '@/services/hotel';
import './payments.css';

export default function UserPaymentsPage() {
  useEffect(() => { document.title = 'Payments | Smart Hotel'; }, []);
  const { auth } = useAuth();
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if auth and user are available
    if (!auth?.user?.email) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    listPayments(auth.user.email)
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch payments:', err);
        setError('Failed to load payments');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [auth?.user?.email]);

  // Show loading state
  if (loading) {
    return (
      <div className="user-payments-page">
        <header>
          <h1>Payment Details</h1>
          <p className="text-muted-foreground">Loading your payment history...</p>
        </header>
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch your payments.</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (!auth?.user) {
    return (
      <div className="user-payments-page">
        <header>
          <h1>Payment Details</h1>
          <p className="text-muted-foreground">Please log in to view your payments.</p>
        </header>
        <div className="empty-state">
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your payments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-payments-page">
      <div className="payments-header">
        <h1 className="payments-title">Payment Details</h1>
        <p className="payments-subtitle">View all your payment transactions and billing history.</p>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No payments yet</h3>
          <p>Your payment history will appear here once you make a booking.</p>
        </div>
      ) : (
        <div className="payments-grid">
          {items.map((payment) => (
            <article className="payment-card" key={payment.id}>
              <div className="payment-header">
                <div className="payment-info">
                  <h3>Payment #{payment.id}</h3>
                  <p>Transaction Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                  <p>Time: {new Date(payment.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="payment-status completed">
                  Completed
                </div>
              </div>
              
              <div className="payment-details">
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Payment Method</span>
                  <span className="payment-detail-value">
                    <span className="payment-method">{payment.method.toUpperCase()}</span>
                  </span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Booking ID</span>
                  <span className="payment-detail-value">#{payment.bookingId}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Transaction ID</span>
                  <span className="payment-detail-value">TXN{payment.id}</span>
                </div>
                <div className="payment-detail-item">
                  <span className="payment-detail-label">Amount Paid</span>
                  <span className="payment-detail-value payment-amount">${payment.amount}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
