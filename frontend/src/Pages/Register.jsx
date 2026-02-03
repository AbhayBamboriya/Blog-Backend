import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Helpers/axiosInstance";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);
      await axiosInstance.post("/auth/register", form);
      alert("Registered Successfully ✅");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="register-subtitle">Join the DevBlog community today</p>
        
        <form onSubmit={handleRegister} className="form-grid" noValidate>
  <div className="input-group">
    <label>Full Name</label>
    <input
      name="name"
      placeholder="John Doe"
      value={form.name}
      onChange={handleChange}
    />
  </div>

  <div className="input-group">
    <label>Email Address</label>
    <input
      name="email"
      type="email"
      placeholder="john@example.com"
      value={form.email}
      onChange={handleChange}
    />
  </div>

  <div className="input-group">
    <label>Password</label>
    <input
      name="password"
      type="password"
      placeholder="••••••••"
      value={form.password}
      onChange={handleChange}
    />
  </div>

  {/* ✅ Role Select */}
  <div className="input-group">
    <label>Role</label>
    <select
      name="role"
      value={form.role}
      onChange={handleChange}
    >
      <option value="USER">User</option>
      <option value="ADMIN">Admin</option>
    </select>
  </div>

  <button className="register-button" type="submit" disabled={loading}>
    {loading ? "Creating Account..." : "Register"}
  </button>
</form>


        <p className="register-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;