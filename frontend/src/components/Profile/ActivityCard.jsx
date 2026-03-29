import React from 'react';
import { FaPen, FaArrowRight, FaThumbsUp, FaComment } from 'react-icons/fa';
import './ActivityCard.css';

const ActivityCard = ({ user, posts }) => {
    const name = user?.name || 'You';
    const firstPost = posts && posts.length > 0 ? posts[0] : null;

    return (
        <div className="card activity-card">
            <div className="card-content">
                <div className="activity-header">
                    <div>
                        <h2 className="card-title">Activity</h2>
                        <a href="#" className="link-blue font-semibold followers-link">54 followers</a>
                    </div>
                    <div className="activity-actions">
                        <button className="btn-outline-primary activity-create-btn">Create a post</button>
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
            <div className="card-footer">
                Show all posts <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default ActivityCard;
