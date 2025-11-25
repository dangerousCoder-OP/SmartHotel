import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/auth";
import { Home, UserPlus } from "lucide-react";
import "@/styles/auth.css";
import "./register.css";

type Role = "manager" | "user";

export default function Register() {
  useEffect(() => {
    document.title = "Register | Smart Hotel Management System";
  }, []);

  const navigate = useNavigate();

  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
  }>({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.role
      );
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        },
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-page register-page">
      <div className="auth-page-header">
        <Link to="/" className="home-link">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <section className="card auth-card">
        <h1 className="flex items-center gap-2">
          <UserPlus className="w-6 h-6" />
          Register
        </h1>
        <form className="form auth-form" onSubmit={onSubmit}>
          {/* Added Name Field */}
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Enter your full name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Create a password"
            />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={onChange} required>
              <option value="manager">Hotel Manager</option>
              <option value="user">Guest User</option>
            </select>
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <p>
          <Link to="/login" className="link">
            Already have an account? Login
          </Link>
        </p>
      </section>
    </main>
  );
}
