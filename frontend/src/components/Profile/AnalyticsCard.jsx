import React from 'react';
import { FaEye, FaUserFriends, FaChartBar, FaSearch, FaArrowRight } from 'react-icons/fa';
import './AnalyticsCard.css';

const AnalyticsCard = ({ analytics }) => {
    const profileViews = analytics?.profileViews ?? 0;
    const postImpressions = analytics?.postImpressions ?? 0;
    const searchAppearances = analytics?.searchAppearances ?? 0;

    return (
        <div className="card analytics-card">
            <div className="card-content">
                <h2 className="card-title">Analytics</h2>
                <div className="private-badge">
                    <FaEye /> Private to you
                </div>

                <div className="analytics-grid">
                    <div className="analytics-item">
                        <FaUserFriends className="analytics-icon" />
                        <div className="analytics-text">
                            <h4>{profileViews} profile views</h4>
                            <p>Discover who's viewed your profile.</p>
                        </div>
                    </div>

                    <div className="analytics-item">
                        <FaChartBar className="analytics-icon" />
                        <div className="analytics-text">
                            <h4>{postImpressions} post impressions</h4>
                            <p>Check out who's engaging with your posts.</p>
                            <span className="analytics-time">Past 7 days</span>
                        </div>
                    </div>

                    <div className="analytics-item">
                        <FaSearch className="analytics-icon" />
                        <div className="analytics-text">
                            <h4>6 search appearances</h4>
                            <p>See how often you appear in search results.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                Show all analytics <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default AnalyticsCard;
