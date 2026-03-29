import React from 'react';
import { MdClose } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import './JobPreferencesModal.css';

const JobPreferencesModal = ({ onClose, onEdit, user, jobPreference }) => {
    const name = user?.name || 'Your name';
    const initial = name ? name.charAt(0).toLowerCase() : 'u';

    const jobTitles = jobPreference?.jobTitles || 'Software Engineer, Web Developer, Python Developer, Java Programmer';
    const locationTypes = jobPreference?.locationTypes || 'On-site, Hybrid';
    const locations = jobPreference?.locations || 'Hyderabad, Telangana, India, Bengaluru, Karnataka, India, Mumbai Metropolitan Region';
    const startDate = jobPreference?.startDate || 'Immediately, I am actively applying';
    const employmentTypes = jobPreference?.employmentTypes || 'Full-time, Internship';
    const visibility = jobPreference?.visibility || 'All LinkedIn members';

    const parseList = (str) => str.split(/[,;]/).map(s => s.trim()).filter(Boolean).join(' · ');

    return (
        <div className="modal-overlay">
            <div className="job-preferences-modal-content">
                <div className="job-preferences-modal-header">
                    <h2>Job preferences</h2>
                    <button className="close-btn" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>
                
                <div className="job-preferences-modal-body">
                    <div className="job-preferences-profile-header">
                        <div className="profile-photo-small">
                            <span className="photo-initial-small">{initial}</span>
                            <div className="open-to-work-frame-small">#OPENTOWORK</div>
                        </div>
                        <div className="profile-info-small">
                            <h3>{name}</h3>
                            <p>is open to work</p>
                        </div>
                        <button className="edit-preferences-btn" onClick={onEdit}>
                            <FaPen />
                        </button>
                    </div>

                    <div className="preferences-details">
                        <div className="preference-item">
                            <h4>Job titles</h4>
                            <p>{parseList(jobTitles)}</p>
                        </div>
                        
                        <div className="preference-item">
                            <h4>Location types</h4>
                            <p>{parseList(locationTypes)}</p>
                        </div>

                        <div className="preference-item">
                            <h4>Locations (on-site)</h4>
                            <p>{parseList(locations)}</p>
                        </div>

                        <div className="preference-item">
                            <h4>Start date</h4>
                            <p>{startDate}</p>
                        </div>

                        <div className="preference-item">
                            <h4>Employment types</h4>
                            <p>{parseList(employmentTypes)}</p>
                        </div>
                    </div>

                    <div className="visibility-footer">
                        <span className="visibility-icon">👁</span>
                        <span>{visibility}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPreferencesModal;
