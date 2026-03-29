import React, { useState } from 'react';
import { MdClose, MdExpandMore, MdExpandLess } from 'react-icons/md';
import './AddProfileSectionModal.css';

const AddProfileSectionModal = ({ onClose, onOpenModal }) => {
    const [expandedSection, setExpandedSection] = useState('Core');

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleAction = (type) => {
        if (onOpenModal) {
            onOpenModal(type);
        }
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="add-profile-modal-content">
                <div className="add-profile-modal-header">
                    <h2>Add to profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>
                
                <div className="add-profile-modal-body">
                    <div className="ai-setup-section">
                        <h3>Set up your profile in minutes with a resume</h3>
                        <p>Upload a recent resume to fill out your profile with the help of AI.</p>
                        <button className="btn-primary get-started-btn">Get started</button>
                    </div>

                    <div className="manual-setup-section">
                        <h4>Manual setup</h4>
                        
                        <div className="accordion-item">
                            <button 
                                className="accordion-header" 
                                onClick={() => toggleSection('Core')}
                            >
                                <span>Core</span>
                                {expandedSection === 'Core' ? <MdExpandLess /> : <MdExpandMore />}
                            </button>
                            {expandedSection === 'Core' && (
                                <div className="accordion-body">
                                    <p className="accordion-description">
                                        Start with the basics. Filling out these sections will help you be discovered by recruiters and people you may know
                                    </p>
                                    <ul className="accordion-list">
                                        <li><button onClick={() => handleAction('intro')}>Add about</button></li>
                                        <li><button onClick={() => handleAction('education')}>Add education</button></li>
                                        <li><button onClick={() => handleAction('experience')}>Add position</button></li>
                                        <li><button>Add services</button></li>
                                        <li><button>Add career break</button></li>
                                        <li><button onClick={() => handleAction('skill')}>Add skills</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="accordion-item">
                            <button 
                                className="accordion-header" 
                                onClick={() => toggleSection('Recommended')}
                            >
                                <span>Recommended</span>
                                {expandedSection === 'Recommended' ? <MdExpandLess /> : <MdExpandMore />}
                            </button>
                            {expandedSection === 'Recommended' && (
                                <div className="accordion-body">
                                    <p className="accordion-description">
                                        Completing these sections will increase your credibility and give you access to more opportunities
                                    </p>
                                    <ul className="accordion-list">
                                        <li><button>Add featured</button></li>
                                        <li><button onClick={() => handleAction('cert')}>Add licenses & certifications</button></li>
                                        <li><button>Add projects</button></li>
                                        <li><button>Add courses</button></li>
                                        <li><button>Add recommendations</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="accordion-item">
                            <button 
                                className="accordion-header" 
                                onClick={() => toggleSection('Additional')}
                            >
                                <span>Additional</span>
                                {expandedSection === 'Additional' ? <MdExpandLess /> : <MdExpandMore />}
                            </button>
                            {expandedSection === 'Additional' && (
                                <div className="accordion-body">
                                    <p className="accordion-description">
                                        Add even more personality to your profile
                                    </p>
                                    <ul className="accordion-list">
                                        <li><button>Add volunteer experience</button></li>
                                        <li><button>Add publications</button></li>
                                        <li><button>Add patents</button></li>
                                        <li><button>Add honors & awards</button></li>
                                        <li><button>Add test scores</button></li>
                                        <li><button>Add languages</button></li>
                                        <li><button>Add organizations</button></li>
                                        <li><button>Add causes</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProfileSectionModal;
