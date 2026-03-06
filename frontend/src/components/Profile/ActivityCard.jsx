import React from 'react';
import { FaPen, FaArrowRight, FaThumbsUp, FaComment } from 'react-icons/fa';
import './ActivityCard.css';

const ActivityCard = () => {
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

                <div className="activity-post-preview">
                    <p className="post-meta">hemanth naga sai kumar posted this · 3mo</p>
                    <div className="post-summary">
                        <img src="https://via.placeholder.com/64" alt="Post thumbnail" className="post-thumbnail" />
                        <div className="post-text">
                            <p>🚀 Built a Gesture-Controlled Racing Game Interface! 🎮</p>
                            <p>I've been experimenting with computer vision and human-computer interaction, and I built a real-time gesture control system using... <span className="show-more">show more</span></p>
                        </div>
                    </div>
                    <div className="post-stats">
                        <span className="stat-likes"><FaThumbsUp className="like-icon" /> 36</span>
                        <span className="stat-comments">3 comments</span>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                Show all posts <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default ActivityCard;
