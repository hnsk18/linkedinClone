import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { FaImage, FaVideo, FaNewspaper, FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaPaperPlane, FaGlobe, FaEdit } from 'react-icons/fa';
import CommentSection from '../Comments/CommentSection';
import { jwtDecode } from 'jwt-decode';
import './MainFeed.css';

function formatRelativeTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    if (diffWeek < 4) return `${diffWeek}w`;
    return date.toLocaleDateString();
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const REACTIONS = [
    { type: 'LIKE', label: 'Like', emoji: '👍', color: '#0A66C2' },
    { type: 'CELEBRATE', label: 'Celebrate', emoji: '👏', color: '#057642' },
    { type: 'SUPPORT', label: 'Support', emoji: '🤝', color: '#8c6a38' },
    { type: 'LOVE', label: 'Love', emoji: '❤️', color: '#D11124' },
    { type: 'INSIGHTFUL', label: 'Insightful', emoji: '💡', color: '#E7A33E' },
    { type: 'FUNNY', label: 'Funny', emoji: '😂', color: '#2E8BFF' },
];

function getReactionMeta(type) {
    if (!type) return null;
    return REACTIONS.find(r => r.type === type) || null;
}

function getAuthToken() {
    let token = localStorage.getItem('token');
    if (!token) return null;
    return token.replace(/^"|"$/g, '');
}

function authHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function PostText({ text, expanded, onToggle }) {
    const ref = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        // When clamped, clientHeight is limited but scrollHeight reflects full content.
        const overflowing = el.scrollHeight > el.clientHeight + 1;
        setIsOverflowing(overflowing);
    }, [text, expanded]);

    if (!text) return null;

    return (
        <>
            <p
                ref={ref}
                className={`post-content-text ${expanded ? 'expanded' : 'clamped'}`}
            >
                {text}
            </p>
            {(expanded || isOverflowing) && (
                <button
                    type="button"
                    className="see-more"
                    onClick={onToggle}
                    aria-expanded={expanded}
                >
                    {expanded ? 'See less' : 'See more'}
                </button>
            )}
        </>
    );
}

