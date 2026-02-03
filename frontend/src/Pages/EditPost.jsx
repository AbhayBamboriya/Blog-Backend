import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Helpers/axiosInstance';
import "./CreatePost.css"; 

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        tags: "",
        status: "DRAFT"
    });
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    // --- Notification handler ---
    const triggerNotify = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), type === "error" ? 3000 : 2000);
    };

    // --- Helper to parse axios errors ---
    const parseAxiosError = (err) => {
        if (err.response) {
            // Server responded with a status
            if (err.response.data?.errors?.length) {
                return err.response.data.errors[0].msg; // validation errors
            }
            return err.response.data?.msg || err.response.data?.error || "Server error occurred";
        } else if (err.request) {
            // Request made but no response
            return "No response from server. Check your connection.";
        } else {
            return err.message || "Unexpected error occurred";
        }
    };

    // --- Fetch post data ---
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axiosInstance.get(`/posts/${id}`, { withCredentials: true });
                setForm({
                    title: data.title || "",
                    content: data.content || "",
                    tags: data.tags?.join(", ") || "",
                    status: data.status || "DRAFT"
                });
            } catch (err) {
                triggerNotify(parseAxiosError(err), "error");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // --- Handle form input changes ---
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- Handle update submission ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!form.title.trim() || !form.content.trim()) {
            triggerNotify("Title and content are required", "error");
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

            await axiosInstance.put(`/posts/edit/${id}`, payload, { withCredentials: true });

            triggerNotify("Story updated successfully! ✨", "success");

            // Slight delay so user sees toast
            setTimeout(() => navigate(`/post/${id}`), 1200);

        } catch (err) {
            triggerNotify(parseAxiosError(err), "error");
        } finally {
            setLoading(false);
        }
    };

    // --- Loading fallback ---
    if (loading) {
        return (
            <div className="post-detail-wrapper">
                <p style={{ textAlign: 'center' }}>Loading Editor...</p>
            </div>
        );
    }

    return (
        <div className="editor-wrapper">
            {/* --- Toast Notification --- */}
            {notification.show && (
                <div className={`toast-notification ${notification.type === 'error' ? 'delete' : 'success'}`}>
                    <span>{notification.type === 'error' ? '⚠️' : '✅'}</span>
                    {notification.message}
                </div>
            )}

            <div className="editor-container">
                <h2 className="post-detail-title" style={{ fontSize: '2.5rem' }}>Edit Story</h2>

                <form onSubmit={handleUpdate} style={{ marginTop: '30px' }} noValidate>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            className="title-input"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enlighten us with a new title..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            className="content-area"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Update your story..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input
                            name="tags"
                            className="comment-textarea"
                            style={{ height: 'auto', background: 'rgba(15, 23, 42, 0.5)' }}
                            value={form.tags}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="editor-footer">
                        <div className="select-wrapper">
                            <select
                                name="status"
                                className="select-status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="DRAFT">Save as Draft</option>
                                <option value="PUBLISHED">Publish Changes</option>
                            </select>
                        </div>
                        <button type="submit" className="comment-btn" disabled={loading}>
                            {loading ? "Updating..." : "Update Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
