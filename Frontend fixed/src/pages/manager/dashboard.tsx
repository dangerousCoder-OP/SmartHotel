import { useEffect, useMemo, useState } from "react";
import "./manager.css";
import { useAuth } from "@/context/AuthContext";
import { getManagerBookings, getMyHotels } from "@/services/manager";
import type { ManagerHotel } from "@/services/manager";
import {
  Hotel,
  Calendar,
  DollarSign,
  Star,
  ChevronDown,
  MapPin,
} from "lucide-react";

export default function ManagerDashboardPage() {
  const { auth } = useAuth();
  // Initialize state with empty arrays for safety and cleaner code
  const [hotels, setHotels] = useState<ManagerHotel[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");

  useEffect(() => {
    document.title = "Dashboard | Manager Panel";
  }, []);

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    Promise.all([
      getMyHotels(auth.user.email),
      getManagerBookings(auth.user.email),
    ])
      .then(([hs, bs]) => {
        setHotels(Array.isArray(hs) ? hs : []);
        setBookings(Array.isArray(bs) ? bs : []);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setHotels([]);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [auth]);

  // Memoize hotel-related calculations for performance
  const hotelStats = useMemo(() => {
    const approved = hotels.filter(
      (h) => (h.status ?? "approved") === "approved"
    );
    const pending = hotels.filter((h) => h.status === "pending");
    const rejected = hotels.filter((h) => h.status === "rejected");
    const avgRating =
      hotels.length > 0
        ? hotels.reduce((sum, h) => sum + (h.rating || 0), 0) / hotels.length
        : 0;

    return { approved, pending, rejected, avgRating, total: hotels.length };
  }, [hotels]);

  // Memoize booking-related calculations for performance
  const bookingStats = useMemo(() => {
    const successful = bookings.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed" ||
        b.status === "paid"
    );
    const totalRevenue = successful.reduce((sum, b) => sum + (b.total || 0), 0);
    return { successful, totalRevenue };
  }, [bookings]);

  // Memoize the filtering logic for the hotel list for performance
  const filteredHotels = useMemo(() => {
    switch (selectedStatus) {
      case "approved":
        return hotelStats.approved;
      case "pending":
        return hotelStats.pending;
      case "rejected":
        return hotelStats.rejected;
      case "all":
      default:
        return hotels;
    }
  }, [selectedStatus, hotels, hotelStats]);

  if (loading) {
    return (
      <div className="manager-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch your dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-page manager-dashboard">
      <header>
        <h1>Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your hotels, bookings, and guest reviews.
        </p>
      </header>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="metric-header">
            <span className="metric-title">My Hotels</span>
            <div className="metric-icon">
              <Hotel size={16} />
            </div>
          </div>
          <div className="metric-value">{hotelStats.total}</div>
          <div className="metric-description">Total properties managed</div>
        </div>

        <div className="stat-card">
          <div className="metric-header">
            <span className="metric-title">Total Bookings</span>
            <div className="metric-icon">
              <Calendar size={16} />
            </div>
          </div>
          <div className="metric-value">{bookingStats.successful.length}</div>
          <div className="metric-description">All-time reservations</div>
        </div>

        <div className="stat-card">
          <div className="metric-header">
            <span className="metric-title">Revenue</span>
            <div className="metric-icon">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="metric-value">
            ₹{bookingStats.totalRevenue.toLocaleString()}
          </div>
          <div className="metric-description">Total earnings</div>
        </div>

        <div className="stat-card">
          <div className="metric-header">
            <span className="metric-title">Avg Rating</span>
            <div className="metric-icon">
              <Star size={16} />
            </div>
          </div>
          <div className="metric-value">{hotelStats.avgRating.toFixed(1)}</div>
          <div className="metric-description">Customer satisfaction</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <section>
        <h2 className="form-title">
          <Calendar size={20} />
          Recent Bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>
              Bookings will appear here once guests start reserving your hotels.
            </p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Hotel</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.userEmail}</td>
                    <td>{booking.hotelName}</td>
                    <td>{new Date(booking.checkin).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkout).toLocaleDateString()}</td>
                    <td>₹{booking.total}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Hotels Section */}
      <section>
        <div className="form-title-with-filter">
          <h2 className="form-title">
            <Hotel size={20} />
            My Hotels
          </h2>
          <div className="status-filter-dropdown">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as "all" | "approved" | "pending" | "rejected"
                )
              }
              className="status-filter-select"
            >
              <option value="all">All Hotels ({hotelStats.total})</option>
              <option value="approved">
                Approved ({hotelStats.approved.length})
              </option>
              <option value="pending">
                Pending ({hotelStats.pending.length})
              </option>
              <option value="rejected">
                Rejected ({hotelStats.rejected.length})
              </option>
            </select>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className="empty-state">
            <h3>No hotels yet</h3>
            <p>Add your first hotel to start managing bookings and reviews.</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="empty-state">
            <h3>No {selectedStatus} hotels</h3>
            <p>No hotels found for the selected status.</p>
          </div>
        ) : (
          <div className="hotels-grid">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="hotel-approval-card">
                <div className="hotel-image-placeholder">
                  <Hotel size={32} />
                  <span style={{ marginLeft: "0.5rem" }}>Hotel Image</span>
                </div>

                <div className="hotel-card-content">
                  <div className="hotel-header">
                    <div className="hotel-info">
                      <h3>{hotel.name}</h3>
                      <div className="location">
                        <MapPin size={14} />
                        {hotel.location}
                      </div>
                      <div className="rating">
                        <Star size={14} fill="currentColor" />
                        {hotel.rating?.toFixed(1) || "N/A"}
                      </div>
                    </div>
                    <div
                      className={`hotel-status ${hotel.status || "approved"}`}
                    >
                      {hotel.status || "approved"}
                    </div>
                  </div>

                  <div className="hotel-details">
                    <div className="hotel-detail-item">
                      <span className="hotel-detail-label">Total Rooms</span>
                      <span className="hotel-detail-value">
                        {hotel.rooms && typeof hotel.rooms === "object"
                          ? Object.values(hotel.rooms).reduce(
                              (sum: number, room: any) =>
                                sum + (room.available || 0),
                              0
                            )
                          : 0}
                      </span>
                    </div>
                    <div className="hotel-detail-item">
                      <span className="hotel-detail-label">Total Reviews</span>
                      <span className="hotel-detail-value">0</span>
                    </div>
                  </div>

                  <div className="hotel-amenities">
                    <div className="hotel-amenities-title">Amenities</div>
                    <div className="amenities-tags">
                      {Array.isArray(hotel.amenities) &&
                        hotel.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                      {Array.isArray(hotel.amenities) &&
                        hotel.amenities.length > 4 && (
                          <span className="amenity-tag">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
