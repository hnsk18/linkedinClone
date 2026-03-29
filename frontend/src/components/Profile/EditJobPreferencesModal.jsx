import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import './EditJobPreferencesModal.css';

const EditJobPreferencesModal = ({ onClose, onSave, jobPreference, saving }) => {
    const parseList = (str, defaults) => {
        if (!str) return defaults;
        return str.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    };

    const [jobTitles, setJobTitles] = useState(parseList(jobPreference?.jobTitles, ['Software Engineer', 'Web Developer']));
    const [titleInput, setTitleInput] = useState('');

    const [locationTypes, setLocationTypes] = useState(parseList(jobPreference?.locationTypes, ['On-site', 'Hybrid']));
    
    const [locations, setLocations] = useState(parseList(jobPreference?.locations, ['Hyderabad, Telangana, India']));
    const [locationInput, setLocationInput] = useState('');

    const [startDate, setStartDate] = useState(jobPreference?.startDate || 'Immediately, I am actively applying');
    
    const [employmentTypes, setEmploymentTypes] = useState(parseList(jobPreference?.employmentTypes, ['Full-time', 'Internship']));
    const [visibility, setVisibility] = useState(jobPreference?.visibility || 'All LinkedIn members');

    const handleAddTitle = (e) => {
        if (e.key === 'Enter' && titleInput.trim()) {
            e.preventDefault();
            if(!jobTitles.includes(titleInput.trim())) setJobTitles([...jobTitles, titleInput.trim()]);
            setTitleInput('');
        }
    };
    const handleRemoveTitle = (title) => setJobTitles(jobTitles.filter(t => t !== title));

    const handleAddLocation = (e) => {
        if (e.key === 'Enter' && locationInput.trim()) {
            e.preventDefault();
            if(!locations.includes(locationInput.trim())) setLocations([...locations, locationInput.trim()]);
            setLocationInput('');
        }
    };
    const handleRemoveLocation = (loc) => setLocations(locations.filter(l => l !== loc));

    const togglePill = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item));
        else setList([...list, item]);
    };

    const handleSave = () => {
        onSave({
            jobTitles: jobTitles.join(', '),
            locationTypes: locationTypes.join(', '),
            locations: locations.join('; '),
            startDate,
            employmentTypes: employmentTypes.join(', '),
            visibility,
            noticePeriod: '',
            expectedSalary: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="edit-job-preferences-modal-content">
                <div className="edit-job-preferences-modal-header">
                    <h2>Edit job preferences</h2>
                    <button className="close-btn" onClick={onClose} disabled={saving}>
                        <MdClose />
                    </button>
                </div>
                
                <div className="edit-job-preferences-modal-body">
                    <p className="required-text">* Indicates required</p>

                    <div className="form-group">
                        <label>Job titles*</label>
                        <div className="pill-container">
                            {jobTitles.map(t => (
                                <span key={t} className="pill filled" onClick={() => handleRemoveTitle(t)}>
                                    {t} <MdClose className="pill-close"/>
                                </span>
                            ))}
                            <input 
                                className="add-input" 
                                placeholder="+ Add title (Press Enter)" 
                                value={titleInput} 
                                onChange={e => setTitleInput(e.target.value)}
                                onKeyDown={handleAddTitle}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location types*</label>
                        <div className="pill-container">
                            {['On-site', 'Hybrid', 'Remote'].map(type => {
                                const active = locationTypes.includes(type);
                                return (
                                    <span key={type} className={`pill ${active ? 'filled' : 'outline'}`} onClick={() => togglePill(locationTypes, setLocationTypes, type)}>
                                        {type} {active ? '✓' : '+'}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Locations (on-site)*</label>
                        <div className="pill-container column-layout">
                            {locations.map(l => (
                                <span key={l} className="pill filled wide" onClick={() => handleRemoveLocation(l)}>
                                    {l} <MdClose className="pill-close"/>
                                </span>
                            ))}
                            <input 
                                className="add-input wide" 
                                placeholder="+ Add location (Press Enter)" 
                                value={locationInput} 
                                onChange={e => setLocationInput(e.target.value)}
                                onKeyDown={handleAddLocation}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Start date</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="startDate" value="Immediately, I am actively applying" checked={startDate === 'Immediately, I am actively applying'} onChange={e => setStartDate(e.target.value)} />
                                <span>Immediately, I am actively applying</span>
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="startDate" value="Flexible, I am casually looking" checked={startDate === 'Flexible, I am casually looking'} onChange={e => setStartDate(e.target.value)} />
                                <span>Flexible, I am casually looking</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Employment types</label>
                        <div className="pill-container">
                            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'].map(type => {
                                const active = employmentTypes.includes(type);
                                return (
                                    <span key={type} className={`pill ${active ? 'filled' : 'outline'}`} onClick={() => togglePill(employmentTypes, setEmploymentTypes, type)}>
                                        {type} {active ? '✓' : '+'}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Visibility (who can view you're open to work)*</label>
                        <div className="radio-group visibility-settings">
                            <label className="radio-label visibility-option">
                                <input type="radio" name="visibility" value="Recruiters only" checked={visibility === 'Recruiters only'} onChange={e => setVisibility(e.target.value)} />
                                <div className="visibility-info">
                                    <strong>Recruiters only</strong>
                                    <p>Limited to people using LinkedIn Recruiter</p>
                                    <span className="tiny-text">When we take steps not to show recruiters at your current company, we can't guarantee complete privacy.</span>
                                </div>
                                <div className="avatar-preview tiny-avatar">h</div>
                            </label>
                            <label className="radio-label visibility-option">
                                <input type="radio" name="visibility" value="All LinkedIn members" checked={visibility === 'All LinkedIn members'} onChange={e => setVisibility(e.target.value)} />
                                <div className="visibility-info">
                                    <strong>All LinkedIn members</strong>
                                    <p>Includes recruiters and people at your current company</p>
                                    <span className="tiny-text">This selection adds the #OpenToWork photo frame</span>
                                </div>
                                <div className="avatar-preview tiny-avatar with-frame">h</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="edit-job-preferences-modal-footer">
                    <button className="btn-outline-secondary delete-btn" disabled={saving}>Delete</button>
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
            </div>
        </div>
    );
};

export default EditJobPreferencesModal;
