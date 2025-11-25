import { useEffect, useState } from "react";
import "./manager.css";
import { useAuth } from "@/context/AuthContext";
import { getManagerReviews, replyToReview } from "@/services/manager";
import type { Review } from "@/models/types";
import { MessageSquare, Star } from "lucide-react";

export default function ManagerReviewReplyPage() {
  useEffect(() => {
    document.title = "Review Reply | Manager Panel";
  }, []);

  const { auth } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    getManagerReviews(auth.user.email)
      .then(setReviews)
      .catch(() => setError("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, [auth]);

  const onReply = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault();
    const replyText = replyTexts[reviewId];

    if (!auth || !reviewId || !replyText?.trim()) {
      setError("Please enter a reply message");
      return;
    }

    setReplyingTo(reviewId);
    setError("");

    try {
      console.log(
        "Sending reply for review:",
        reviewId,
        "with text:",
        replyText
      );

      const updatedReview = await replyToReview(reviewId, replyText.trim());

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? updatedReview : r))
      );

      setReplyTexts((prev) => ({ ...prev, [reviewId]: "" }));
    } catch (err: any) {
      console.error("Reply error:", err);
      setError(
        err?.response?.data?.error || "Failed to send reply. Please try again."
      );
    } finally {
      setReplyingTo(null);
    }
  };

  const handleReplyTextChange = (reviewId: string, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [reviewId]: text }));
    if (error) setError("");
  };

  if (loading) {
    return (
      <div className="manager-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-page">
      <header>
        <h1>Guest Reviews & Replies</h1>
        <p className="text-muted-foreground">
          Respond to guest reviews and maintain excellent customer
          relationships.
        </p>
      </header>

      {error && (
        <div className="alert error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h3>No guest reviews yet</h3>
          <p>
            Guest reviews for your hotels will appear here for you to respond
            to.
          </p>
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3>{review.hotelName}</h3>
                  <div className="guest-info">
                    <p>
                      <strong>Guest:</strong> {review.userEmail}
                    </p>
                    <p>
                      <strong>Review Date:</strong>{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="hotel-status approved">
                  <Star
                    size={16}
                    fill="currentColor"
                    style={{ marginRight: "0.25rem" }}
                  />
                  {review.rating}/5
                </div>
              </div>

              <div className="hotel-details">
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Guest Review</span>
                  <div className="guest-review-content">
                    <p className="hotel-detail-value">{review.comment}</p>
                  </div>
                </div>

                {Array.isArray(review.reply)
                  ? review.reply.map((r, idx) => (
                      <div
                        key={r.id ?? `${review.id}-reply-${idx}`}
                        className="hotel-detail-item manager-reply"
                      >
                        <span className="hotel-detail-label">Your Reply</span>
                        <div className="manager-reply-content">
                          <p className="hotel-detail-value">{r.text}</p>
                          <small className="reply-date">
                            Replied on:{" "}
                            {new Date(r.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    ))
                  : review.reply && (
                      <div className="hotel-detail-item manager-reply">
                        <span className="hotel-detail-label">Your Reply</span>
                        <div className="manager-reply-content">
                          <p className="hotel-detail-value">
                            {review.reply.text}
                          </p>
                          <small className="reply-date">
                            Replied on:{" "}
                            {new Date(
                              review.reply.createdAt
                            ).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    )}
              </div>

              {!review.reply && (
                <form
                  onSubmit={(e) => onReply(e, review.id)}
                  className="add-hotel-form"
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <h3 className="form-title">
                    <MessageSquare size={16} />
                    Reply to Review
                  </h3>
                  <div className="form-row-full">
                    <div className="form-group">
                      <label className="form-label">Your Reply</label>
                      <textarea
                        className="form-textarea"
                        value={replyTexts[review.id] || ""}
                        onChange={(e) =>
                          handleReplyTextChange(review.id, e.target.value)
                        }
                        placeholder="Thank you for your feedback. We appreciate your review..."
                        required
                        rows={4}
                      />
                      <small className="text-muted-foreground">
                        {replyTexts[review.id]?.length || 0} characters
                      </small>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <button
                        className="submit-button"
                        disabled={
                          replyingTo === review.id ||
                          !replyTexts[review.id]?.trim()
                        }
                        type="submit"
                      >
                        {replyingTo === review.id ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
