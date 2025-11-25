import { useEffect, useState } from "react";
import "./admin.css";
// 1. IMPORT the services we need
import { getHotelsByStatus, getAllUsers } from "@/services/admin";
import { Hotel, Users, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminDashboardPage() {
  useEffect(() => {
    document.title = "Dashboard | Admin Panel";
  }, []);

  const [stats, setStats] = useState({
    totalHotels: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 2. Use Promise.all to fetch all data concurrently
        const [pendingHotels, approvedHotels, rejectedHotels, allUsers] =
          await Promise.all([
            getHotelsByStatus("pending"),
            getHotelsByStatus("approved"),
            getHotelsByStatus("rejected"),
            getAllUsers(),
          ]);

        const totalHotels =
          pendingHotels.length + approvedHotels.length + rejectedHotels.length;

        // 3. Set the state with the complete, accurate data
        setStats({
          totalHotels: totalHotels,
          approved: approvedHotels.length,
          pending: pendingHotels.length,
          rejected: rejectedHotels.length,
          totalUsers: allUsers.length,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage hotels, users, and system-wide operations.
        </p>
      </header>

      {error && <div className="alert error">{error}</div>}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Hotel Management</span>
            <div className="metric-icon">
              <Hotel size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.totalHotels}</div>
          <div className="metric-description">Total properties in system</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Pending Reviews</span>
            <div className="metric-icon">
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.pending}</div>
          <div className="metric-description">Hotels awaiting approval</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Approved Hotels</span>
            <div className="metric-icon">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.approved}</div>
          <div className="metric-description">Live properties</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Rejected Hotels</span>
            <div className="metric-icon">
              <XCircle size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.rejected}</div>
          <div className="metric-description">Declined applications</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">System Users</span>
            <div className="metric-icon">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{stats.totalUsers}</div>
          <div className="metric-description">Registered users</div>
        </div>
      </div>
    </div>
  );
}