const MainFeed = ({ posts = [], onPostCreated }) => {
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const [createPostOpen, setCreatePostOpen] = useState(false);

    const [reactionSummaries, setReactionSummaries] = useState({});
    const [pickerPostId, setPickerPostId] = useState(null);
    const pickerCloseTimer = useRef(null);
    const [reactionsModal, setReactionsModal] = useState({ open: false, postId: null, type: 'ALL' });
    const [modalItems, setModalItems] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [mediaIndexByPost, setMediaIndexByPost] = useState({});

    const [repostDropdownPostId, setRepostDropdownPostId] = useState(null);
    const [repostThoughtsModal, setRepostThoughtsModal] = useState({ open: false, originalPost: null });
    const [repostThoughts, setRepostThoughts] = useState('');
    const [reposting, setReposting] = useState(false);

    // Comment section state
    const [commentSectionOpen, setCommentSectionOpen] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [expandedByPostId, setExpandedByPostId] = useState({});

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserEmail(decoded.sub || decoded.email);
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }
    }, []);

    const openCreatePost = () => setCreatePostOpen(true);
    const closeCreatePost = () => setCreatePostOpen(false);

    const toggleExpanded = (postId) => {
        setExpandedByPostId(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const fetchReactionSummary = async (postId) => {
        try {
            const res = await fetch(`${API_BASE}/api/posts/${postId}/reactions/summary`, {
                headers: { ...authHeaders() },
            });
            if (!res.ok) return;
            const data = await res.json();
            setReactionSummaries(prev => ({ ...prev, [postId]: data }));
        } catch (_) {
            // ignore
        }
    };

    useEffect(() => {
        if (!posts || posts.length === 0) return;
        posts.forEach(p => {
            if (p?.id != null) fetchReactionSummary(p.id);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts]);

    useEffect(() => {
        const urls = selectedFiles.map(f => URL.createObjectURL(f));
        setPreviewUrls(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [selectedFiles]);

    const getMediaIndex = (postId, length) => {
        if (!length) return 0;
        const raw = mediaIndexByPost[postId] ?? 0;
        if (raw < 0) return 0;
        if (raw >= length) return length - 1;
        return raw;
    };

    const changeMediaIndex = (postId, delta, length) => {
        if (!length || length <= 1) return;
        setMediaIndexByPost(prev => {
            const current = prev[postId] ?? 0;
            const next = (current + delta + length) % length;
            return { ...prev, [postId]: next };
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const valid = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (valid.length !== files.length) alert('Only images and videos are allowed.');
        setSelectedFiles(prev => [...prev, ...valid].slice(0, 5));
        e.target.value = '';
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
                selectedFiles.forEach(f => formData.append('files', f));
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
            } else {
                res = await fetch(`${API_BASE}/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: text }),
                });
            }
            if (!res.ok) {
                const err = await res.text();
                alert(err || 'Failed to post');
                return;
            }
            setContent('');
            setSelectedFiles([]);
            setCreatePostOpen(false);
            if (typeof onPostCreated === 'function') onPostCreated();
        } catch (err) {
            console.error(err);
            alert('Failed to post');
        } finally {
            setPosting(false);
        }
    };

    const openPicker = (postId) => {
        if (pickerCloseTimer.current) clearTimeout(pickerCloseTimer.current);
        setPickerPostId(postId);
    };

    const closePickerSoon = () => {
        if (pickerCloseTimer.current) clearTimeout(pickerCloseTimer.current);
        pickerCloseTimer.current = setTimeout(() => setPickerPostId(null), 150);
    };

    const setReaction = async (postId, type) => {
        const token = getAuthToken();
        if (!token) {
            alert('Please sign in to react.');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/posts/${postId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type }),
            });
            if (!res.ok) {
                const err = await res.text();
                alert(err || 'Failed to react');
                return;
            }
            const summary = await res.json();
            setReactionSummaries(prev => ({ ...prev, [postId]: summary }));
        } catch (e) {
            console.error(e);
            alert('Failed to react');
        } finally {
            setPickerPostId(null);
        }
    };

    const openReactionsModal = async (postId, type = 'ALL') => {
        setReactionsModal({ open: true, postId, type });
        setModalLoading(true);
        try {
            const url = new URL(`${API_BASE}/api/posts/${postId}/reactions`);
            if (type && type !== 'ALL') url.searchParams.set('type', type);
            const res = await fetch(url.toString());
            const data = res.ok ? await res.json() : [];
            setModalItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setModalItems([]);
        } finally {
            setModalLoading(false);
        }
    };

    const changeModalType = (type) => {
        if (!reactionsModal.postId) return;
        openReactionsModal(reactionsModal.postId, type);
    };

    const closeModal = () => {
        setReactionsModal({ open: false, postId: null, type: 'ALL' });
        setModalItems([]);
        setModalLoading(false);
    };

    const toggleRepostDropdown = (postId) => {
        setRepostDropdownPostId(prev => (prev === postId ? null : postId));
    };

    const closeRepostDropdown = () => setRepostDropdownPostId(null);

    useEffect(() => {
        if (!repostDropdownPostId) return;
        const handleClick = (e) => {
            if (!e.target.closest('.repost-btn-wrapper')) closeRepostDropdown();
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [repostDropdownPostId]);

    const handleSimpleRepost = async (originalPostId) => {
        closeRepostDropdown();
        const token = getAuthToken();
        if (!token) { alert('Please sign in to repost.'); return; }
        setReposting(true);
        try {
            const res = await fetch(`${API_BASE}/api/posts/repost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ originalPostId, content: '' }),
            });
            if (!res.ok) { const err = await res.text(); alert(err || 'Failed to repost'); return; }
            if (typeof onPostCreated === 'function') onPostCreated();
        } catch (e) { console.error(e); alert('Failed to repost'); } finally { setReposting(false); }
    };

    const openRepostWithThoughts = (originalPost) => {
        closeRepostDropdown();
        setRepostThoughts('');
        setRepostThoughtsModal({ open: true, originalPost });
    };

    const closeRepostThoughtsModal = () => {
        setRepostThoughtsModal({ open: false, originalPost: null });
        setRepostThoughts('');
    };

    const handleRepostWithThoughtsSubmit = async () => {
        const { originalPost } = repostThoughtsModal;
        if (!originalPost?.id) return;
        const token = getAuthToken();
        if (!token) { alert('Please sign in.'); return; }
        setReposting(true);
        try {
            const res = await fetch(`${API_BASE}/api/posts/repost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ originalPostId: originalPost.id, content: repostThoughts.trim() || '' }),
            });
            if (!res.ok) { const err = await res.text(); alert(err || 'Failed to repost'); return; }
            closeRepostThoughtsModal();
            if (typeof onPostCreated === 'function') onPostCreated();
        } catch (e) { console.error(e); alert('Failed to repost'); } finally { setReposting(false); }
    };

    const handleSendPost = (post) => {
        const url = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard')).catch(() => alert('Failed to copy'));
    };

    const postsMap = React.useMemo(() => {
        const m = {};
        (posts || []).forEach(p => { if (p?.id != null) m[p.id] = p; });
        return m;
    }, [posts]);

    return (
        <div className="main-feed-container">
            {/* Start a Post Card */}
            <div className="card start-post-card">
                <div className="start-post-top">
                    <div className="me-avatar-medium">h</div>
                    <textarea
                        className="start-post-input"
                        placeholder="Start a post, try writing with AI"
                        value=""
                        readOnly
                        onClick={openCreatePost}
                        onFocus={openCreatePost}
                        rows={2}
                        style={{ resize: 'none', width: '100%', cursor: 'text' }}
                        aria-label="Start a post"
                    />
                </div>
                <div className="start-post-actions">
                    <button type="button" className="action-btn" onClick={openCreatePost}><FaImage className="icon-blue" /> Photo</button>
                    <button type="button" className="action-btn" onClick={openCreatePost}><FaVideo className="icon-blue" /> Video</button>
                    <button type="button" className="action-btn" onClick={openCreatePost}><FaNewspaper className="icon-orange" /> Write article</button>
                </div>
            </div>

            {/* Create post modal */}
            {createPostOpen && (
                <div
                    className="create-post-modal-overlay"
                    onMouseDown={closeCreatePost}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-post-modal-title"
                >
                    <div className="create-post-modal" onMouseDown={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmitPost}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="post-file-input-hidden"
                                onChange={handleFileChange}
                            />
                            <div className="create-post-modal-header">
                                <div className="create-post-modal-user">
                                    <div className="me-avatar-medium">h</div>
                                    <div>
                                        <h4 className="create-post-modal-title" id="create-post-modal-title">Post to Anyone</h4>
                                    </div>
                                </div>
                                <button type="button" className="create-post-modal-close" onClick={closeCreatePost} aria-label="Close">×</button>
                            </div>

                            <textarea
                                className="create-post-input"
                                placeholder="What do you want to talk about?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                autoFocus
                            />

                            {selectedFiles.length > 0 && (
                                <div className="post-media-preview create-post-media-preview">
                                    {selectedFiles.map((file, i) => (
                                        <div key={i} className="post-media-preview-item">
                                            {file.type.startsWith('image/') ? (
                                                <img src={previewUrls[i]} alt="" />
                                            ) : (
                                                <video src={previewUrls[i]} muted />
                                            )}
                                            <button type="button" className="post-media-remove" onClick={() => removeFile(i)} aria-label="Remove">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="create-post-actions">
                                <div className="create-post-actions-left">
                                    <button type="button" className="action-btn" onClick={() => fileInputRef.current?.click()}><FaImage className="icon-blue" /> Photo</button>
                                    <button type="button" className="action-btn" onClick={() => fileInputRef.current?.click()}><FaVideo className="icon-blue" /> Video</button>
                                    <button type="button" className="action-btn"><FaNewspaper className="icon-orange" /> Write article</button>
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

            <div className="feed-divider">
                <hr />
                <span>Sort by: <strong>Top</strong> ▼</span>
            </div>

            {/* Repost with thoughts modal */}
            {repostThoughtsModal.open && repostThoughtsModal.originalPost && (
                <div className="repost-thoughts-modal-overlay" onMouseDown={closeRepostThoughtsModal} role="dialog" aria-modal="true" aria-labelledby="repost-modal-title">
                    <div className="repost-thoughts-modal" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="repost-thoughts-modal-header">
                            <div className="repost-thoughts-modal-user">
                                <div className="me-avatar-medium">h</div>
                                <div>
                                    <h4 className="repost-thoughts-modal-title" id="repost-modal-title">Post to Anyone</h4>
                                </div>
                            </div>
                            <button type="button" className="repost-thoughts-modal-close" onClick={closeRepostThoughtsModal} aria-label="Close">×</button>
                        </div>
                        <textarea
                            className="repost-thoughts-input"
                            placeholder="Add your thoughts..."
                            value={repostThoughts}
                            onChange={(e) => setRepostThoughts(e.target.value)}
                            rows={3}
                        />
                        <div className="repost-thoughts-embedded">
                            <div className="repost-embedded-card">
                                <div className="post-header repost-embedded-header">
                                    <div className="post-author-info">
                                        <div className="author-avatar" />
                                        <div className="author-details">
                                            <h4>{repostThoughtsModal.originalPost.authorName || repostThoughtsModal.originalPost.authorEmail || 'Unknown'}</h4>
                                            <span className="post-meta">
                                                {formatRelativeTime(repostThoughtsModal.originalPost.createdAt)}
                                                <FaGlobe className="post-visibility-icon" style={{ marginLeft: 4 }} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-content repost-embedded-content">
                                    {repostThoughtsModal.originalPost.content && <p>{repostThoughtsModal.originalPost.content}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="repost-thoughts-actions">
                            <button type="button" className="action-btn">😊</button>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleRepostWithThoughtsSubmit}
                                disabled={reposting}
                            >
                                {reposting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feed Posts from API */}
            {posts.map(post => {
                const isRepost = !!post.repostOfId;
                const originalPost = isRepost
                    ? (postsMap[post.repostOfId] || post._detailOriginal || post)
                    : post;
                const effectiveOriginalId = post.repostOfId ?? post.id;
                const hasRepostThoughts = isRepost && post.content && post.content.trim().length > 0;
                return (
                <div className="card post-card" key={post.id}>
                    {reactionsModal.open && reactionsModal.postId === post.id && (
                        <div className="reactions-modal-overlay" onMouseDown={closeModal} role="presentation">
                            <div className="reactions-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                                <div className="reactions-modal-header">
                                    <h3>Reactions</h3>
                                    <button className="reactions-modal-close" type="button" onClick={closeModal} aria-label="Close">×</button>
                                </div>
                                <div className="reactions-tabs">
                                    <button type="button" className={`reactions-tab ${reactionsModal.type === 'ALL' ? 'active' : ''}`} onClick={() => changeModalType('ALL')}>
                                        All {reactionSummaries[post.id]?.total ? `(${reactionSummaries[post.id].total})` : ''}
                                    </button>
                                    {REACTIONS.map(r => (
                                        <button
                                            key={r.type}
                                            type="button"
                                            className={`reactions-tab ${reactionsModal.type === r.type ? 'active' : ''}`}
                                            onClick={() => changeModalType(r.type)}
                                        >
                                            <span className="reactions-tab-emoji" aria-hidden="true">{r.emoji}</span>
                                            {reactionSummaries[post.id]?.byType?.[r.type] ? `(${reactionSummaries[post.id].byType[r.type]})` : ''}
                                        </button>
                                    ))}
                                </div>
                                <div className="reactions-modal-body">
                                    {modalLoading ? (
                                        <div className="reactions-modal-loading">Loading…</div>
                                    ) : (
                                        <ul className="reactions-list">
                                            {modalItems.map((it, idx) => (
                                                <li className="reactions-list-item" key={`${it.userEmail}-${idx}`}>
                                                    <div className="reactions-list-avatar" />
                                                    <div className="reactions-list-text">
                                                        <div className="reactions-list-name">{it.userName || it.userEmail}</div>
                                                        <div className="reactions-list-sub">{it.userEmail}</div>
                                                    </div>
                                                    <div className="reactions-list-type" title={it.type}>
                                                        {getReactionMeta(it.type)?.emoji || '👍'}
                                                    </div>
                                                </li>
                                            ))}
                                            {modalItems.length === 0 && (
                                                <li className="reactions-empty">No reactions yet.</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Layout differs for simple repost vs repost with thoughts */}
                    {isRepost && !hasRepostThoughts && (
                        <div className="repost-indicator">
                            <div className="repost-indicator-avatar">h</div>
                            <span>{post.authorName || post.authorEmail || 'Unknown'} reposted this</span>
                        </div>
                    )}

                    {hasRepostThoughts ? (
                        <>
                            {/* Reposter header and their thoughts */}
                            <div className="post-header">
                                <div className="post-author-info">
                                    <div className="author-avatar" />
                                    <div className="author-details">
                                        <h4>{post.authorName || post.authorEmail || 'Unknown'}</h4>
                                        <span className="post-meta">
                                            {formatRelativeTime(post.createdAt)}
                                            {post.updatedAt && ' • Edited'}
                                            {' • '}
                                            <FaGlobe className="post-visibility-icon" title="Anyone can see this" />
                                        </span>
                                    </div>
                                </div>
                                <button className="icon-btn-small"><FaEllipsisH /></button>
                            </div>

                            <div className="post-content">
                                <PostText
                                    text={post.content}
                                    expanded={!!expandedByPostId[post.id]}
                                    onToggle={() => toggleExpanded(post.id)}
                                />
                            </div>

                            {/* Embedded original post card */}
                            <div className="repost-thoughts-embedded">
                                <div className="repost-embedded-card">
                                    <div className="post-header repost-embedded-header">
                                        <div className="post-author-info">
                                            <div className="author-avatar" />
                                            <div className="author-details">
                                                <h4>{originalPost.authorName || originalPost.authorEmail || 'Unknown'}</h4>
                                                <span className="post-meta">
                                                    {formatRelativeTime(originalPost.createdAt)}
                                                    {originalPost.updatedAt && ' • Edited'}
                                                    {' • '}
                                                    <FaGlobe className="post-visibility-icon" title="Anyone can see this" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post-content repost-embedded-content">
                                        <PostText
                                            text={originalPost.content}
                                            expanded={!!expandedByPostId[effectiveOriginalId]}
                                            onToggle={() => toggleExpanded(effectiveOriginalId)}
                                        />
                                        {originalPost.mediaUrls && (() => {
                                            try {
                                                const urls = JSON.parse(originalPost.mediaUrls);
                                                if (!Array.isArray(urls) || urls.length === 0) return null;
                                                const index = getMediaIndex(originalPost.id, urls.length);
                                                const url = urls[index];
                                                const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
                                                const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(url);
                                                return (
                                                    <div className="post-media-list">
                                                        <div className="post-media-frame">
                                                            {isVideo ? (
                                                                <video src={fullUrl} controls className="post-media-item post-media-video" />
                                                            ) : (
                                                                <img src={fullUrl} alt="" className="post-media-item post-media-image" />
                                                            )}
                                                            {urls.length > 1 && (
                                                                <>
                                                                    <div className="post-media-nav">
                                                                        <button
                                                                            type="button"
                                                                            className="post-media-arrow"
                                                                            onClick={() => changeMediaIndex(originalPost.id, -1, urls.length)}
                                                                            aria-label="Previous media"
                                                                        >
                                                                            ‹
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="post-media-arrow"
                                                                            onClick={() => changeMediaIndex(originalPost.id, 1, urls.length)}
                                                                            aria-label="Next media"
                                                                        >
                                                                            ›
                                                                        </button>
                                                                    </div>
                                                                    <div className="post-media-counter">
                                                                        {index + 1} / {urls.length}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } catch (_) { return null; }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="post-header">
                                <div className="post-author-info">
                                    <div className="author-avatar" />
                                    <div className="author-details">
                                        <h4>{(isRepost ? originalPost : post).authorName || (isRepost ? originalPost : post).authorEmail || 'Unknown'}</h4>
                                        <span className="post-meta">
                                            {formatRelativeTime((isRepost ? originalPost : post).createdAt)}
                                            {(isRepost ? originalPost : post).updatedAt && ' • Edited'}
                                            {' • '}
                                            <FaGlobe className="post-visibility-icon" title="Anyone can see this" />
                                        </span>
                                    </div>
                                </div>
                                <button className="icon-btn-small"><FaEllipsisH /></button>
                            </div>
                            <div className="post-content">
                                <PostText
                                    text={(isRepost ? originalPost : post).content}
                                    expanded={!!expandedByPostId[effectiveOriginalId]}
                                    onToggle={() => toggleExpanded(effectiveOriginalId)}
                                />
                                {((isRepost ? originalPost : post).mediaUrls) && (() => {
                                    const p = isRepost ? originalPost : post;
                                    try {
                                        const urls = JSON.parse(p.mediaUrls);
                                        if (!Array.isArray(urls) || urls.length === 0) return null;
                                        const index = getMediaIndex(p.id, urls.length);
                                        const url = urls[index];
                                        const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
                                        const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(url);
                                        return (
                                            <div className="post-media-list">
                                                <div className="post-media-frame">
                                                    {isVideo ? (
                                                        <video src={fullUrl} controls className="post-media-item post-media-video" />
                                                    ) : (
                                                        <img src={fullUrl} alt="" className="post-media-item post-media-image" />
                                                    )}
                                                    {urls.length > 1 && (
                                                        <>
                                                            <div className="post-media-nav">
                                                                <button
                                                                    type="button"
                                                                    className="post-media-arrow"
                                                                    onClick={() => changeMediaIndex(p.id, -1, urls.length)}
                                                                    aria-label="Previous media"
                                                                >
                                                                    ‹
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="post-media-arrow"
                                                                    onClick={() => changeMediaIndex(p.id, 1, urls.length)}
                                                                    aria-label="Next media"
                                                                >
                                                                    ›
                                                                </button>
                                                            </div>
                                                            <div className="post-media-counter">
                                                                {index + 1} / {urls.length}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    } catch (_) { return null; }
                                })()}
                            </div>
                        </>
                    )}

                    {(() => {
                        const summary = reactionSummaries[post.id];
                        if (!summary || !summary.total) return null;
                        const me = summary.currentUserType;
                        const label = me
                            ? (summary.total > 1 ? `You and ${summary.total - 1} others` : 'You')
                            : `${summary.total}`;
                        return (
                            <div className="post-reactions-summary" role="button" tabIndex={0} onClick={() => openReactionsModal(post.id, 'ALL')} onKeyDown={(e) => e.key === 'Enter' && openReactionsModal(post.id, 'ALL')}>
                                <div className="post-reactions-left">
                                    <div className="post-reaction-icons" aria-hidden="true">
                                        {(summary.topTypes || []).map((t) => {
                                            const meta = getReactionMeta(t);
                                            return (
                                                <span key={t} className={`reaction-icon-badge ${t.toLowerCase()}`} title={meta?.label || t}>
                                                    {meta?.emoji || '👍'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <span className="post-reactions-label">{label}</span>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="post-actions">
                        {(() => {
                            const summary = reactionSummaries[post.id];
                            const myType = summary?.currentUserType || null;
                            const meta = getReactionMeta(myType);
                            return (
                                <div
                                    className="like-btn-wrapper"
                                    onMouseEnter={() => openPicker(post.id)}
                                    onMouseLeave={closePickerSoon}
                                >
                                    {pickerPostId === post.id && (
                                        <div className="reaction-picker" onMouseEnter={() => openPicker(post.id)} onMouseLeave={closePickerSoon}>
                                            {REACTIONS.map(r => (
                                                <button
                                                    key={r.type}
                                                    type="button"
                                                    className="reaction-picker-btn"
                                                    title={r.label}
                                                    onClick={() => setReaction(post.id, r.type)}
                                                >
                                                    <span className="reaction-picker-emoji" aria-hidden="true">{r.emoji}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        className="post-action-btn"
                                        onClick={() => (myType ? setReaction(post.id, 'NONE') : setReaction(post.id, 'LIKE'))}
                                        style={meta ? { color: meta.color } : undefined}
                                    >
                                        {meta ? <span className="like-emoji" aria-hidden="true">{meta.emoji}</span> : <FaThumbsUp />}
                                        <span>{meta ? meta.label : 'Like'}</span>
                                    </button>
                                </div>
                            );
                        })()}
                        <button className="post-action-btn" onClick={() => setCommentSectionOpen(post.id)}><FaComment /> <span>Comment</span></button>
                        <div className="repost-btn-wrapper">
                            {repostDropdownPostId === post.id && (
                                <div className="repost-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        className="repost-dropdown-item"
                                        onClick={() => openRepostWithThoughts(originalPost)}
                                    >
                                        <FaEdit /> <span>Repost with your thoughts</span>
                                        <small>Create a new post with {originalPost?.authorName || 'this'} post attached</small>
                                    </button>
                                    <button
                                        type="button"
                                        className="repost-dropdown-item"
                                        onClick={() => handleSimpleRepost(effectiveOriginalId)}
                                    >
                                        <FaShare /> <span>Repost</span>
                                        <small>Instantly share to your feed</small>
                                    </button>
                                </div>
                            )}
                            <button type="button" className="post-action-btn" onClick={(e) => { e.stopPropagation(); toggleRepostDropdown(post.id); }} aria-haspopup="true" aria-expanded={repostDropdownPostId === post.id}>
                                <FaShare /> <span>Repost</span>
                            </button>
                        </div>
                        <button className="post-action-btn" onClick={() => handleSendPost(post)}><FaPaperPlane /> <span>Send</span></button>
                    </div>
                </div>
                );
            })}

            {/* Feed Post: Job Hiring Ad Box Placeholder matching Screenshot */}
            <div className="card post-card" style={{ padding: '16px' }}>
                <div className="flex-between">
                    <div>
                        <h3 className="text-bold text-lg mb-1">See who's hiring</h3>
                        <p className="text-secondary">hemanth, find a company that needs your skills</p>
                        <button className="btn-primary mt-2" style={{ borderRadius: 24, padding: '4px 16px' }}>Search jobs</button>
                    </div>
                    <div className="jobs-circle-icon">
                        <span className="jobs-suitcase">💼</span>
                        <span className="jobs-badge">Jobs</span>
                    </div>
                </div>
            </div>

            {/* Comment Section Sidebar */}
            {commentSectionOpen && currentUserEmail && (
                <CommentSection
                    postId={commentSectionOpen}
                    currentUserEmail={currentUserEmail}
                    isOpen={!!commentSectionOpen}
                    onClose={() => setCommentSectionOpen(null)}
                />
            )}
        </div>
    );
};

export default MainFeed;
