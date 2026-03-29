import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBriefcase, FaCommentDots, FaBell, FaTh, FaSignOutAlt } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import logo from '../images/logo.svg';
import './Navbar.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const Navbar = () => {
    const navigate = useNavigate();
    const getNavLinkClass = ({ isActive }) =>
        `nav-item-main${isActive ? ' active' : ''}`;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const boxRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const token = useMemo(() => {
        let t = localStorage.getItem("token");
        if (!t) return null;
        return t.replace(/^"|"$/g, "");
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    useEffect(() => {
        const onDocDown = (e) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    useEffect(() => {
        const q = query.trim();
        setError(null);
        if (!q) {
            setResults([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(q)}&limit=8`, {
                    signal: controller.signal,
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    }
                });
                if (!res.ok) throw new Error(`Search failed (${res.status})`);
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
                setOpen(true);
            } catch (e) {
                if (e?.name === "AbortError") return;
                console.error(e);
                setError("Search failed");
                setResults([]);
                setOpen(true);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => {
            clearTimeout(t);
            controller.abort();
        };
    }, [query, token]);

    const onSelect = (userId) => {
        setOpen(false);
        setQuery("");
        setResults([]);
        navigate(`/profile/${userId}`);
    };

    return (
        <>
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="logo-wrapper">
                        <img src={logo} alt="LinkUp" className="linkedin-logo" />
                    </div>
                    <div className="search-box" ref={boxRef}>
                        <BsSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => query.trim() && setOpen(true)}
                            aria-label="Search people"
                        />

                        {open && (query.trim() || loading || error) && (
                            <div className="search-dropdown" role="listbox">
                                {loading && <div className="search-dropdown-row muted">Searching…</div>}
                                {error && !loading && <div className="search-dropdown-row muted">{error}</div>}
                                {!loading && !error && results.length === 0 && (
                                    <div className="search-dropdown-row muted">No results</div>
                                )}
                                {!loading && !error && results.map((u) => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        className="search-dropdown-item"
                                        onClick={() => onSelect(u.id)}
                                        role="option"
                                    >
                                        <div className="search-avatar">
                                            {(u?.name?.[0] || "U").toUpperCase()}
                                        </div>
                                        <div className="search-meta">
                                            <div className="search-name">{u.name || u.email || "Unknown"}</div>
                                            <div className="search-subtitle">
                                                {[u.headline, u.location].filter(Boolean).join(" • ")}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
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

        {showLogoutModal && (
            <div className="logout-modal-overlay" onClick={cancelLogout}>
                <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="logout-modal-icon">
                        <FaSignOutAlt size={32} />
                    </div>
                    <h3 className="logout-modal-title">Sign out of LinkedIn?</h3>
                    <p className="logout-modal-text">Are you sure you want to log out of your account?</p>
                    <div className="logout-modal-actions">
                        <button className="logout-modal-cancel" onClick={cancelLogout}>Cancel</button>
                        <button className="logout-modal-confirm" onClick={confirmLogout}>Sign Out</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Navbar;
