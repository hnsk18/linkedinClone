import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaTrash, FaEdit } from 'react-icons/fa';
import './CommentItem.css';

const API_BASE = 'http://localhost:8080';

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

function getAuthToken() {
    let token = localStorage.getItem('token');
    if (!token) return null;
    return token.replace(/^"|"$/g, '');
}

function authHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function CommentItem({ comment, currentUserEmail, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = currentUserEmail === comment.authorEmail;

    const handleDelete = async () => {
        if (window.confirm('Delete this comment?')) {
            try {
                const res = await fetch(`${API_BASE}/api/comments/${comment.id}`, {
                    method: 'DELETE',
                    headers: authHeaders(),
                });
                if (!res.ok) {
                    alert('Failed to delete comment');
                    return;
                }
                onDelete(comment.id);
                setShowMenu(false);
            } catch (err) {
                console.error(err);
                alert('Failed to delete comment');
            }
        }
    };

    const handleUpdate = async () => {
        if (!editedContent.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        setIsUpdating(true);
        try {
            const res = await fetch(`${API_BASE}/api/comments/${comment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
                },
                body: JSON.stringify({ content: editedContent.trim() }),
            });
            if (!res.ok) {
                alert('Failed to update comment');
                return;
            }
            const updatedComment = await res.json();
            onUpdate(updatedComment);
            setIsEditing(false);
            setShowMenu(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update comment');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="comment-item">
            <div className="comment-avatar" />
            <div className="comment-body">
                <div className="comment-header">
                    <div className="comment-author-info">
                        <strong className="comment-name">{comment.authorName || comment.authorEmail}</strong>
                        <span className="comment-email">@{comment.authorEmail}</span>
                        <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    {isOwner && (
                        <div className="comment-menu-wrapper">
                            <button
                                className="comment-menu-btn"
                                onClick={() => setShowMenu(!showMenu)}
                                aria-label="More options"
                            >
                                <FaEllipsisH />
                            </button>
                            {showMenu && (
                                <div className="comment-menu">
                                    <button
                                        className="comment-menu-item comment-edit-btn"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="comment-menu-item comment-delete-btn"
                                        onClick={handleDelete}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="comment-edit-section">
                        <textarea
                            className="comment-edit-input"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={3}
                        />
                        <div className="comment-edit-actions">
                            <button
                                className="comment-edit-save-btn"
                                onClick={handleUpdate}
                                disabled={isUpdating || !editedContent.trim()}
                            >
                                {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                className="comment-edit-cancel-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(comment.content);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="comment-content">{comment.content}</p>
                )}
            </div>
        </div>
    );
}

export default CommentItem;
