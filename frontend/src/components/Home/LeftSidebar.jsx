import React from 'react';
import { FaBookmark, FaUsers, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';
import './LeftSidebar.css';

const LeftSidebar = () => {
    return (
        <div className="home-left-sidebar">
            <div className="card profile-summary-card">
                <div className="cover-photo"></div>
                <div className="profile-info">
                    <div className="avatar">
                        <span className="avatar-initial">h</span>
                        <div className="opentowork-label">#OPENTOWORK</div>
                    </div>
                    <h2 className="user-name">hemanth naga s... <span className="premium-icon">in</span></h2>
                    <p className="user-headline">Attended CVR College of Engineering, Hyderabad</p>
                    <p className="user-location text-sm text-secondary">Guntur East, Andhra Pradesh</p>
                    <div className="school-info">
                        <img src="https://via.placeholder.com/24" alt="School" />
                        <span>CVR College of Engineering, Hyderabad</span>
                    </div>
                </div>

                <div className="stats-section">
                    <div className="stat-row">
                        <span className="stat-label">Profile viewers</span>
                        <span className="stat-value">29</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Post impressions</span>
                        <span className="stat-value">13</span>
                    </div>
                </div>

                <div className="premium-upsell">
                    <p className="text-sm text-secondary">Strengthen your profile with an AI writing assistant</p>
                    <div className="flex-align text-bold">
                        <span className="premium-square"></span>
                        Try Premium for ₹0
                    </div>
                </div>

                <div className="saved-items">
                    <FaBookmark className="text-secondary" />
                    <span className="text-bold">Saved items</span>
                </div>
            </div>

            <div className="card groups-card">
                <div className="groups-list">
                    <a href="#">Groups</a>
                    <div className="flex-between">
                        <a href="#">Events</a>
                        <span className="plus-icon">+</span>
                    </div>
                    <a href="#">Followed Hashtags</a>
                </div>
                <div className="discover-more">
                    Discover more
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;
