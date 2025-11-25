import { useEffect, useState } from "react";
import "./admin.css";
import { getAllUsers } from "@/services/admin";
import type { User } from "@/models/types";
import { Users, Search, Filter } from "lucide-react";

// Helper function to format role strings for display and CSS classes
const formatRole = (role: string) => {
  switch (role) {
    case "ROLE_ADMIN":
      return { className: "admin", displayName: "Admin" };
    case "ROLE_MANAGER":
      return { className: "manager", displayName: "Manager" };
    case "ROLE_USER":
      return { className: "user", displayName: "User" };
    default:
      return { className: "", displayName: role };
  }
};

export default function AdminUsersDetailsPage() {
  useEffect(() => {
    document.title = "Users Details | Admin Panel";
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Updated state type to match backend role values
  const [roleFilter, setRoleFilter] = useState<
    "all" | "ROLE_USER" | "ROLE_MANAGER" | "ROLE_ADMIN"
  >("all");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((userData) => {
        setUsers(userData);
        setFilteredUsers(userData);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role (this logic remains the same)
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const roleStats = getRoleStats();

  if (loading) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h3>Loading...</h3>
          <p>Please wait while we fetch user data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Users Details</h1>
        <p className="text-muted-foreground">
          Manage system users and their roles across the platform.
        </p>
      </header>

      {/* User Stats - Updated to use backend role keys */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-value">{users.length}</div>
          <div className="quick-stat-label">Total Users</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.ROLE_USER || 0}</div>
          <div className="quick-stat-label">Customers</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.ROLE_MANAGER || 0}</div>
          <div className="quick-stat-label">Managers</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{roleStats.ROLE_ADMIN || 0}</div>
          <div className="quick-stat-label">Admins</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Search Users</label>
            <input
              className="filter-input"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Filter by Role</label>
            {/* Updated select options to use backend role values */}
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as typeof roleFilter)
              }
            >
              <option value="all">All Roles</option>
              <option value="ROLE_USER">Users</option>
              <option value="ROLE_MANAGER">Managers</option>
              <option value="ROLE_ADMIN">Admins</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Results</span>
            <span className="hotel-detail-value">
              {filteredUsers.length} users
            </span>
          </div>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>No users match the current search and filter criteria.</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                // Use the helper to get display-friendly values
                const roleInfo = formatRole(user.role);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-role ${roleInfo.className}`}>
                        {roleInfo.displayName}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        user.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
