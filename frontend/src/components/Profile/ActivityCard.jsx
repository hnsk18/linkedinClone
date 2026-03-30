import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaArrowRight, FaThumbsUp, FaComment, FaImage, FaVideo } from 'react-icons/fa';
import './ActivityCard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const ActivityCard = ({ user, posts, onPostCreated }) => {
    const name = user?.name || 'You';
    const firstPost = posts && posts.length > 0 ? posts[0] : null;
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

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

        let token = localStorage.getItem('token');
        if (!token) {
            alert('Please sign in to post.');
            return;
        }
        token = token.replace(/^"|"$/g, '');

        setPosting(true);
        try {
            let res;
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                formData.append('content', text || '');
                selectedFiles.forEach((file) => formData.append('files', file));
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });
            } else {
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
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

    return (
        <div className="card activity-card">
            <div className="card-content">
                <div className="activity-header">
                    <div>
                        <h2 className="card-title">Activity</h2>
                        <a href="#" className="link-blue font-semibold followers-link">54 followers</a>
                    </div>
                    <div className="activity-actions">
                        <button
                            type="button"
                            className="btn-outline-primary activity-create-btn"
                            onClick={() => setCreatePostOpen(true)}
                        >
                            Create a post
                        </button>
                        <button className="icon-btn"><FaPen /></button>
                    </div>
                </div>

                <div className="activity-pills">
                    <button className="pill-active">Posts</button>
                    <button className="pill-outline">Comments</button>
                    <button className="pill-outline">Videos</button>
                </div>

                {firstPost ? (
                    <div className="activity-post-preview">
                        <p className="post-meta">
                            {name} posted this · {new Date(firstPost.createdAt).toLocaleDateString()}
                        </p>
                        <div className="post-summary">
                            <div className="post-text">
                                <p>{firstPost.content?.slice(0, 120) || 'Post content'}</p>
                            </div>
                        </div>
                        <div className="post-stats">
                            <span className="stat-likes">
                                <FaThumbsUp className="like-icon" /> {/* likes not tracked yet */}
                            </span>
                            <span className="stat-comments">
                                <FaComment className="like-icon" /> {/* comments not tracked yet */}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="activity-post-preview">
                        <p className="post-meta">{name} has not posted yet.</p>
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
