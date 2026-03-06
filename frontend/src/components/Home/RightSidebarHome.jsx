import React from 'react';
import { FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './RightSidebarHome.css';

const RightSidebarHome = () => {
    return (
        <div className="home-right-sidebar">
            <div className="card news-card">
                <div className="card-content">
                    <div className="flex-between mb-2">
                        <h2 className="news-title">LinkedIn News</h2>
                        <FaInfoCircle className="info-icon" />
                    </div>

                    <h3 className="news-subtitle">Top stories</h3>

                    <ul className="news-list">
                        <li>
                            <div className="news-item">
                                <div className="bullet"></div>
                                <div>
                                    <h4>Apple's big reveal includes faster, cheaper...</h4>
                                    <p>2h ago · 44,225 readers</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="news-item">
                                <div className="bullet"></div>
                                <div>
                                    <h4>Amazon lays off employees in robotics unit</h4>
                                    <p>12h ago · 12,231 readers</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="news-item">
                                <div className="bullet"></div>
                                <div>
                                    <h4>Morgan Stanley cuts 2,500 jobs</h4>
                                    <p>4h ago · 7,620 readers</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="news-item">
                                <div className="bullet"></div>
                                <div>
                                    <h4>Indian airlines boost operations</h4>
                                    <p>10h ago · 2,850 readers</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="news-item">
                                <div className="bullet"></div>
                                <div>
                                    <h4>How women power progress</h4>
                                    <p>11h ago · 505 readers</p>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <button className="show-more-btn">
                        Show more <FaChevronDown className="ml-1 text-sm" />
                    </button>

                    <h3 className="news-subtitle mt-3">Today's puzzles</h3>
                    <div className="puzzle-list">
                        <div className="puzzle-item flex-between">
                            <div className="puzzle-info">
                                <img src="https://via.placeholder.com/32/FF7F50" alt="Zip" className="puzzle-icon" />
                                <div>
                                    <h4>Zip <span className="text-secondary font-normal">#353</span></h4>
                                    <p>3 connections played</p>
                                </div>
                            </div>
                            <FaChevronRight className="arrow-icon" />
                        </div>

                        <div className="puzzle-item flex-between">
                            <div className="puzzle-info">
                                <img src="https://via.placeholder.com/32/90EE90" alt="Mini Sudoku" className="puzzle-icon" />
                                <div>
                                    <h4>Mini Sudoku <span className="text-secondary font-normal">#206</span></h4>
                                    <p>2 connections played</p>
                                </div>
                            </div>
                            <FaChevronRight className="arrow-icon" />
                        </div>

                        <div className="puzzle-item flex-between">
                            <div className="puzzle-info">
                                <img src="https://via.placeholder.com/32/87CEFA" alt="Tango" className="puzzle-icon" />
                                <div>
                                    <h4>Tango <span className="text-secondary font-normal">#514</span></h4>
                                    <p>2 connections played</p>
                                </div>
                            </div>
                            <FaChevronRight className="arrow-icon" />
                        </div>

                        <div className="puzzle-item flex-between">
                            <div className="puzzle-info">
                                <img src="https://via.placeholder.com/32/DDA0DD" alt="Queens" className="puzzle-icon" />
                                <div>
                                    <h4>Queens <span className="text-secondary font-normal">#674</span></h4>
                                    <p>2 connections played</p>
                                </div>
                            </div>
                            <FaChevronRight className="arrow-icon" />
                        </div>
                    </div>
                    <button className="show-more-btn">
                        Show more <FaChevronDown className="ml-1 text-sm" />
                    </button>
                </div>
            </div>

            {/* Mini Ad Card */}
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
