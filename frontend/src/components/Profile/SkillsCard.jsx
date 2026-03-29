import React from 'react';
import { FaPlus, FaPen, FaArrowRight } from 'react-icons/fa';
import './ExperienceCard.css'; // Reusing some CSS from ExperienceCard

const SkillsCard = ({ skills, onAddSkill, onEditSkills }) => {
    const skillList = skills || [];

    return (
        <div className="card experience-card">
            <div className="card-content">
                <div className="section-header">
                    <h2 className="card-title">Skills</h2>
                    <div className="section-actions">
                        <button className="icon-btn" onClick={onAddSkill}><FaPlus /></button>
                        <button className="icon-btn" onClick={onEditSkills}><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    {skillList.length === 0 && (
                        <p className="duration">Add your skills</p>
                    )}
                    {skillList.map((skill, index) => (
                        <div
                            className="experience-item"
                            style={{ flexDirection: 'column', gap: '8px' }}
                            key={`${skill.id ?? 'skill'}-${index}`}
                        >
                            <h3 className="role-title">{skill.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card-footer" style={{ borderTop: '1px solid var(--li-border-light)' }}>
                Show all skills <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default SkillsCard;
