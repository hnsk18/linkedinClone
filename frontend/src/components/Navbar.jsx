import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBriefcase, FaCommentDots, FaBell, FaTh, FaSignOutAlt } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import logo from '../images/logo.svg';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const getNavLinkClass = ({ isActive }) =>
        `nav-item-main${isActive ? ' active' : ''}`;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="logo-wrapper">
                        <img src={logo} alt="LinkUp" className="linkedin-logo" />
                    </div>
                    <div className="search-box">
                        <BsSearch className="search-icon" />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                <ul className="navbar-nav">
                    <li>
                        <NavLink to="/home" className={getNavLinkClass}>
                            <FaHome size={24} />
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mynetwork" className={getNavLinkClass}>
                            <FaUserFriends size={24} />
                            <span>My Network</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/jobs" className={getNavLinkClass}>
                            <FaBriefcase size={24} />
                            <span>Jobs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messaging" className={getNavLinkClass}>
                            <FaCommentDots size={24} />
                            <span>Messaging</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/notifications" className={getNavLinkClass}>
                            <div className="nav-icon-badge">
                                <FaBell size={24} />
                                <span className="badge">10</span>
                            </div>
                            <span>Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={getNavLinkClass}>
                            <div className="me-avatar">h</div>
                            <span>Me ▼</span>
                        </NavLink>
                    </li>
                    <li className="nav-divider" />
                    <li>
                        <NavLink to="/forbusiness" className={getNavLinkClass}>
                            <FaTh size={24} />
                            <span>For Business ▼</span>
                        </NavLink>
                    </li>
                    <li>
                        <button type="button" className="nav-item-main premium-link">
                            <span>Learning</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="nav-item-main logout-btn" onClick={handleLogout} title="Sign out">
                            <FaSignOutAlt size={24} />
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
