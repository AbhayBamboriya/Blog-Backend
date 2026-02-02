import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../Helpers/axiosInstance";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if(e) e.preventDefault(); // Allows "Enter" key to work
    if (!email || !password) return;
    
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      console.log('res',res);
      
    //   localStorage.setItem("blog_token", res.data.token);
      localStorage.setItem("blog_user", JSON.stringify(res.data.user));
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>DevBlog</h2>
        <p className="login-subtitle">Sign in to your creator account</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            placeholder="you@example.com" 
            autoFocus
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="••••••••" 
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