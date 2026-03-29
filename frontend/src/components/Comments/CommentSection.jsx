import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import CommentItem from './CommentItem';
import './CommentSection.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function getAuthToken() {
    let token = localStorage.getItem('token');
    if (!token) return null;
    return token.replace(/^"|"$/g, '');
}

function authHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function CommentSection({ postId, currentUserEmail, isOpen = false, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            fetchCommentCount();
        }
    }, [isOpen, postId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/comments?postId=${postId}`, {
                headers: authHeaders(),
            });
            if (!res.ok) {
                console.error('Failed to fetch comments');
                return;
            }
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCommentCount = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/comments/count/${postId}`, {
                headers: authHeaders(),
            });
            if (!res.ok) return;
            const data = await res.json();
            setCommentCount(data.count || 0);
        } catch (err) {
            console.error('Error fetching comment count:', err);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const token = getAuthToken();
        if (!token) {
            alert('Please sign in to comment.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(
                `${API_BASE}/api/comments?postId=${postId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: newComment.trim() }),
                }
            );

            if (!res.ok) {
                const err = await res.text();
                alert(err || 'Failed to add comment');
                return;
            }

            const addedComment = await res.json();
            setComments([addedComment, ...comments]);
            setNewComment('');
            setCommentCount(prev => prev + 1);
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(c => c.id !== commentId));
        setCommentCount(prev => Math.max(0, prev - 1));
    };

    const handleUpdateComment = (updatedComment) => {
        setComments(
            comments.map(c => (c.id === updatedComment.id ? updatedComment : c))
        );
    };

    return (
        <div className={`comment-section ${isOpen ? 'open' : ''}`}>
            <div className="comment-section-header">
                <h3>Comments ({commentCount})</h3>
                <button
                    className="comment-section-close"
                    onClick={onClose}
                    aria-label="Close comments"
                >
                    ×
                </button>
            </div>

            <form className="comment-input-form" onSubmit={handleSubmitComment}>
                <div className="comment-input-wrapper">
                    <textarea
                        className="comment-input"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                    />
                </div>
                <div className="comment-form-actions">
                    <button
                        type="submit"
                        className="comment-submit-btn"
                        disabled={!newComment.trim() || isSubmitting}
                        title={newComment.trim() ? 'Post comment' : 'Add comment text'}
                    >
                        {isSubmitting ? 'Posting...' : <FaPaperPlane />}
                    </button>
                </div>
            </form>

            <div className="comment-list">
                {isLoading ? (
                    <div className="comment-loading">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="comment-empty">No comments yet. Be the first to comment!</div>
                ) : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserEmail={currentUserEmail}
                            onDelete={handleDeleteComment}
                            onUpdate={handleUpdateComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;
