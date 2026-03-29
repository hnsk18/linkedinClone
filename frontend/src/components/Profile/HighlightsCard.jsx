import React from 'react';
import './HighlightsCard.css';
import { BsStars } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';

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
                        <img src="https://via.placeholder.com/48" alt="CVR College" />
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
