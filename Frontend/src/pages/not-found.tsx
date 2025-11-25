import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: non-existent route", location.pathname);
    document.title = "404 Not Found | Smart hotel management system";
  }, [location.pathname]);

  return (
    <main className="container">
      <section className="card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p className="muted">Oops! Page not found</p>
        <p>
          <Link to="/" className="link">Return to Home</Link>
        </p>
      </section>
    </main>
  );
};

export default NotFound;

