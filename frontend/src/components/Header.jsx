import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../images/logo.svg";

export default function Header() {
  const location = useLocation();
  const showNav = !["login", "register"].some(path => location.pathname.includes(path));

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/home" className="brand">
          <img src={logo} alt="LinkUp" />
        </Link>
        {showNav && (
          <nav className="header-nav">
            <Link to="/home" className={`nav-item ${isActive("/home")}`}>🏠 Home</Link>
            <Link to="/mynetwork" className={`nav-item ${isActive("/mynetwork")}`}>👥 My Network</Link>
            <Link to="/jobs" className={`nav-item ${isActive("/jobs")}`}>💼 Jobs</Link>
            <Link to="/messaging" className={`nav-item ${isActive("/messaging")}`}>💬 Messaging</Link>
            <a href="#" className="nav-item">🔔 Notifications</a>
            <a href="#" className="nav-item">👤 Me</a>
            <a href="#" className="nav-item">📊 For Business</a>
          </nav>
        )}
      </div>
    </header>
  );
}
