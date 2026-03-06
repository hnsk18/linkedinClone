import React from 'react';
import { FaPen, FaUsers, FaEye } from 'react-icons/fa';
import './RightSidebar.css';

const RightSidebar = () => {
    return (
        <div className="right-sidebar">
            <div className="card language-url-card">
                <div className="card-content">
                    <div className="card-header">
                        <h3>Profile language</h3>
                        <button className="icon-btn-small"><FaPen /></button>
                    </div>
                    <p className="text-secondary">English</p>

                    <div className="divider"></div>

                    <div className="card-header">
                        <h3>Public profile & URL</h3>
                        <button className="icon-btn-small"><FaPen /></button>
                    </div>
                    <p className="text-secondary text-url">www.linkedin.com/in/hemanth-naga-sai-kumar</p>
                </div>
            </div>

            <div className="card ad-card">
                <div className="card-content">
                    <p className="promoted-text">Promoted <span className="dots">...</span></p>
                    <div className="ad-content">
                        <div className="ad-logos">
                            <img src="https://via.placeholder.com/32" alt="Axis" />
                        </div>
                        <h4>Axis Mutual Fund</h4>
                        <p>Invest in Mutual Funds today</p>
                        <p className="ad-desc">Achieve financial freedom with disciplined SIP investments</p>
                        <button className="btn-outline-primary w-100">Follow</button>
                    </div>
                </div>
            </div>

            <div className="card list-card">
                <div className="card-content">
                    <h3 className="card-title">People you may know</h3>
                    <p className="list-subtitle">From your company</p>
                    <div className="mini-profile">
                        <img src="https://via.placeholder.com/48" alt="Profile" className="mini-avatar" />
                        <div className="mini-info">
                            <h4>Veerlapati Ravi Varma <span className="verified">✓</span></h4>
                            <p>Student at CVR College of Engineering | AIML'27 | Java...</p>
                            <button className="btn-outline round-btn"><FaUsers /> Connect</button>
                        </div>
                    </div>
                    <div className="mini-profile">
                        <img src="https://via.placeholder.com/48" alt="Profile" className="mini-avatar" />
                        <div className="mini-info">
                            <h4>Pranaydeep Kakkerla</h4>
                            <p>Data Science Student | Problem Solver | Java | Full Stack Dev</p>
                            <button className="btn-outline round-btn"><FaUsers /> Connect</button>
                        </div>
                    </div>
                    <div className="mini-profile">
                        <img src="https://via.placeholder.com/48" alt="Profile" className="mini-avatar" />
                        <div className="mini-info">
                            <h4>Sainath Reddy Kottakapu</h4>
                            <p>Web Developer | MERN Stack | Cyber Security LeetCode Knig...</p>
                            <button className="btn-outline round-btn"><FaUsers /> Connect</button>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-center">
                    Show all
                </div>
            </div>

        </div>
    );
};

export default RightSidebar;
