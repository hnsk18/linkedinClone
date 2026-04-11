import React from 'react';
import './HighlightsCard.css';
import { BsStars } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';

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

const HighlightsCard = () => {
    return (
        <div className="card highlights-card-container">
            <div className="highlights-header">
                <h2>Highlights</h2>
            </div>
            
            <div className="highlights-grid">
                <div className="highlight-item">
                    <div className="highlight-icon">
                        <img src="https://ui-avatars.com/api/?name=SI&background=fff&color=000&rounded=true" alt="Smart Interviews" />
                    </div>
                    <div className="highlight-info">
                        <h3>You both worked at Smart Interviews</h3>
                        <p>You both worked at Smart Interviews from March 2025 to February 2026</p>
                        <button className="btn-outline highlight-btn">
                            <BsStars className="btn-icon star-icon" /> Ask about experience
                        </button>
                    </div>
                </div>

                <div className="highlight-item">
                    <div className="highlight-icon">
                        <img src={placeholderLogo} alt="CVR College" />
                    </div>
                    <div className="highlight-info">
                        <h3>You both studied at CVR College of Engineering, Hyderabad</h3>
                        <p>You both studied at CVR College of Engineering, Hyderabad from 2023 to 2027</p>
                        <button className="btn-outline highlight-btn">
                            <FaTelegramPlane className="btn-icon" /> Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightsCard;
