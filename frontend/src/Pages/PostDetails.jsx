import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../Helpers/axiosInstance';
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const loggedInUserId = JSON.parse(localStorage.getItem("blog_user"))?.id;

  const triggerNotify = (message, type = "success") => {
    setNotification({ show: true, message, type });
    // Duration slightly longer for delete so shake can finish
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch post', err);
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/comments/${id}/comments`);
        setComments(response.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const response = await axiosInstance.post(`/comments/${id}`, { text: commentText });
      setComments((prev) => [response.data, ...prev]);
      setCommentText("");
      triggerNotify("Comment shared! 🚀", "success");
    } catch (err) {
        console.log("Backend error:", err.response?.data );

      const msg =err.response?.data
       triggerNotify(err?.response?.data?.msg , "error");
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Remove this comment?")) return;
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => (c.id || c._id) !== commentId));
      triggerNotify("Comment deleted", "delete");
    } catch (err) {
      triggerNotify("Unable to delete", "delete");
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  if (loadingPost) return <div className="post-detail-wrapper"><p className="status-msg">Loading story...</p></div>;
  if (!post) return <div className="post-detail-wrapper"><p className="status-msg">Post not found</p></div>;

  // ... (keep all your imports and useEffects the same)

  return (
    <div className="post-detail-wrapper">
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          <span>{notification.type === "delete" ? "🗑️" : "✅"}</span> 
          {notification.message}
        </div>
      )}

      <div className="post-detail-container">
        <Link to="/" className="back-link"><span>←</span> Dashboard</Link>

        <header>
          <h1 className="post-detail-title">{post.title}</h1>
          <span className="post-detail-author">By {post.name || "Anonymous"}</span>
          <div className="post-detail-tags">
            {post.tags?.map((tag, idx) => <span key={idx} className="tag">#{tag}</span>)}
          </div>
        </header>

        <article className="post-detail-content">{post.content}</article>

        <section className="comments-section">
          <h3 className="comments-header" style={{fontSize: '1.8rem', marginBottom: '30px'}}>Discussion ({comments.length})</h3>

          <div className="comment-input-card">
            <textarea
              className="comment-textarea"
              placeholder="Join the conversation..."
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={posting}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="comment-btn" onClick={handlePostComment} disabled={posting || !commentText.trim()}>
                {posting ? "Sending..." : "Post Comment"}
              </button>
            </div>
          </div>

          <div className="comments-list">
            {loadingComments ? (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>Updating stream...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => {
                const isMe = (comment.user?.id || comment.user?._id) === loggedInUserId;
                return (
                  <div key={comment.id || comment._id} className={`comment-card ${isMe ? 'right' : ''}`}>
                    
                    {/* Avatar always on the left */}
                    <div className="comment-avatar">{getInitials(comment.user?.name)}</div>
                    
                    <div className="comment-content-wrap">
                      <div className="comment-header">
                        <span className="comment-user" style={{ color: isMe ? '#60a5fa' : 'white' }}>
                          {isMe ? "You" : (comment.user?.name || "Anonymous")}
                          {comment.user?.id === post.author?.id && <span className="author-tag" style={{marginLeft: '10px', fontSize: '0.7rem', background: '#3b82f6', padding: '2px 6px', borderRadius: '4px'}}>Author</span>}
                        </span>
                      </div>
                      <p className="comment-body">{comment.text}</p>
                    </div>

                    {/* Delete button positioned top-right via CSS */}
                    {isMe && (
                      <button 
                        className="comment-delete-btn" 
                        onClick={() => handleDeleteComment(comment.id || comment._id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-comments"><p style={{fontSize: '1.2rem'}}>No comments yet. Start the conversation!</p></div>
            )}
          </div>
        </section>
      </div>
    </div>
  );

};

export default PostDetail;