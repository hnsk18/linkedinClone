import React from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import './InterestsCard.css';

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

const InterestsCard = () => {
    return (
        <div className="card interests-card">
            <div className="card-content">
                <h2 className="card-title">Interests</h2>

                <div className="interests-tabs">
                    <div className="tab active">Companies</div>
                    <div className="tab">Newsletters</div>
                    <div className="tab">Schools</div>
                </div>

                <div className="interests-grid">
                    <div className="interest-item">
                        <img src={placeholderLogo} alt="Microsoft" className="interest-logo" />
                        <div className="interest-details">
                            <h3 className="interest-name">Microsoft</h3>
                            <p className="interest-followers">27,704,003 followers</p>
                            <button className="btn-outline interest-btn"><FaCheck /> Following</button>
                        </div>
                    </div>

                    <div className="interest-item">
                        <img src={placeholderLogo} alt="Google" className="interest-logo" />
                        <div className="interest-details">
                            <h3 className="interest-name">Google</h3>
                            <p className="interest-followers">41,023,929 followers</p>
                            <button className="btn-outline interest-btn"><FaCheck /> Following</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                Show all companies <FaArrowRight className="footer-icon" />
            </div>
        </div>
    );
};

export default InterestsCard;
