import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Suspense, useEffect, useMemo, lazy } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import "@/styles/dashboard.css";
const UserSearchPage = lazy(() => import("@/pages/user/search"));
const UserBookingsPage = lazy(() => import("@/pages/user/bookings"));
const UserPaymentsPage = lazy(() => import("@/pages/user/payments"));
const UserReviewsPage = lazy(() => import("@/pages/user/reviews"));
const UserLoyaltyPage = lazy(() => import("@/pages/user/loyalty"));
const ManagerDashboardPage = lazy(() => import("@/pages/manager/dashboard"));
const ManagerAddHotelPage = lazy(() => import("@/pages/manager/add-hotel"));
const ManagerReviewReplyPage = lazy(
  () => import("@/pages/manager/review-reply")
);
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard"));
const AdminApproveHotelsPage = lazy(
  () => import("@/pages/admin/approve-hotels")
);
const AdminUsersDetailsPage = lazy(() => import("@/pages/admin/users-details"));
const menuByRole = {
  user: [
    { key: "search", label: "Search" },
    { key: "bookings", label: "Bookings" },
    { key: "reviews", label: "Reviews & Rating" },
    { key: "payments", label: "Payment Details" },
    { key: "loyalty", label: "Loyalty Points" },
  ],
  manager: [
    { key: "dashboard", label: "Dashboard" },
    { key: "add-hotels-rooms", label: "Add Hotels & Rooms" },
    { key: "review-reply", label: "Review Reply" },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard" },
    { key: "approve-hotels", label: "Approve Hotels" },
    { key: "users-details", label: "Users Details" },
  ],
} as const;

type SectionKey = (typeof menuByRole)[keyof typeof menuByRole][number]["key"];

export default function AppDashboard() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams<{ section?: SectionKey }>();

  const role = auth?.user?.role ?? "user";
  console.log("Dashboard - Auth state:", auth);
  console.log("Dashboard - User role:", role);
  const menu = menuByRole[role];
  const allowed = useMemo(() => new Set(menu.map((m) => m.key)), [menu]);
  const current = (section as SectionKey) || (menu[0]?.key as SectionKey);

  useEffect(() => {
    if (!section) navigate(`/app/${menu[0].key}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, menu]);

  useEffect(() => {
    if (section && !allowed.has(section))
      navigate(`/app/${menu[0].key}`, { replace: true });
  }, [section, allowed, navigate, menu]);

  useEffect(() => {
    const label =
      menu.find((m) => m.key === current)?.label || (menu[0]?.label ?? "");
    const roleName = role.charAt(0).toUpperCase() + role.slice(1);
    document.title = `${label} | ${roleName} Panel`;
  }, [current, menu, role]);

  const page = menu.find((m) => m.key === current) || menu[0];

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <AppSidebar
        menu={menu}
        role={role}
        userName={auth?.user?.email}
        onLogout={handleLogout}
      />
      <main className="app-main">
        <div className="page-header">
          <h1>{page.label}</h1>
        </div>
        <Suspense
          fallback={
            <section className="card" style={{ margin: 0 }}>
              <p className="muted">Loading…</p>
            </section>
          }
        >
          {role === "user" ? (
            current === "search" ? (
              <UserSearchPage />
            ) : current === "bookings" ? (
              <UserBookingsPage />
            ) : current === "payments" ? (
              <UserPaymentsPage />
            ) : current === "reviews" ? (
              <UserReviewsPage />
            ) : current === "loyalty" ? (
              <UserLoyaltyPage />
            ) : (
              <section className="card" style={{ margin: 0 }}>
                <p className="muted">Select a page from the sidebar.</p>
              </section>
            )
          ) : role === "manager" ? (
            current === "dashboard" ? (
              <ManagerDashboardPage />
            ) : current === "add-hotels-rooms" ? (
              <ManagerAddHotelPage />
            ) : current === "review-reply" ? (
              <ManagerReviewReplyPage />
            ) : (
              <section className="card" style={{ margin: 0 }}>
                <p className="muted">Select a page from the sidebar.</p>
              </section>
            )
          ) : role === "admin" ? (
            current === "dashboard" ? (
              <AdminDashboardPage />
            ) : current === "approve-hotels" ? (
              <AdminApproveHotelsPage />
            ) : current === "users-details" ? (
              <AdminUsersDetailsPage />
            ) : (
              <section className="card" style={{ margin: 0 }}>
                <p className="muted">Select a page from the sidebar.</p>
              </section>
            )
          ) : (
            <section className="card" style={{ margin: 0 }}>
              <p className="muted">
                This section is under construction for {role}.
              </p>
            </section>
          )}
        </Suspense>
      </main>
    </div>
  );
}
