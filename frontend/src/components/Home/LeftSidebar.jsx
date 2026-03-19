import React, { useEffect, useState, useMemo } from 'react';
import { FaBookmark, FaUsers, FaNewspaper, FaCalendarAlt } from 'react-icons/fa';
import './LeftSidebar.css';

const LeftSidebar = () => {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = useMemo(() => {
        let t = localStorage.getItem("token");
        if (!t) return null;
        try {
            t = JSON.parse(t);
        } catch(e) {}
        return t.replace(/^"|"$/g, "");
    }, []);

    useEffect(() => {
        const loadMe = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch("http://localhost:8080/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                setMe(await res.json());
            } catch (e) {
                console.error("Failed to load me", e);
            } finally {
                setLoading(false);
            }
        };
        loadMe();
    }, [token]);

    return (
        <div className="home-left-sidebar">
            <div className="card profile-summary-card">
                <div className="cover-photo"></div>
                <div className="profile-info">
                    {loading ? (
                        <>
                            <div className="avatar"></div>
                            <h2 className="user-name">Loading...</h2>
                        </>
                    ) : me ? (
                        <>
                            <div className="avatar">
                                <span className="avatar-initial">{me.name ? me.name.charAt(0).toLowerCase() : ''}</span>
                                <div className="opentowork-label">#OPENTOWORK</div>
                            </div>
                            <h2 className="user-name">{me.name} <span className="premium-icon">in</span></h2>
                            <p className="user-headline">{me.headline || 'Add a headline'}</p>
                            <p className="user-location text-sm text-secondary">{me.location || 'Add a location'}</p>
                            {me.college && (
                                <div className="school-info">
                                    <img src="https://via.placeholder.com/24" alt="School" />
                                    <span>{me.college}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="avatar"></div>
                            <h2 className="user-name">Guest</h2>
                        </>
                    )}
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
