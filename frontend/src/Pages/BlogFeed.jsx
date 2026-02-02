import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../Helpers/axiosInstance";
import "./BlogFeed.css";

const BlogFeed = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, msg: "", type: "" });
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("blog_user"));
    const loggedInUserId = loggedInUser?.id;
    const isAdmin = loggedInUser?.role === 'ADMIN';

    // Toast Trigger
    const notify = (msg, type = "success") => {
        setNotification({ show: true, msg, type });
        setTimeout(() => setNotification({ show: false, msg: "", type: "" }), 3000);
    };

    // Memoized fetch function to reuse
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/posts`, {
                params: { page, search }
            });
            setPosts(response.data.posts || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPosts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchPosts]);

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await axiosInstance.delete(`/posts/${postId}`);
            notify("Post deleted successfully", "delete");
            // Refresh the current page to account for pagination shifts
            fetchPosts();
        } catch (err) {
            notify("Failed to delete post", "delete");
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="feed-container">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`toast-notification ${notification.type}`}>
                    {notification.type === 'delete' ? '🗑️' : '✅'} {notification.msg}
                </div>
            )}

            <header className="feed-header">
                <div className="header-nav">
                    <Link to="/" className="back-link">← Back to Dashboard</Link>
                    {isAdmin && <span className="admin-badge">Admin View</span>}
                </div>
                
                <h1 className="hero-title">The DevBlog <span className="highlight">Feed</span></h1>
                
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by title, tags, or content..." 
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
            </header>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Fetching stories...</p>
                </div>
            ) : (
                <main className="feed-content">
                    {/* TOP ACTION BAR: If user has posts, they see this */}
                    <div className="manage-bar">
                        <p>{posts.length} articles found</p>
                    </div>

                    <div className="posts-grid">
                        {posts.length > 0 ? posts.map(post => (
                            <article key={post.id} className="post-card">
                                <div className="post-content-top">
                                    <div className="post-header-flex">
                                        <span className="post-tag">{post.tags?.[0] || 'General'}</span>
                                        {/* TOP DELETE BUTTON: Only for owner or admin */}
                                        {(post.authorId === loggedInUserId || isAdmin) && (
                                            <>

                                            
                                           
    <button onClick={() => navigate(`/edit-post/${post.id}`)} className="edit-link">
        ✏️ Edit
    </button>

                                            <button 
                                                className="icon-delete-btn" 
                                                onClick={() => handleDeletePost(post.id)}
                                                title="Delete Post"
                                            >
                                                ✕
                                            </button>
                                            </>

                                        )}
                                    </div>
                                    <h2 className="post-title">{post.title}</h2>
                                    <p className="post-excerpt">{post.content}</p>
                                </div>

                                <div className="post-footer">
                                    <span className="post-author">By {post.name || 'Anonymous'}</span>
                                    <Link to={`/post/${post.id}`} className="read-more-btn">
                                        Read More
                                    </Link>
                                </div>
                            </article>
                        )) : (
                            <div className="empty-state">
    <h3>No results found for "{search}"</h3>
    <button onClick={() => setSearch("")} className="reset-btn">
        <span>🔄</span> Clear Search & Refresh
    </button>
</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="pagination-wrap">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">Prev</button>
                        <span className="page-info">Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">Next</button>
                    </div>
                </main>
            )}
        </div>
    );
};

export default BlogFeed;