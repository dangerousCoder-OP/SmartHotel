import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLoyalty, redeemLoyalty } from "@/services/hotel";
import { Gift } from "lucide-react";
import "./loyalty.css";

export default function UserLoyaltyPage() {
  useEffect(() => {
    document.title = "Loyalty Points | Smart Hotel";
  }, []);
  const { auth } = useAuth();
  const [info, setInfo] = useState(null);
  const [redeem, setRedeem] = useState(100);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if auth and user are available
    if (!auth?.user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getLoyalty(auth.user.email)
      .then((data) => {
        setInfo(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch loyalty info:", err);
        setError("Failed to load loyalty information");
      })
      .finally(() => setLoading(false));
  }, [auth?.user?.email]);

  const canRedeem = (info?.available ?? 0) >= redeem && redeem >= 100;

  const onRedeem = async (e) => {
    e.preventDefault();
    if (!auth?.user?.email || !canRedeem) return;

    try {
      setError(null);
      const updated = await redeemLoyalty(auth.user.email, redeem);
      setInfo(updated);
      setRedeem(100);
    } catch (err) {
      setError(err?.message || "Failed to redeem points");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="user-loyalty-page">
        <header>
          <h1>Loyalty Points</h1>
          <p className="text-muted-foreground">
            Loading your loyalty information...
          </p>
        </header>
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch your loyalty points.</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (!auth?.user) {
    return (
      <div className="user-loyalty-page">
        <header>
          <h1>Loyalty Points</h1>
          <p className="text-muted-foreground">
            Please log in to view your loyalty points.
          </p>
        </header>
        <div className="empty-state">
          <h3>Authentication Required</h3>
          <p>You need to be logged in to view your loyalty points.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-loyalty-page">
      <header>
        <h1>Loyalty Points</h1>
        <p className="text-muted-foreground">
          Earn points on every booking and redeem for rewards.
        </p>
      </header>

      {/* Loyalty Overview */}
      <div className="loyalty-overview">
        <h2 className="loyalty-title">Your Loyalty Points</h2>
        <div className="loyalty-points">
          <div className="points-value">
            {info?.available ?? info?.points ?? 0}
          </div>
          <div className="points-label">Available Points</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="rewards-grid">
        <div className="reward-card">
          <div className="reward-header">
            <h3 className="reward-title">Total Earned</h3>
            <div className="reward-points">{info?.totalEarned ?? 0} pts</div>
          </div>
          <p className="reward-description">
            Total points earned from all your bookings
          </p>
        </div>

        <div className="reward-card">
          <div className="reward-header">
            <h3 className="reward-title">Total Redeemed</h3>
            <div className="reward-points">{info?.totalRedeemed ?? 0} pts</div>
          </div>
          <p className="reward-description">
            Points you've successfully redeemed
          </p>
        </div>
      </div>
      {/*
      {/* Redeem Form }
      <form onSubmit={onRedeem} className="redeem-form">
        <h2 className="form-title">
          <Gift className="star-icon filled" />
          Redeem Points
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Points to Redeem</label>
            <input
              className="form-input"
              type="number"
              min={100}
              step={1}
              max={info?.available ?? 0}
              value={redeem}
              onChange={(e) => setRedeem(Number(e.target.value))}
              placeholder="Minimum 100 points"
              required
            />
            <small className="text-muted-foreground">
              Conversion: 100 points = ₹100
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Reward Value</label>
            <input
              className="form-input"
              type="text"
              value={`₹${redeem}`}
              readOnly
            />
          </div>

          <div className="form-group">
            <button className="submit-button" disabled={!canRedeem}>
              Redeem Points
            </button>
          </div>
        </div>
      </form>
*/}
      {error && <div className="alert error">{error}</div>}

      {/* Points History */}
      <div className="rewards-section">
        <h2 className="form-title">Points History</h2>
        {info?.history && info.history.length > 0 ? (
          <div className="rewards-grid">
            {info.history.map((h) => (
              <div key={h.id} className="reward-card">
                <div className="reward-header">
                  <h3 className="reward-title capitalize">{h.type}</h3>
                  <div
                    className={`reward-points ${
                      h.type === "earned" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {h.type === "EARNED" ? "+" : "-"}
                    {h.points} pts
                  </div>
                </div>
                <p className="reward-description">{h.description}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(h.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No history yet</h3>
            <p>Your points activity will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
