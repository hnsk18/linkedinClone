import React from 'react';
import { FaPlus, FaPen, FaArrowRight } from 'react-icons/fa';
import './ExperienceCard.css'; // Reusing some CSS from ExperienceCard

const SkillsCard = () => {
    return (
        <div className="card experience-card">
            <div className="card-content">
                <div className="section-header">
                    <h2 className="card-title">Skills</h2>
                    <div className="section-actions">
                        <button className="icon-btn"><FaPlus /></button>
                        <button className="icon-btn"><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    <div className="experience-item" style={{ flexDirection: 'column', gap: '8px' }}>
                        <h3 className="role-title">Python (Programming Language)</h3>
                        <div className="skills-used" style={{ marginTop: '0' }}>
                            <img src="https://via.placeholder.com/24" alt="Company logo" style={{ width: 24, height: 24 }} />
                            <span>Student at Smart Interviews</span>
                        </div>
                        <div className="skills-used" style={{ marginTop: '0' }}>
                            <img src="https://via.placeholder.com/24" alt="Company logo" style={{ width: 24, height: 24 }} />
                            <span>Smart Interviews</span>
                        </div>
                    </div>

                    <div className="card-divider" style={{ width: '100%', margin: '8px 0' }}></div>

                    <div className="experience-item" style={{ flexDirection: 'column', gap: '8px' }}>
                        <h3 className="role-title">Java Development</h3>
                        <div className="skills-used" style={{ marginTop: '0' }}>
                            <img src="https://via.placeholder.com/24" alt="Company logo" style={{ width: 24, height: 24 }} />
                            <span>Student at Smart Interviews</span>
                        </div>
                        <div className="skills-used" style={{ marginTop: '0' }}>
                            <img src="https://via.placeholder.com/24" alt="Company logo" style={{ width: 24, height: 24 }} />
                            <span>Smart Interviews</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer" style={{ borderTop: '1px solid var(--li-border-light)' }}>
                Show all 4 skills <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default SkillsCard;
