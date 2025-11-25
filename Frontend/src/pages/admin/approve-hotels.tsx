import { useEffect, useState } from "react";
import "./admin.css";
import { getHotelsByStatus, approveHotel, rejectHotel } from "@/services/admin";
import type { AdminHotel } from "@/models/types";
import { Hotel, CheckCircle, X, Eye } from "lucide-react";

export default function AdminApproveHotelsPage() {
  useEffect(() => {
    document.title = "Approve Hotels | Admin Panel";
  }, []);

  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getHotelsByStatus(filter)
      .then((data) => {
        setHotels(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading hotels:", err);
        setError("Failed to load hotels");
        setHotels([]);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  const handleApprove = async (hotelId: number) => {
    setActionLoading(hotelId);
    setError("");
    try {
      await approveHotel(hotelId);
      // CORRECTED: Filter the hotel out of the local state
      setHotels(hotels.filter((h) => h.id !== hotelId));
    } catch (err) {
      setError("Failed to approve hotel");
      console.error("Approve error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (hotelId: number) => {
    setActionLoading(hotelId);
    setError("");
    try {
      await rejectHotel(hotelId);
      // CORRECTED: Filter the hotel out of the local state
      setHotels(hotels.filter((h) => h.id !== hotelId));
    } catch (err) {
      setError("Failed to reject hotel");
      console.error("Reject error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch hotel requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Approve Hotels</h1>
        <p className="text-muted-foreground">
          Review and manage hotel approval requests from managers.
        </p>
      </header>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Filter by Status</label>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Total Results</span>
            <span className="filter-count">
              {Array.isArray(hotels) ? hotels.length : 0} hotels
            </span>
          </div>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Hotels Grid */}
      {!Array.isArray(hotels) || hotels.length === 0 ? (
        <div className="empty-state">
          <h3>No hotels found</h3>
          <p>No hotels match the current filter criteria.</p>
        </div>
      ) : (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-approval-card">
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p>Manager: {hotel.managerEmail || "Unknown"}</p>
                </div>
                <div className={`hotel-status ${hotel.status}`}>
                  {hotel.status}
                </div>
              </div>

              <div className="hotel-details">
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Manager</span>
                  <span className="hotel-detail-value">
                    {hotel.managerEmail || "Unknown"}
                  </span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Amenities</span>
                  <span className="hotel-detail-value">
                    {Array.isArray(hotel.amenities)
                      ? hotel.amenities.slice(0, 3).join(", ")
                      : "None"}
                  </span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Room Types</span>
                  <span className="hotel-detail-value">
                    {hotel.rooms && typeof hotel.rooms === "object"
                      ? Object.keys(hotel.rooms).length
                      : 0}{" "}
                    types
                  </span>
                </div>
                <div className="hotel-detail-item">
                  <span className="hotel-detail-label">Submitted</span>
                  <span className="hotel-detail-value">
                    {new Date(
                      hotel.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="hotel-actions">
                {filter === "pending" && (
                  <>
                    <button
                      className="approve-button primary-button"
                      onClick={() => handleApprove(hotel.id)}
                      disabled={actionLoading === hotel.id}
                    >
                      <CheckCircle size={14} />
                      {actionLoading === hotel.id ? "Approving..." : "Approve"}
                    </button>
                    <button
                      className="reject-button secondary-button"
                      onClick={() => handleReject(hotel.id)}
                      disabled={actionLoading === hotel.id}
                    >
                      <X size={14} />
                      {actionLoading === hotel.id ? "Rejecting..." : "Reject"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
