import React from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import './InterestsCard.css';

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
                        <img src="https://via.placeholder.com/48" alt="Microsoft" className="interest-logo" />
                        <div className="interest-details">
                            <h3 className="interest-name">Microsoft</h3>
                            <p className="interest-followers">27,704,003 followers</p>
                            <button className="btn-outline interest-btn"><FaCheck /> Following</button>
                        </div>
                    </div>

                    <div className="interest-item">
                        <img src="https://via.placeholder.com/48" alt="Google" className="interest-logo" />
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
