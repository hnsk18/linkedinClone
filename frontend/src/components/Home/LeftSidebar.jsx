import React, { useEffect, useState, useMemo } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { resolveProfileImageUrl } from '../../utils/profileImage';
import './LeftSidebar.css';

const placeholderLogo =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#E9EEF3"/>
            <path d="M6 15.5V8.5C6 7.67157 6.67157 7 7.5 7H16.5C17.3284 7 18 7.67157 18 8.5V15.5C18 16.3284 17.3284 17 16.5 17H7.5C6.67157 17 6 16.3284 6 15.5Z" fill="#C8D2DC"/>
            <circle cx="10" cy="10" r="1.5" fill="#8FA3B8"/>
        </svg>
    `);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

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
                const res = await fetch(`${API_BASE}/api/users/me`, {
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
                                {resolveProfileImageUrl(me.profilePicture, API_BASE) ? (
                                    <img
                                        src={resolveProfileImageUrl(me.profilePicture, API_BASE)}
                                        alt=""
                                        className="avatar-photo"
                                    />
                                ) : (
                                    <span className="avatar-initial">{me.name ? me.name.charAt(0).toLowerCase() : ''}</span>
                                )}
                                <div className="opentowork-label">#OPENTOWORK</div>
                            </div>
                            <h2 className="user-name">{me.name} <span className="premium-icon">in</span></h2>
                            <p className="user-headline">{me.headline || 'Add a headline'}</p>
                            <p className="user-location text-sm text-secondary">{me.location || 'Add a location'}</p>
                            {me.college && (
                                <div className="school-info">
                                    <img src={placeholderLogo} alt="School" />
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
