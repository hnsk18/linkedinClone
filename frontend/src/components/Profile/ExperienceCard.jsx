import React from 'react';
import { FaPlus, FaPen, FaGem } from 'react-icons/fa';
import './ExperienceCard.css';

const ExperienceCard = ({
    experiences,
    education,
    certifications,
    onAddExperience,
    onAddEducation,
    onAddCertification,
    onEditExperience,
    onEditEducation,
    onEditCertification
}) => {
    const experienceList = experiences || [];
    const educationList = education || [];
    const certificationList = certifications || [];

    return (
        <div className="card experience-card">
            <div className="card-content">
                <div className="section-header">
                    <h2 className="card-title">Experience</h2>
                    <div className="section-actions">
                        <button className="icon-btn" onClick={onAddExperience}><FaPlus /></button>
                        <button className="icon-btn" onClick={onEditExperience}><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    {experienceList.length === 0 && (
                        <p className="duration">Add your experience</p>
                    )}
                    {experienceList.map(exp => (
                        <div className="experience-item" key={exp.id}>
                            <img src="https://via.placeholder.com/48" alt="Company logo" className="org-logo" />
                            <div className="experience-details">
                                <h3 className="role-title">{exp.title}</h3>
                                <p className="company-name">
                                    {exp.company}
                                    {exp.employmentType ? ` · ${exp.employmentType}` : ''}
                                </p>
                                <p className="duration">
                                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Present'}
                                </p>
                                {exp.description && (
                                    <div className="skills-used">
                                        <FaGem className="skill-icon" />
                                        <span>{exp.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-content" style={{ paddingTop: '16px' }}>
                <div className="section-header">
                    <h2 className="card-title">Education</h2>
                    <div className="section-actions">
                        <button className="icon-btn" onClick={onAddEducation}><FaPlus /></button>
                        <button className="icon-btn" onClick={onEditEducation}><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    {educationList.length === 0 && (
                        <p className="duration">Add your education</p>
                    )}
                    {educationList.map(edu => (
                        <div className="experience-item" key={edu.id}>
                            <img src="https://via.placeholder.com/48" alt="School logo" className="org-logo" />
                            <div className="experience-details">
                                <h3 className="role-title">{edu.collegeName}</h3>
                                <p className="company-name">
                                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(' · ')}
                                </p>
                                <p className="duration">
                                    {edu.startYear} {edu.endYear ? `- ${edu.endYear}` : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-divider"></div>

            <div className="card-content" style={{ paddingTop: '16px' }}>
                <div className="section-header">
                    <h2 className="card-title">Licenses & certifications</h2>
                    <div className="section-actions">
                        <button className="icon-btn" onClick={onAddCertification}><FaPlus /></button>
                        <button className="icon-btn" onClick={onEditCertification}><FaPen /></button>
                    </div>
                </div>

                <div className="experience-list">
                    {certificationList.length === 0 && (
                        <p className="duration">Add your certifications</p>
                    )}
                    {certificationList.map(cert => (
                        <div className="experience-item" key={cert.id}>
                            <img src="https://via.placeholder.com/48" alt="Cert logo" className="org-logo" />
                            <div className="experience-details">
                                <h3 className="role-title">{cert.title}</h3>
                                <p className="company-name">{cert.organization}</p>
                                <p className="duration">
                                    {cert.issueDate ? `Issued ${cert.issueDate}` : ''}
                                </p>
                                {cert.credentialId && (
                                    <p className="credential-id">Credential ID {cert.credentialId}</p>
                                )}
                                {cert.credentialUrl && (
                                    <button className="btn-outline mt-2 credential-btn">
                                        Show credential <FaGem style={{ marginLeft: '4px' }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ExperienceCard;
