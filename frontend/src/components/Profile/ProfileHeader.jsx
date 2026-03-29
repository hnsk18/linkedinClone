import React, { useState } from 'react';
import './ProfileHeader.css';
import { MdVerified } from 'react-icons/md';
import { FaPen, FaCamera } from 'react-icons/fa';
import AddProfileSectionModal from './AddProfileSectionModal';

const ProfileHeader = ({
    user,
    experience,
    education,
    jobPreference,
    onEditIntro,
    onOpenModal,
    onOpenConnections,
    onEditProfilePicture,
    onEditCoverPicture
}) => {
    const name = user?.name || 'Your name';
    const headline = user?.headline || 'Add a headline to your profile';
    const location = user?.location || 'Add your location';
    const connections = user?.connectionsCount ?? 0;
    const initial = name ? name.charAt(0).toLowerCase() : 'u';

    // Get latest experience and education (assuming the array might not be strictly sorted, but taking the first one for now, or you could add basic sorting if needed. Usually backends return latest first or we can just use the first item).
    const latestExperience = experience && experience.length > 0 ? experience[0] : null;
    const latestEducation = education && education.length > 0 ? education[0] : null;

    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

    return (
        <div className="card profile-header-container">
            <div
                className="profile-cover"
                style={user?.coverPicture ? { backgroundImage: `url(${user.coverPicture})` } : undefined}
            >
                <button
                    className="edit-cover-btn"
                    type="button"
                    onClick={onEditCoverPicture}
                    aria-label="Edit cover photo"
                >
                    <FaCamera />
                </button>
            </div>

            <div className="profile-info-section">
                <div className="profile-photo-container">
                    <button
                        className="profile-photo"
                        type="button"
                        onClick={onEditProfilePicture}
                        aria-label="Edit profile photo"
                    >
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={`${name} profile`} className="profile-photo-image" />
                        ) : (
                            <span className="photo-initial">{initial}</span>
                        )}
                        <div className="open-to-work-frame">#OPENTOWORK</div>
                    </button>
                </div>

                <div className="profile-actions-top">
                    {onEditIntro && (
                        <button className="icon-btn" onClick={onEditIntro}><FaPen /></button>
                    )}
                </div>

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
                            <button className="btn-primary">Open to</button>
                            <button className="btn-outline-primary" onClick={() => setIsAddSectionModalOpen(true)}>Add profile section</button>
                            <button className="btn-outline">Enhance profile</button>
                            <button className="btn-outline">Resources</button>
                        </div>
                    </div>

                    <div className="profile-details-right">
                        {latestExperience && (
                            <div className="company-link">
                                <img src="https://ui-avatars.com/api/?name=C&background=fff&color=000" alt={latestExperience.company} />
                                <span>{latestExperience.company}</span>
                            </div>
                        )}
                        {latestEducation && (
                            <div className="company-link">
                                <img src="https://ui-avatars.com/api/?name=E&background=fff&color=000" alt={latestEducation.collegeName} />
                                <span>{latestEducation.collegeName}</span>
                            </div>
                        )}
                        {!latestExperience && !latestEducation && (
                            <div className="company-link" onClick={() => onOpenModal && onOpenModal('education')} style={{ cursor: 'pointer' }}>
                                <img src="https://via.placeholder.com/32" alt="Add college" />
                                <span>Add your college or company</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="open-to-work-box">
                    <div className="box-content-left">
                        <h3>Open to work</h3>
                        <p>{jobPreference?.jobTitles || 'Software Engineer, Web Developer'} roles</p>
                        <span className="link-blue font-semibold" style={{ cursor: 'pointer' }} onClick={() => onOpenModal && onOpenModal('jobPreferences')}>Show details</span>
                    </div>
                    {onEditIntro && (
                        <button className="icon-btn" onClick={() => onOpenModal && onOpenModal('editJobPreferences')}><FaPen /></button>
                    )}
                </div>
            </div>

            {isAddSectionModalOpen && (
                <AddProfileSectionModal
                    onClose={() => setIsAddSectionModalOpen(false)}
                    onOpenModal={onOpenModal}
                />
            )}
        </div>
    );
};

export default ProfileHeader;
