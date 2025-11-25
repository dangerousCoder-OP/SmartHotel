import { NavLink } from 'react-router-dom';
import {
  Hotel,
  Search,
  Calendar,
  Star,
  CreditCard,
  Gift,
  BarChart3,
  Plus,
  MessageSquare,
  Users,
  CheckCircle,
  Settings,
  LogOut,
  ChevronLeft,
  Bell
} from 'lucide-react';
import '@/styles/sidebar.css';
 
export interface SidebarItem { key: string; label: string }
 
const menuIcons: Record<string, React.ComponentType<any>> = {
  'search': Search,
  'bookings': Calendar,
  'reviews': Star,
  'payments': CreditCard,
  'loyalty': Gift,
  'dashboard': BarChart3,
  'add-hotels-rooms': Plus,
  'review-reply': MessageSquare,
  'approve-hotels': CheckCircle,
  'users-details': Users,
};
 
export default function AppSidebar({
  menu,
  role,
  userName,
  onLogout,
}: {
  menu: ReadonlyArray<SidebarItem>
  role: string
  userName?: string
  onLogout: () => void
}) {
  return (
    <aside className="app-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Hotel />
          </div>
          <span className="sidebar-brand-text">Smart Hotel</span>
        </NavLink>
        <div className="sidebar-user-info">
          <span>{userName || 'Guest'}</span>
          <span className="user-role-badge">{role}</span>
        </div>
      </div>
 
      {/* Sidebar Content */}
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menu.map((item) => {
            const IconComponent = menuIcons[item.key] || BarChart3;
            return (
              <NavLink
                key={item.key}
                to={`/app/${item.key}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                end
              >
                <IconComponent className="sidebar-nav-icon" />
                <span className="sidebar-nav-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
 
      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-actions">
          <button className="sidebar-logout-btn text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
 