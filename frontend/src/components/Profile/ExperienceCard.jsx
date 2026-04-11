import React from 'react';
import { FaPlus, FaPen, FaGem } from 'react-icons/fa';
import './ExperienceCard.css';

const placeholderLogo =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#E9EEF3"/>
            <path d="M12 32.5V15.5C12 14.1193 13.1193 13 14.5 13H33.5C34.8807 13 36 14.1193 36 15.5V32.5C36 33.8807 34.8807 35 33.5 35H14.5C13.1193 35 12 33.8807 12 32.5Z" fill="#C8D2DC"/>
            <circle cx="20" cy="21" r="3" fill="#8FA3B8"/>
            <path d="M13 31L19 25.5C19.5523 24.9893 20.3977 24.9893 20.95 25.5L25 29.25L28.05 26.35C28.5732 25.8539 29.3768 25.8539 29.9 26.35L35 31V33.5C35 34.0523 34.5523 34.5 34 34.5H14C13.4477 34.5 13 34.0523 13 33.5V31Z" fill="#8FA3B8"/>
        </svg>
    `);

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
                            <img src={placeholderLogo} alt="Company logo" className="org-logo" />
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
                            <img src={placeholderLogo} alt="School logo" className="org-logo" />
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
                            <img src={placeholderLogo} alt="Cert logo" className="org-logo" />
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
