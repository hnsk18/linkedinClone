import React, { useState } from 'react';
import './ProfileHeader.css';
import { MdVerified } from 'react-icons/md';
import { FaPen, FaCamera } from 'react-icons/fa';
import AddProfileSectionModal from './AddProfileSectionModal';

const ProfileHeader = ({ user, experience, education, jobPreference, isMyProfile, onEditIntro, onOpenModal, onOpenConnections, connectionStatus, onConnect, onMessage, onPhotoUpload }) => {
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
            <div className="profile-cover" style={{ backgroundImage: user?.coverPicture ? `url(${user.coverPicture})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {isMyProfile && (
                    <>
                        <button className="edit-cover-btn" onClick={() => document.getElementById('coverPhotoInput').click()}><FaCamera /></button>
                        <input type="file" id="coverPhotoInput" hidden accept="image/*" onChange={(e) => onPhotoUpload && onPhotoUpload('cover', e.target.files[0])} />
                    </>
                )}
            </div>

            <div className="profile-info-section">
                <div className="profile-photo-container">
                    <div className="profile-photo" style={{ position: 'relative' }}>
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <span className="photo-initial">{initial}</span>
                        )}
                        <div className="open-to-work-frame">#OPENTOWORK</div>
                        {isMyProfile && (
                            <>
                                <button className="edit-photo-btn" onClick={() => document.getElementById('profilePhotoInput').click()} style={{ position: 'absolute', bottom: 10, right: 10, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #ccc', cursor: 'pointer', zIndex: 10, color: '#666' }}>
                                    <FaCamera />
                                </button>
                                <input type="file" id="profilePhotoInput" hidden accept="image/*" onChange={(e) => onPhotoUpload && onPhotoUpload('profile', e.target.files[0])} />
                            </>
                        )}
                    </div>
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
                            {isMyProfile ? (
                                <>
                                    <button className="btn-primary">Open to</button>
                                    <button className="btn-outline-primary" onClick={() => setIsAddSectionModalOpen(true)}>Add profile section</button>
                                    <button className="btn-outline">Enhance profile</button>
                                    <button className="btn-outline">Resources</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-primary" onClick={onMessage}>Message</button>
                                    {connectionStatus === 'NONE' && (
                                        <button className="btn-outline-primary" onClick={onConnect}>Connect</button>
                                    )}
                                    {connectionStatus === 'PENDING_OUTGOING' && (
                                        <button className="btn-outline-primary" disabled>Pending</button>
                                    )}
                                    {connectionStatus === 'PENDING_INCOMING' && (
                                        <button className="btn-outline-primary" disabled>Accept/Deny</button>
                                    )}
                                    {connectionStatus === 'CONNECTED' && (
                                        <button className="btn-outline-primary" disabled>Connected</button>
                                    )}
                                    <button className="btn-outline">More</button>
                                </>
                            )}
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
