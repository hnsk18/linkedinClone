import React from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../images/logo.svg";

export default function Header() {
  const location = useLocation();
  const showNav = !["login", "register"].some(path => location.pathname.includes(path));

  const isActive = (path) => location.pathname === path ? "active" : "";

  const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M23 9v2h-2v7a3 3 0 0 1-3 3h-4v-6h-4v6H6a3 3 0 0 1-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
    </svg>
  );

  const NetworkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 16v6H3v-6a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3m5.5-3A3.5 3.5 0 1 0 14 9.5a3.5 3.5 0 0 0 3.5 3.5m1 2h-2a2.5 2.5 0 0 0-2.5 2.5V22h7v-4.5a2.5 2.5 0 0 0-2.5-2.5M7.5 2A4.5 4.5 0 1 0 12 6.5 4.49 4.49 0 0 0 7.5 2"></path>
    </svg>
  );

  const JobsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M17 6V5a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1H2v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6zM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9zm10 9a4 4 0 0 0 3-1.38V17a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-4.38A4 4 0 0 0 5 14z"></path>
    </svg>
  );

  const MessagingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M16 4H8a7 7 0 0 0 0 14h4v4l8.16-5.39A6.78 6.78 0 0 0 23 11a7 7 0 0 0-7-7m-8 8.25A1.25 1.25 0 1 1 9.25 11 1.25 1.25 0 0 1 8 12.25m4 0A1.25 1.25 0 1 1 13.25 11 1.25 1.25 0 0 1 12 12.25m4 0A1.25 1.25 0 1 1 17.25 11 1.25 1.25 0 0 1 16 12.25"></path>
    </svg>
  );

  const NotificationsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M22 19h-8.28a2 2 0 1 1-3.44 0H2v-1a4.52 4.52 0 0 1 1.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0 1 22 18zM18.21 7.44A6.27 6.27 0 0 0 12 2a6.27 6.27 0 0 0-6.21 5.44L5 13h14z"></path>
    </svg>
  );

  const MeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M12 14c-6 0-8 3-8 5v5h16v-5c0-2-2-5-8-5z"></path>
    </svg>
  );

  const BusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path d="M3 2h18a1 1 0 0 1 1 1v2h-2V4H4v14h4v2H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 8h3v3h-3zm5-6h3v3h-3zm0 5h3v3h-3z"></path>
    </svg>
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/home" className="brand">
          <img src={logo} alt="LinkUp" />
        </Link>
        {showNav && (
          <nav className="header-nav">
            <Link to="/home" className={`nav-item ${isActive("/home")}`}>
              <HomeIcon />
              <span>Home</span>
            </Link>
            <Link to="/mynetwork" className={`nav-item ${isActive("/mynetwork")}`}>
              <NetworkIcon />
              <span>My Network</span>
            </Link>
            <Link to="/jobs" className={`nav-item ${isActive("/jobs")}`}>
              <JobsIcon />
              <span>Jobs</span>
            </Link>
            <Link to="/messaging" className={`nav-item ${isActive("/messaging")}`}>
              <MessagingIcon />
              <span>Messaging</span>
            </Link>
            <Link to="/notifications" className={`nav-item ${isActive("/notifications")}`}>
              <NotificationsIcon />
              <span>Notifications</span>
            </Link>
            <Link to="/profile" className={`nav-item ${isActive("/profile")}`}>
              <MeIcon />
              <span>Me</span>
            </Link>
            <Link to="/forbusiness" className={`nav-item ${isActive("/forbusiness")}`}>
              <BusinessIcon />
              <span>For Business</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
