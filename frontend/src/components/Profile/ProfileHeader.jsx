import React from 'react';
import './ProfileHeader.css';
import { MdVerified } from 'react-icons/md';
import { FaPen, FaCamera } from 'react-icons/fa';

const ProfileHeader = () => {
    return (
        <div className="card profile-header-container">
            <div className="profile-cover">
                <button className="edit-cover-btn"><FaCamera /></button>
            </div>

            <div className="profile-info-section">
                <div className="profile-photo-container">
                    <div className="profile-photo">
                        <span className="photo-initial">h</span>
                        <div className="open-to-work-frame">#OPENTOWORK</div>
                    </div>
                </div>

                <div className="profile-actions-top">
                    <button className="icon-btn"><FaPen /></button>
                </div>

                <div className="profile-details-grid">
                    <div className="profile-details-left">
                        <h1 className="profile-name">
                            hemanth naga sai kumar <span className="pronouns">(He/Him)</span>
                            <MdVerified className="verified-badge" />
                        </h1>
                        <p className="profile-headline">Attended CVR College of Engineering, Hyderabad</p>
                        <p className="profile-location">
                            Guntur East, Andhra Pradesh, India · <a href="#" className="link-blue font-semibold">Contact info</a>
                        </p>
                        <a href="#" className="link-blue font-semibold mt-1 block">53 connections</a>

                        <div className="profile-action-buttons">
                            <button className="btn-primary">Open to</button>
                            <button className="btn-outline-primary">Add profile section</button>
                            <button className="btn-outline">Enhance profile</button>
                            <button className="btn-outline">Resources</button>
                        </div>
                    </div>

                    <div className="profile-details-right">
                        <div className="company-link">
                            <img src="https://via.placeholder.com/32" alt="CVR College" />
                            <span>CVR College of Engineering, Hyderabad</span>
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
