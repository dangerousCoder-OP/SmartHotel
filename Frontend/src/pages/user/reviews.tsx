import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addReview, listBookings, listReviews } from "@/services/hotel";
import { Star } from "lucide-react";
import "./reviews.css";

export default function UserReviewsPage() {
  useEffect(() => {
    document.title = "Reviews & Rating | Smart Hotel";
  }, []);

  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    bookingId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (!auth?.user?.email) {
      setFetchLoading(false);
      return;
    }

    setFetchLoading(true);
    setError(null);

    Promise.all([listBookings(auth.user.email), listReviews(auth.user.email)])
      .then(([bks, revs]) => {
        // Ensure arrays are always arrays
        const reviewsArray = Array.isArray(revs) ? revs : [];
        const bookingsArray = Array.isArray(bks) ? bks : [];

        setReviews(reviewsArray);

        // Filter bookings: only show PAID bookings that haven't been reviewed
        const reviewedBookingIds = new Set(
          reviewsArray.map((r) => r.bookingId)
        );
        const availableBookings = bookingsArray.filter(
          (b) => b.status === "paid" && !reviewedBookingIds.has(b.id)
        );

        setBookings(availableBookings);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError("Failed to load your bookings and reviews");
        setReviews([]);
        setBookings([]);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [auth?.user?.email]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!auth?.user?.email || !form.bookingId) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const booking = bookings.find((b) => b.id === form.bookingId);
    if (!booking) {
      setError("Selected booking not found");
      setLoading(false);
      return;
    }

    try {
      const res = await addReview({
        bookingId: booking.id,
        hotelId: booking.hotelId,
        rating: form.rating,
        comment: form.comment,
      });

      setReviews((prev) => [res, ...prev]);
      setBookings((prev) => prev.filter((b) => b.id !== form.bookingId));
      setForm({ bookingId: "", rating: 5, comment: "" });
      setSuccess(
        "Review submitted successfully! You earned 50 loyalty points."
      );
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if review has a reply
  const hasReply = (review) => {
    return !!(
      review.replyText ||
      review.reply?.text ||
      (review.reply && review.reply.text)
    );
  };

  // Helper function to get reply text
  const getReplyText = (review) => {
    return review.replyText || review.reply?.text || "";
  };

  // Helper function to get reply date
  const getReplyDate = (review) => {
    return review.replyCreatedAt || review.reply?.repliedAt || "";
  };

  // Helper function to get manager email
  const getManagerEmail = (review) => {
    return (
      review.replyManagerEmail || review.reply?.managerEmail || "Hotel Manager"
    );
  };

  // Show loading state
  if (fetchLoading) {
    return (
      <div className="user-reviews-page">
        <header>
          <h1>Reviews & Rating</h1>
          <p className="text-muted-foreground">Loading your reviews...</p>
        </header>
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch your reviews and bookings.</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (!auth?.user) {
    return (
      <div className="user-reviews-page">
        <header>
          <h1>Reviews & Rating</h1>
          <p className="text-muted-foreground">
            Please log in to view your reviews.
          </p>
        </header>
        <div className="empty-state">
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view and submit reviews.</p>
        </div>
      </div>
    );
  }

  const hasBookings = Array.isArray(bookings) && bookings.length > 0;

  return (
    <div className="user-reviews-page">
      <header>
        <h1>Reviews & Rating</h1>
        <p className="text-muted-foreground">
          Share your hotel experience and help other travelers.
        </p>
      </header>

      {error && <div className="alert error">{error}</div>}

      {success && <div className="alert success">{success}</div>}

      {/* Add Review Form */}
      <form onSubmit={submitReview} className="review-form">
        <h2 className="form-title">
          <Star className="star-icon filled" />
          Add New Review
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Select Hotel</label>
            <select
              className="form-select"
              name="bookingId"
              value={form.bookingId}
              onChange={onChange}
              required
              disabled={!hasBookings || loading}
            >
              <option value="">
                {hasBookings
                  ? "Select a hotel to review"
                  : "No available bookings to review"}
              </option>
              {hasBookings &&
                bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.hotelName} - {b.roomType} (
                    {new Date(b.checkin).toLocaleDateString()})
                  </option>
                ))}
            </select>
            {!hasBookings && (
              <small className="text-muted-foreground">
                You need completed bookings to write reviews. Book a hotel
                first!
              </small>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${
                    star <= form.rating ? "active" : ""
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                  disabled={loading}
                >
                  <Star
                    className={`star-icon ${
                      star <= form.rating ? "filled" : "empty"
                    }`}
                    fill={star <= form.rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
              <span className="rating-text">({form.rating}/5)</span>
            </div>
          </div>
        </div>

        <div className="form-row-full">
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              className="form-textarea"
              name="comment"
              value={form.comment}
              onChange={onChange}
              placeholder={
                hasBookings
                  ? "Share your experience with this hotel... (Minimum 10 characters)"
                  : "Complete a hotel booking to write reviews"
              }
              required
              minLength={10}
              disabled={!hasBookings || loading}
              rows={4}
            />
            <small className="text-muted-foreground">
              {form.comment.length}/10 characters minimum
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="submit-button"
            disabled={
              loading ||
              !form.bookingId ||
              !form.rating ||
              form.comment.length < 10
            }
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Submitting...
              </>
            ) : (
              `Submit Review + 50 Points`
            )}
          </button>
          <div className="points-notice">
            ✨ Earn 50 loyalty points for every review you submit!
          </div>
        </div>
      </form>

      {/* Reviews List */}
      <div className="reviews-list">
        <h2 className="form-title">Your Reviews ({reviews.length})</h2>

        {!Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="empty-state">
            <h3>No reviews yet</h3>
            <p>Your reviews will appear here after you submit them.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-info">
                    <h3>{review.hotelName}</h3>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`star-icon ${
                          star <= review.rating ? "filled" : "empty"
                        }`}
                        fill={star <= review.rating ? "currentColor" : "none"}
                        size={16}
                      />
                    ))}
                    <span className="rating-value">({review.rating}/5)</span>
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
                <div className="review-meta">
                  Review #{review.id} • {review.rating}/5 stars
                </div>

                {/* Manager's Reply Section */}
                {hasReply(review) && (
                  <div className="manager-reply">
                    <div className="reply-header">
                      <strong>Manager's Response</strong>
                      <span className="reply-manager">
                        by {getManagerEmail(review)}
                      </span>
                    </div>
                    <p className="reply-text">{getReplyText(review)}</p>
                    {getReplyDate(review) && (
                      <div className="reply-date">
                        Replied on{" "}
                        {new Date(getReplyDate(review)).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
