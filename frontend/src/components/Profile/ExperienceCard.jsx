import React from 'react';
import { FaPlus, FaPen, FaGem } from 'react-icons/fa';
import './ExperienceCard.css';

const ExperienceCard = () => {
    return (
        <div className="card experience-card">
            <div className="card-content">
                <div className="section-header">
                    <h2 className="card-title">Experience</h2>
                    <div className="section-actions">
                        <button className="icon-btn"><FaPlus /></button>
                        <button className="icon-btn"><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    <div className="experience-item">
                        <img src="https://via.placeholder.com/48" alt="Company logo" className="org-logo" />
                        <div className="experience-details">
                            <h3 className="role-title">Student</h3>
                            <p className="company-name">Smart Interviews · Part-time</p>
                            <p className="duration">Mar 2025 - Feb 2026 · 1 yr</p>
                            <div className="skills-used">
                                <FaGem className="skill-icon" />
                                <span><strong>Python (Programming Language)</strong>, Java Development and +2 skills</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-content" style={{ paddingTop: '16px' }}>
                <div className="section-header">
                    <h2 className="card-title">Education</h2>
                    <div className="section-actions">
                        <button className="icon-btn"><FaPlus /></button>
                        <button className="icon-btn"><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    <div className="experience-item">
                        <img src="https://via.placeholder.com/48" alt="School logo" className="org-logo" />
                        <div className="experience-details">
                            <h3 className="role-title">CVR College of Engineering, Hyderabad</h3>
                            <p className="duration">2023</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-content" style={{ paddingTop: '16px' }}>
                <div className="section-header">
                    <h2 className="card-title">Licenses & certifications</h2>
                    <div className="section-actions">
                        <button className="icon-btn"><FaPlus /></button>
                        <button className="icon-btn"><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    <div className="experience-item">
                        <img src="https://via.placeholder.com/48" alt="Cert logo" className="org-logo" />
                        <div className="experience-details">
                            <h3 className="role-title">Smart Interviews</h3>
                            <p className="company-name">Smart Interviews</p>
                            <p className="duration">Issued Feb 2026</p>
                            <p className="credential-id">Credential ID hemanth06</p>
                            <button className="btn-outline mt-2 credential-btn">Show credential <FaGem style={{ marginLeft: '4px' }} /></button>
                        </div>
                    </div>

                    <div className="experience-item">
                        <img src="https://via.placeholder.com/48" alt="Cert logo" className="org-logo" />
                        <div className="experience-details">
                            <h3 className="role-title">Deloitte Australia - Technology Job Simulation</h3>
                            <p className="company-name">Forage</p>
                            <p className="duration">Issued Dec 2025</p>
                            <p className="credential-id">Credential ID e/WMejKxZ5QEN8uxQ</p>
                            <button className="btn-outline mt-2 credential-btn">Show credential <FaGem style={{ marginLeft: '4px' }} /></button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ExperienceCard;
