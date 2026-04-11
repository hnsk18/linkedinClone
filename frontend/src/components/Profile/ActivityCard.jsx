import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaArrowRight, FaThumbsUp, FaComment, FaImage, FaVideo } from 'react-icons/fa';
import './ActivityCard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function firstMediaUrl(mediaUrlsJson) {
    if (!mediaUrlsJson) return null;
    try {
        const arr = JSON.parse(mediaUrlsJson);
        if (Array.isArray(arr) && arr.length > 0) {
            const u = arr[0];
            if (typeof u === 'string') {
                if (u.startsWith('http') || u.startsWith('/')) return u;
                return `${API_BASE}${u.startsWith('/') ? '' : '/'}${u}`;
            }
        }
    } catch {
        /* ignore */
    }
    return null;
}

const ActivityCard = ({ user, posts, activity, onPostCreated }) => {
    const name = user?.name || 'You';
    const [activeTab, setActiveTab] = useState('posts');
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

    const followersCount = activity?.followersCount ?? user?.followersCount ?? 0;
    const postsWithStats = activity?.posts?.length ? activity.posts : null;
    const videoPosts = activity?.videoPosts || [];
    const commentFeed = activity?.comments || [];

    const displayPosts = postsWithStats || posts || [];
    const firstPost = displayPosts.length > 0 ? displayPosts[0] : null;

    useEffect(() => {
        const urls = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [selectedFiles]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (validFiles.length !== files.length) {
            alert('Only images and videos are allowed.');
        }
        setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
        e.target.value = '';
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const closeCreatePost = () => {
        setCreatePostOpen(false);
        setContent('');
        setSelectedFiles([]);
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        const text = content.trim();
        if (!text && selectedFiles.length === 0) return;
        if (posting) return;

        let tok = localStorage.getItem('token');
        if (!tok) {
            alert('Please sign in to post.');
            return;
        }
        try {
            tok = JSON.parse(tok);
        } catch {
            /* raw string */
        }
        tok = String(tok).replace(/^"|"$/g, '');

        setPosting(true);
        try {
            let res;
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('content', text || '');
                selectedFiles.forEach((file) => formData.append('files', file));
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${tok}` },
                    body: formData
                });
            } else {
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tok}`
                    },
                    body: JSON.stringify({ content: text })
                });
            }

            if (!res.ok) {
                const err = await res.text();
                alert(err || 'Failed to post');
                return;
            }

            closeCreatePost();
            if (typeof onPostCreated === 'function') {
                await onPostCreated();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to post');
        } finally {
            setPosting(false);
        }
    };

    const renderPostPreview = (p) => {
        const thumb = firstMediaUrl(p.mediaUrls);
        const likes = typeof p.likesCount === 'number' ? p.likesCount : null;
        const comments = typeof p.commentsCount === 'number' ? p.commentsCount : null;
        return (
            <div className="activity-post-preview" key={p.id}>
                <p className="post-meta">
                    {name} posted this · {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
                </p>
                <div className="post-summary">
                    {thumb && (
                        <img src={thumb} alt="" className="post-thumbnail" />
                    )}
                    <div className="post-text">
                        <p>{(p.content || '').slice(0, 220) || 'Post'}</p>
                    </div>
                </div>
                <div className="post-stats">
                    <span className="stat-likes">
                        <FaThumbsUp className="like-icon" />
                        {likes != null ? ` ${likes}` : ''}
                    </span>
                    <span className="stat-comments">
                        <FaComment className="like-icon" />
                        {comments != null ? ` ${comments} comments` : ''}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="card activity-card">
            <div className="card-content">
                <div className="activity-header">
                    <div>
                        <h2 className="card-title">Activity</h2>
                        <span className="link-blue font-semibold followers-link">{followersCount} followers</span>
                    </div>
                    <div className="activity-actions">
                        <button
                            type="button"
                            className="btn-outline-primary activity-create-btn"
                            onClick={() => setCreatePostOpen(true)}
                        >
                            Create a post
                        </button>
                        <button type="button" className="icon-btn" aria-label="Edit activity"><FaPen /></button>
                    </div>
                </div>

                <div className="activity-pills">
                    <button
                        type="button"
                        className={activeTab === 'posts' ? 'pill-active' : 'pill-outline'}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'comments' ? 'pill-active' : 'pill-outline'}
                        onClick={() => setActiveTab('comments')}
                    >
                        Comments
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'videos' ? 'pill-active' : 'pill-outline'}
                        onClick={() => setActiveTab('videos')}
                    >
                        Videos
                    </button>
                </div>

                {activeTab === 'posts' && (
                    <>
                        {firstPost ? (
                            renderPostPreview(firstPost)
                        ) : (
                            <div className="activity-post-preview">
                                <p className="post-meta">{name} has not posted yet.</p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'comments' && (
                    <div className="activity-comments-list">
                        {commentFeed.length === 0 ? (
                            <p className="post-meta">No comments yet.</p>
                        ) : (
                            commentFeed.map((c) => (
                                <div key={c.id} className="activity-comment-item">
                                    <p className="post-meta">
                                        Comment on post #{c.postId} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                                    </p>
                                    <p>{(c.content || '').slice(0, 200)}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="activity-videos-list">
                        {videoPosts.length === 0 ? (
                            <p className="post-meta">No video posts yet.</p>
                        ) : (
                            videoPosts.map((p) => renderPostPreview(p))
                        )}
                    </div>
                )}
            </div>

            {createPostOpen && (
                <div
                    className="activity-create-post-overlay"
                    onMouseDown={closeCreatePost}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="profile-create-post-title"
                >
                    <div className="activity-create-post-modal" onMouseDown={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmitPost}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="activity-post-file-hidden"
                                onChange={handleFileChange}
                            />
                            <div className="activity-modal-header">
                                <h3 id="profile-create-post-title">Create a post</h3>
                                <button type="button" className="activity-modal-close" onClick={closeCreatePost}>×</button>
                            </div>
                            <textarea
                                className="activity-create-post-input"
                                placeholder="What do you want to talk about?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                autoFocus
                            />
                            {selectedFiles.length > 0 && (
                                <div className="activity-post-media-preview">
                                    {selectedFiles.map((file, i) => (
                                        <div key={`${file.name}-${i}`} className="activity-post-media-item">
                                            {file.type.startsWith('image/') ? (
                                                <img src={previewUrls[i]} alt="" />
                                            ) : (
                                                <video src={previewUrls[i]} muted />
                                            )}
                                            <button type="button" className="activity-post-media-remove" onClick={() => removeFile(i)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="activity-modal-footer">
                                <div className="activity-modal-actions-left">
                                    <button type="button" className="activity-modal-action-btn" onClick={() => fileInputRef.current?.click()}>
                                        <FaImage /> Photo
                                    </button>
                                    <button type="button" className="activity-modal-action-btn" onClick={() => fileInputRef.current?.click()}>
                                        <FaVideo /> Video
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={posting || (!content.trim() && selectedFiles.length === 0)}
                                >
                                    {posting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="card-footer">
                Show all posts <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default ActivityCard;
