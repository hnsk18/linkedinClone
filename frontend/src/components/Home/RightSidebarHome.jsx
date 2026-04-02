import React from 'react';
import { FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './RightSidebarHome.css';

const RightSidebarHome = () => {
    return (
        <div className="home-right-sidebar">

            <div className="card ad-card-mini">
                <img src="https://via.placeholder.com/300x250/0A2540/FFFFFF?text=LinkedIn+Ad+Banner" alt="Ad" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div className="right-sidebar-footer">
                    <ul className="footer-links">
                        <li>About</li>
                        <li>Accessibility</li>
                        <li>Help Center</li>
                        <li>Privacy & Terms ▾</li>
                        <li>Ad Choices</li>
                        <li>Advertising</li>
                        <li>Business Services ▾</li>
                        <li>Get the LinkedIn app</li>
                        <li>More</li>
                    </ul>
                    <p className="footer-copyright">LinkedIn Corporation © 2026</p>
                </div>
            </div>
        </div>
    );
};

export default RightSidebarHome;
