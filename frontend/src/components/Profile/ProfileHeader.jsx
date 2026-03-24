import React from 'react';
import './ProfileHeader.css';
import { MdVerified } from 'react-icons/md';
import { FaPen, FaCamera } from 'react-icons/fa';

const ProfileHeader = ({ user, onEditIntro, isMyProfile = true, connectionStatus = 'NONE', onConnect, onMessage, onOpenConnections }) => {
    const name = user?.name || 'Your name';
    const headline = user?.headline || 'Add a headline to your profile';
    const location = user?.location || 'Add your location';
    const connections = user?.connectionsCount ?? 0;
    const college = user?.college || 'Add your college or company';
    const initial = name ? name.charAt(0).toLowerCase() : 'u';

    return (
        <div className="card profile-header-container">
            <div className="profile-cover">
                <button className="edit-cover-btn"><FaCamera /></button>
            </div>

            <div className="profile-info-section">
                <div className="profile-photo-container">
                    <div className="profile-photo">
                        <span className="photo-initial">{initial}</span>
                        <div className="open-to-work-frame">#OPENTOWORK</div>
                    </div>
                </div>

                {isMyProfile && (
                    <div className="profile-actions-top">
                        <button className="icon-btn" onClick={onEditIntro}><FaPen /></button>
                    </div>
                )}

                <div className="profile-details-grid">
                    <div className="profile-details-left">
                        <h1 className="profile-name">
                            {name} <span className="pronouns">(He/Him)</span>
                            <MdVerified className="verified-badge" />
                        </h1>
                        <p className="profile-headline">{headline}</p>
                        <p className="profile-location">
                            {location} · <a href="#" className="link-blue font-semibold">Contact info</a>
                        </p>
                        <button type="button" className="link-blue font-semibold mt-1 block profile-connections-link" onClick={onOpenConnections}>
                            {connections} connections
                        </button>

                        <div className="profile-action-buttons">
                            {isMyProfile ? (
                                <>
                                    <button className="btn-primary">Open to</button>
                                    <button className="btn-outline-primary">Add profile section</button>
                                    <button className="btn-outline">Enhance profile</button>
                                    <button className="btn-outline">Resources</button>
                                </>
                            ) : (
                                <>
                                    {connectionStatus === 'LOADING' ? null : (
                                        <>
                                    {connectionStatus === 'CONNECTED' ? (
                                        <button className="btn-primary" type="button" onClick={onMessage}>Message</button>
                                    ) : connectionStatus === 'PENDING_OUTGOING' ? (
                                        <button className="btn-outline" type="button" disabled>Pending</button>
                                    ) : connectionStatus === 'PENDING_INCOMING' ? (
                                        <button className="btn-outline" type="button" disabled>Respond in Notifications</button>
                                    ) : (
                                        <button className="btn-primary" type="button" onClick={onConnect}>Connect</button>
                                    )}
                                        </>
                                    )}
                                    <button className="btn-outline" type="button">More</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="profile-details-right">
                        <div className="company-link">
                            <img src="https://via.placeholder.com/32" alt="CVR College" />
                            <span>{college}</span>
                        </div>
                    </div>
                </div>

                <div className="open-to-work-box">
                    <div className="box-content-left">
                        <h3>Open to work</h3>
                        <p>Software Engineer, Web Developer, Python Developer and Java Programmer roles</p>
                        <a href="#" className="link-blue font-semibold">Show details</a>
                    </div>
                    <button className="icon-btn"><FaPen /></button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
