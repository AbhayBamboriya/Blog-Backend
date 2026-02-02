import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'; 
import axiosInstance from '../Helpers/axiosInstance';

const WelcomeHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('blog_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = async () => {
    console.log('skss');
    
    try {
      const res=await axiosInstance.post("/auth/logout");
      console.log('sds',res);
      
      localStorage.removeItem("blog_user");
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  // --- GUEST VIEW ---
  if (!user) {
    return (
      <div className="welcome-container">
        <div style={{ textAlign: 'center', maxWidth: '50rem', padding: '0 2rem' }}>
          <span className="role-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>New Version 2.0</span>
          <h1 className="hero-title">Create. Read. <span className="highlight">Inspire.</span></h1>
          <p className="subtitle">The modern home for developers and storytellers. Join our community of over 10k+ writers today.</p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/feed" className="btn btn-outline">Explore Articles</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="auth-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="logo" style={{ color: '#3b82f6', fontSize: '1.8rem', marginBottom: '3rem', fontWeight: '900' }}>DevBlog</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <Link to="/feed" className="action-link" style={{ color: '#fff' }}>🏠 Dashboard</Link>
          <Link to="/my-posts" className="action-link" style={{ color: '#94a3b8' }}>📄 Create Post</Link>
          {/* <Link to="/profile" className="action-link" style={{ color: '#94a3b8' }}>👤 Profile</Link> */}
        </nav>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-nav">
          <div>
         
            <h1 className="user-greet">Hey, {user.name}!</h1>
          </div>
          <span className="role-badge">{user.role} Account</span>
        </header>

        <div className="grid-layout">
          {/* Always show Feed */}
          <div className="card">
            <h3 className="card-title" style={{ color: '#60a5fa' }}>Explore Feed</h3>
            <p className="card-text">Discover trending articles from the community and get inspired.</p>
            <Link to="/feed" className="action-link highlight">Browse Now →</Link>
          </div>

          {/* Writer/Admin Card */}
          {(user.role === 'WRITER' || user.role === 'ADMIN') && (
            <div className="card">
              <h3 className="card-title" style={{ color: '#c084fc' }}>New Article</h3>
              <p className="card-text">Share your thoughts, tutorials, or updates with your readers.</p>
              <Link to="/my-posts" className="action-link" style={{ color: '#c084fc' }}>Start Writing →</Link>
            </div>
          )}

       
        </div>
      </main>
    </div>
  );
};

export default WelcomeHome;