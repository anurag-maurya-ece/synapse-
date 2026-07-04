import React, { useState, useEffect } from 'react';
import { ThumbsUp, MessageSquare, Plus, X, Tag, Clock } from 'lucide-react';

export default function Forum({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Create Post Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Career Advice');
  const [postAuthor, setPostAuthor] = useState('');
  const [postAuthorRole, setPostAuthorRole] = useState('Student');
  const [postContent, setPostContent] = useState('');
  const [createError, setCreateError] = useState('');

  // Post Detail Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentAuthorRole, setCommentAuthorRole] = useState('Student');
  const [commentError, setCommentError] = useState('');

  const categories = ['All', 'Career Advice', 'Technical Questions', 'Resume Review', 'General'];

  const categoryColors = {
    'Career Advice': { bg: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' },
    'Technical Questions': { bg: 'var(--color-secondary-light)', color: 'var(--color-secondary-dark)' },
    'Resume Review': { bg: 'var(--color-accent-light)', color: 'var(--color-accent-dark)' },
    'General': { bg: 'var(--color-bg-muted)', color: 'var(--color-text-body)' },
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/forum/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        if (selectedPost && selectedPost._id === postId) setSelectedPost(updatedPost);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle || !postContent || !postAuthor) {
      setCreateError('Please fill out all required fields.');
      return;
    }
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/forum/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle, content: postContent, category: postCategory,
          authorName: postAuthor, authorRole: postAuthorRole
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setIsCreateOpen(false);
        setPostTitle(''); setPostContent('');
        setCreateError('');
      } else {
        const errData = await res.json();
        setCreateError(errData.error || 'Failed to submit discussion post.');
      }
    } catch (err) {
      setCreateError('Server connection error. Please try again.');
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateOpen(true);
    setPostAuthor(user ? user.name : '');
    setPostAuthorRole(user ? (user.role === 'admin' ? 'Alumni' : 'Student') : 'Student');
  };

  const handleOpenPostDetails = async (post) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/forum/posts/${post._id}`);
      if (res.ok) { setSelectedPost(await res.json()); }
      else { setSelectedPost(post); }
    } catch { setSelectedPost(post); }
    setCommentContent('');
    setCommentAuthor(user ? user.name : '');
    setCommentAuthorRole(user ? (user.role === 'admin' ? 'Alumni' : 'Student') : 'Student');
    setCommentError('');
  };

  const handleClosePostDetails = () => setSelectedPost(null);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent || !commentAuthor) {
      setCommentError('Comment content and name are required.');
      return;
    }
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/forum/posts/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent, authorName: commentAuthor, authorRole: commentAuthorRole
        })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setSelectedPost(updatedPost);
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
        setCommentContent(''); setCommentError('');
      } else {
        const errData = await res.json();
        setCommentError(errData.error || 'Failed to add comment.');
      }
    } catch (err) {
      setCommentError('Server connection error. Please try again.');
    }
  };

  const filteredPosts = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  const getCatStyle = (cat) => categoryColors[cat] || categoryColors['General'];

  return (
    <div className="fade-section">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="section-title">Open Discussion Forum</h2>
          <p className="section-subtitle">Collaborative Q&A space bridging alumni knowledge and student curiosity.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={18} /> Start Discussion
        </button>
      </div>

      {/* Category Filters */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px',
        background: 'var(--color-bg-subtle)',
        border: '2.5px solid #05060f',
        padding: '16px 20px',
        borderRadius: '1rem',
        marginBottom: '36px',
        boxShadow: '0.3rem 0.3rem #05060f',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '0.5rem', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading / Empty / Posts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3.5px solid #05060f',
            borderTop: '3.5px solid var(--color-primary)',
            borderRadius: '50%', animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto',
          }} />
          Loading threads...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center', background: 'var(--color-bg-subtle)',
          border: '2.5px solid #05060f', borderRadius: '1rem',
          padding: '80px 24px',
          boxShadow: '0.4rem 0.4rem #05060f',
          color: '#05060f'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 800 }}>No discussions in this category</h3>
          <p style={{ color: 'var(--color-text-body)', fontSize: '0.92rem' }}>Be the first to kick off a discussion.</p>
          <button className="btn btn-primary" onClick={handleOpenCreateModal} style={{ marginTop: '20px' }}>
            <Plus size={16} /> Post Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map((post) => {
            const catStyle = getCatStyle(post.category);
            return (
              <div
                key={post._id}
                className="card"
                onClick={() => handleOpenPostDetails(post)}
                style={{ cursor: 'pointer', padding: '28px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                    background: catStyle.bg, color: catStyle.color,
                  }}>
                    <Tag size={11} /> {post.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px', color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
                  {post.title}
                </h3>

                <p style={{
                  color: 'var(--color-text-body)', fontSize: '0.92rem', lineHeight: 1.6,
                  marginBottom: '22px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {post.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                    <span style={{
                      width: '30px', height: '30px',
                      background: 'var(--color-primary-light)',
                      borderRadius: '50%',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '0.8rem',
                    }}>
                      {post.authorName.charAt(0).toUpperCase()}
                    </span>
                    <span><strong>{post.authorName}</strong> <span style={{ color: 'var(--color-text-muted)' }}>({post.authorRole})</span></span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                      onClick={(e) => handleLike(post._id, e)}
                      style={{
                        background: post.likes > 0 ? 'var(--color-secondary-light)' : '#ffffff',
                        border: '2px solid #05060f',
                        color: '#05060f',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 750,
                        boxShadow: '0.1rem 0.1rem #05060f',
                        transition: 'all 0.1s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(-1px, -1px)';
                        e.currentTarget.style.boxShadow = '0.15rem 0.15rem #05060f';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0.1rem 0.1rem #05060f';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translate(1px, 1px)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0.1rem 0.1rem #05060f';
                      }}
                    >
                      <ThumbsUp size={13} style={{
                        color: '#05060f',
                        fill: post.likes > 0 ? 'var(--color-secondary)' : 'none',
                      }} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid #05060f',
                      color: '#05060f',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 750,
                      boxShadow: '0.1rem 0.1rem #05060f'
                    }}>
                      <MessageSquare size={13} style={{ color: '#05060f' }} />
                      <span>{post.comments ? post.comments.length : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create Post Modal ─── */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsCreateOpen(false)}>
              <X size={16} />
            </button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text)' }}>Create Forum Topic</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.5 }}>
              Submit a question or insight to pool knowledge with our student-alumni cohort.
            </p>

            {createError && (
              <div style={{ background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid #FECACA', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.88rem' }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Title / Question</label>
                <input type="text" className="form-input" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="e.g. Preparing for System Design interviews?" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
                    <option value="Career Advice">Career Advice</option>
                    <option value="Technical Questions">Technical Questions</option>
                    <option value="Resume Review">Resume Review</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Role</label>
                  <select className="form-select" value={postAuthorRole} onChange={(e) => setPostAuthorRole(e.target.value)} disabled={!!user}>
                    <option value="Student">Student</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} placeholder="e.g. Kevin Liu" disabled={!!user} required />
              </div>
              <div className="form-group">
                <label className="form-label">Elaborate details</label>
                <textarea className="form-textarea" value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Elaborate on your question, add background context..." required />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Post</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Post Detail & Comments Modal ─── */}
      {selectedPost && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <button className="modal-close" onClick={handleClosePostDetails}>
              <X size={16} />
            </button>

            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                  padding: '3px 10px', borderRadius: 'var(--radius-full)',
                  background: getCatStyle(selectedPost.category).bg,
                  color: getCatStyle(selectedPost.category).color,
                }}>
                  <Tag size={11} /> {selectedPost.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  📅 {new Date(selectedPost.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', color: 'var(--color-text)', letterSpacing: '-0.4px', lineHeight: 1.25 }}>
                {selectedPost.title}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <span style={{
                    width: '32px', height: '32px',
                    background: 'var(--color-primary-light)',
                    border: '1.5px solid #05060f',
                    borderRadius: '0.4rem',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary-dark)', fontWeight: 'bold', fontSize: '0.85rem',
                  }}>
                    {selectedPost.authorName.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <strong>{selectedPost.authorName}</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>({selectedPost.authorRole})</span>
                  </span>
                </div>
                <button
                  onClick={(e) => handleLike(selectedPost._id, e)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: selectedPost.likes > 0 ? 'var(--color-secondary-light)' : 'var(--color-bg-subtle)',
                    borderColor: '#05060f'
                  }}
                >
                  <ThumbsUp size={14} style={{
                    color: '#05060f',
                    fill: selectedPost.likes > 0 ? 'var(--color-secondary)' : 'none',
                  }} />
                  <span style={{ fontWeight: 700 }}>Like ({selectedPost.likes || 0})</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <p style={{ fontSize: '1rem', color: 'var(--color-text-body)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '36px' }}>
              {selectedPost.content}
            </p>

            {/* Comments */}
            <div style={{ marginBottom: '36px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                <MessageSquare size={16} /> Responses ({selectedPost.comments ? selectedPost.comments.length : 0})
              </h4>

              {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '20px', background: 'var(--color-bg-subtle)', border: '2px solid #05060f', borderRadius: '0.6rem', textAlign: 'center' }}>
                  No responses on this thread yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPost.comments.map((comment, index) => (
                    <div key={comment._id || index} style={{
                      padding: '18px', background: 'var(--color-bg-subtle)',
                      border: '2px solid #05060f', borderRadius: '0.6rem',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                          {comment.authorName}{' '}
                          <span className={`badge ${comment.authorRole === 'Alumni' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.55rem', marginLeft: '6px', padding: '2px 8px' }}>
                            {comment.authorRole}
                          </span>
                        </span>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--color-text-body)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div style={{ borderTop: '2px solid #05060f', paddingTop: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '18px', color: 'var(--color-text)' }}>Share an Insight</h4>
              {commentError && (
                <div style={{ background: '#FEF2F2', color: 'var(--color-danger)', border: '1px solid #FECACA', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {commentError}
                </div>
              )}
              <form onSubmit={handleAddComment}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input type="text" className="form-input" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="e.g. Priya Sharma" disabled={!!user} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Role</label>
                    <select className="form-select" value={commentAuthorRole} onChange={(e) => setCommentAuthorRole(e.target.value)} disabled={!!user}>
                      <option value="Student">Student</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Write your reply</label>
                  <textarea className="form-textarea" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Provide constructive advice or ask follow-up questions..." required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Reply</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
