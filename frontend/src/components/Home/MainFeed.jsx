import React from 'react';
import { FaImage, FaVideo, FaCalendarAlt, FaNewspaper, FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaPaperPlane } from 'react-icons/fa';
import './MainFeed.css';

const MainFeed = () => {
    return (
        <div className="main-feed-container">
            {/* Start a Post Card */}
            <div className="card start-post-card">
                <div className="start-post-top">
                    <div className="me-avatar-medium">h</div>
                    <button className="start-post-input">Start a post, try writing with AI</button>
                </div>
                <div className="start-post-actions">
                    <button className="action-btn"><FaVideo className="icon-blue" /> Video</button>
                    <button className="action-btn"><FaImage className="icon-blue" /> Photo</button>
                    <button className="action-btn"><FaNewspaper className="icon-orange" /> Write article</button>
                </div>
            </div>

            <div className="feed-divider">
                <hr />
                <span>Sort by: <strong>Top</strong> ▼</span>
            </div>

            {/* Feed Posts */}
            <div className="card post-card">
                <div className="post-header">
                    <div className="post-author-info">
                        <img src="https://via.placeholder.com/48" alt="Author" className="author-avatar" />
                        <div className="author-details">
                            <h4>NANGAAJI RUSHIKESH <span className="text-secondary text-sm font-normal">· 1st</span></h4>
                            <p className="author-headline text-secondary text-sm">Attended CVR College of Engineering, Hyderabad</p>
                            <p className="post-time text-secondary text-sm">21h · 🌐</p>
                        </div>
                    </div>
                    <button className="icon-btn-small"><FaEllipsisH /></button>
                </div>

                <div className="post-content">
                    <p>🚀 Day 86 / 100 - LeetCode Challenge</p>
                    <br />
                    <p>Today I worked on a matrix-based counting problem — a good exercise in <span className="see-more">...see more</span></p>

                    <div className="post-image-container mt-2">
                        <img src="https://via.placeholder.com/600x300" alt="Leetcode stats" className="post-image" />
                    </div>
                </div>

                <div className="post-stats-preview">
                    <div className="reactions">
                        <span className="reaction-icon like">👍</span>
                        <span className="reaction-icon celebrate">👏</span>
                        <span className="reaction-icon support">🤝</span>
                        <span className="reaction-count text-secondary text-sm ml-1">Satyasai Sriramulu and 3 others</span>
                    </div>
                </div>

                <div className="post-actions">
                    <button className="post-action-btn"><FaThumbsUp /> <span>Like</span></button>
                    <button className="post-action-btn"><FaComment /> <span>Comment</span></button>
                    <button className="post-action-btn"><FaShare /> <span>Repost</span></button>
                    <button className="post-action-btn"><FaPaperPlane /> <span>Send</span></button>
                </div>
            </div>

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
        </div>
    );
};

export default MainFeed;
