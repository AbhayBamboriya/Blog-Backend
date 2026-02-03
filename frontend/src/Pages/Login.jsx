import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../Helpers/axiosInstance";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();

  // --- Toast notification ---
  const triggerNotify = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2500);
  };

  // --- Parse axios errors ---
  const parseAxiosError = (err) => {
    if (err.response) {
      return err.response.data?.msg || err.response.data?.message || "Server error occurred";
    } else if (err.request) {
      return "No response from server. Check your network.";
    } else {
      return err.message || "Unexpected error occurred";
    }
  };

  // --- Login handler ---
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // --- Frontend validation ---
    if (!email.trim() || !password.trim()) {
      triggerNotify("Email and password are required");
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerNotify("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/auth/login", { email, password }, { withCredentials: true });

      // Store user data (avoid storing token in localStorage for security if possible)
      localStorage.setItem("blog_user", JSON.stringify(res.data.user));
      triggerNotify("Login successful ✅", "success");

      setTimeout(() => navigate("/"), 800); // slight delay for toast visibility

    } catch (err) {
      triggerNotify(parseAxiosError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* --- Toast Notification --- */}
      {notification.show && (
        <div className={`toast-notification ${notification.type === 'error' ? 'delete' : 'success'}`}>
          <span>{notification.type === 'error' ? '⚠️' : '✅'}</span>
          {notification.message}
        </div>
      )}

      <form className="login-card" onSubmit={handleLogin} noValidate>
        <h2>DevBlog</h2>
        <p className="login-subtitle">Sign in to your creator account</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="text" // use text to disable native email tooltip
            placeholder="you@example.com" 
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <button 
          type="submit"
          className={`login-button ${loading ? 'loading' : ''}`} 
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <p className="login-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
