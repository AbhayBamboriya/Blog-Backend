import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../Helpers/axiosInstance";
import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", tags: "", status: "DRAFT" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success', msg: '' }

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  if (e) e.preventDefault();
 
  
  if (!form.title || !form.content) {
    setNotification({ type: "error", msg: "Headline and story are required!" });
    return;
  }

  
  try {
    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : []

    };

  
    

    const res = await axiosInstance.post(
      "/posts/create",
      payload,
      { withCredentials: true }
    );
    
    setNotification({ type: "success", msg: "Post Published Successfully! ✅" });

    setTimeout(() => navigate("/"), 1500);

  } catch (err) {
    console.error("Create post error:", err);

    let message = "Something went wrong";

    if (err.response) {
      // Server responded with status
      const status = err.response.status;

      if (status === 400) {
        message = err.response.data?.msg || "Invalid input data";
      } 
      else if (status === 401) {
        message = "Please login again";
      } 
      else if (status === 403) {
        message = "You are not allowed to do this";
      } 
      else if (status === 404) {
        message = "API endpoint not found";
      } 
      else if (status >= 500) {
        message = "Server error. Try again later";
      }

      // express-validator errors
      if (err.response.data?.errors?.length) {
        message = err.response.data.errors[0].msg;
      }

    } else if (err.request) {
      // No response from server
      message = "Network error. Check your connection";
    } else {
      // Something else happened
      message = err.message;
    }

    setNotification({ type: "error", msg: message });

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="editor-wrapper">
      {/* --- Notification Toast --- */}
      {notification && (
        <div className="toast-container">
          <div className={`toast ${notification.type === 'error' ? 'error' : ''}`}>
             {notification.type === 'success' ? '🚀' : '⚠️'} {notification.msg}
          </div>
        </div>
      )}

      <div className="editor-container">
        <div className="editor-header-nav">
          <Link to="/" className="back-link">
             <span>←</span> Dashboard
          </Link>
          <div className="role-badge" style={{fontSize: '10px', opacity: 0.6}}>AUTO-SAVING ENABLED</div>
        </div>

        <h2>New Story</h2>

        <form onSubmit={handleSubmit} style={{marginTop: '40px'}} noValidate>
          {/* ... Title Input ... */}
          <div className="form-group">
            <input
              className="title-input"
              name="title"
              placeholder="Enter headline..."
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {/* ... Content Area ... */}
          <div className="form-group">
            <textarea
              className="content-area"
              name="content"
              placeholder="Tell your story..."
              value={form.content}
              onChange={handleChange}
            />
            <div style={{textAlign: 'right', fontSize: '12px', color: '#475569', marginTop: '8px'}}>
              {form.content.length} characters
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              className="tags-input"
              name="tags"
              placeholder="tech, lifestyle, tutorial..."
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div className="editor-footer">
            <div className="select-wrapper">
              <label style={{fontSize: '13px', fontWeight: '600', color: '#64748b'}}>Status:</label>
              <select className="select-status" name="status" value={form.status} onChange={handleChange}>
                <option value="DRAFT">Save as Draft</option>
                <option value="PUBLISHED">Ready to Publish</option>
              </select>
            </div>

            <button type="submit" className="publish-btn" disabled={loading}>
              {loading ? "Working..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;