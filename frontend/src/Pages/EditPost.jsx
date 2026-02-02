import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../Helpers/axiosInstance';
import "./CreatePost.css"; 

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", content: "", tags: "", status: "DRAFT" });
    const [loading, setLoading] = useState(true);
    
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const triggerNotify = (message, type = "success") => {
        setNotification({ show: true, message, type });
        
        if (type === "error") {
            setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await axiosInstance.get(`/posts/${id}`);
                setForm({
                    title: data.title,
                    content: data.content,
                    tags: data.tags.join(", "), 
                    status: data.status
                });
            } catch (err) {
                triggerNotify("Failed to load post data", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/posts/edit/${id}`, {
                ...form,
                tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
            }, { withCredentials: true });

            triggerNotify("Story updated successfully! ✨", "success");

            // Delay navigation slightly so the user sees the toast
            setTimeout(() => {
                navigate(`/post/${id}`);
            }, 1200);
            
        } catch (err) {
            triggerNotify("Update failed. Please try again.", "error");
        }
    };

    if (loading) return <div className="post-detail-wrapper"><p style={{textAlign: 'center'}}>Loading Editor...</p></div>;

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
                <h2 className="post-detail-title" style={{fontSize: '2.5rem'}}>Edit Story</h2>
                
                <form onSubmit={handleUpdate} style={{marginTop: '30px'}}>
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
                            style={{height: 'auto', background: 'rgba(15, 23, 42, 0.5)'}} 
                            value={form.tags} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="editor-footer">
                        <div className="select-wrapper">
                            <select name="status" className="select-status" value={form.status} onChange={handleChange}>
                                <option value="DRAFT">Save as Draft</option>
                                <option value="PUBLISHED">Publish Changes</option>
                            </select>
                        </div>
                        <button type="submit" className="comment-btn">
                            Update Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;