import React from 'react';
import './AboutCard.css';
import { FaPen } from 'react-icons/fa';

const AboutCard = ({ user, isMyProfile, onEdit }) => {
    // Determine the content to display. If the user doesn't have an about section, show a placeholder or nothing.
    const aboutContent = user?.about || "I am a motivated Computer Science student with a strong foundation in data structures, algorithms and Web development, with LeetCode 1700+ rating, CodeChef 2star.";

    return (
        <div className="card about-card-container">
            <div className="about-header">
                <h2>About</h2>
                {isMyProfile && (
                    <button className="icon-btn" onClick={onEdit}>
                        <FaPen />
                    </button>
                )}
            </div>
            <div className="about-content">
                <p>{aboutContent}</p>
            </div>
        </div>
    );
};

export default AboutCard;
