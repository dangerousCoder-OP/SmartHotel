import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login, Role } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { Home, LogIn, Eye, EyeOff } from "lucide-react";
import "@/styles/auth.css";
import "./login.css";

export default function Login() {
  useEffect(() => {
    document.title = "Login | Smart Hotel Management System";
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const st = location.state as {
      registered?: boolean;
      email?: string;
      role?: Role;
    } | null;
    if (st?.registered) {
      setMessage("Registration successful. Please log in.");
      setForm((p) => ({
        ...p,

        email: st.email ?? p.email,
      }));
    }
  }, [location.state]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await login(form.email.trim(), form.password, form.role);
      const hasAdmin = res.roles?.some((r) => r === "ROLE_ADMIN");
      const hasManager = res.roles?.some((r) => r === "ROLE_MANAGER");
      const role: Role = hasAdmin ? "admin" : hasManager ? "manager" : "user";
      const user = { email: res.username, role, name: res.username } as const;
      localStorage.setItem("token", res.jwtToken);
      signIn({ token: res.jwtToken, user });
      console.log("Login - After signIn, navigating to /app");
      navigate("/app", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-page">
      <div className="auth-page-header">
        <Link to="/" className="home-link">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <section className="card auth-card">
        <h1 className="flex items-center gap-2">
          <LogIn className="w-6 h-6" />
          Login
        </h1>
        <p className="muted" style={{ marginTop: 4 }}>
          Sign in to continue
        </p>
        <form className="form auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Password
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p>
          <Link to="/register" className="link">
            Need an account? Register
          </Link>
        </p>
      </section>
    </main>
  );
}
