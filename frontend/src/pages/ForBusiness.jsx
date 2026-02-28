import React from "react";
import "../styles/forbusiness.css";

export default function ForBusiness() {
  return (
    <div className="forbusiness-container">
      {/* Left Sidebar */}
      <aside className="forbusiness-sidebar-left">
        <div className="profile-card">
          <div className="profile-header-bg"></div>
          <div className="profile-content">
            <div className="profile-avatar">h</div>
            <h3>hemanth naga s...</h3>
            <p className="school-badge">📊</p>
            <p className="school-name">Attended CVR College of Engineering, Hyderabad</p>
            <p className="location">Guntur East, Andhra Pradesh</p>

            <div className="stats-section">
              <div className="stat">
                <p className="stat-label">Profile viewers</p>
                <p className="stat-value">30</p>
              </div>
              <div className="stat">
                <p className="stat-label">Post impressions</p>
                <p className="stat-value">12</p>
              </div>
            </div>

            <button className="premium-features">🟠 Your Premium features</button>
          </div>
        </div>

        <div class="sidebar-menu">
          <a href="#" className="menu-item">
            <span className="icon">📌</span> Saved items
          </a>
          <a href="#" className="menu-item">
            <span className="icon">👥</span> Groups
          </a>
          <a href="#" className="menu-item">
            <span className="icon">📰</span> Newsletters
          </a>
          <a href="#" className="menu-item">
            <span className="icon">🎯</span> Events
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="forbusiness-main">
        <div className="apps-section">
          <h2>My Apps</h2>

          <div className="apps-grid">
            <div className="app-card">
              <div className="app-icon">🎯</div>
              <h3>Find Leads</h3>
              <p>Identify and connect with prospects</p>
            </div>

            <div className="app-card">
              <div className="app-icon">👥</div>
              <h3>Groups</h3>
              <p>Build and manage communities</p>
            </div>

            <div className="app-card">
              <div className="app-icon">💳</div>
              <h3>Manage Billing</h3>
              <p>Control your account billing</p>
            </div>
          </div>

          <div className="talent-section">
            <h3>Talent</h3>
            <div className="talent-apps">
              <div className="talent-card">
                <div className="talent-icon">🤖</div>
                <h4>Hire with AI</h4>
                <p>Find the right candidates faster</p>
              </div>

              <div className="talent-card">
                <div className="talent-icon">📊</div>
                <h4>Talent Insights</h4>
                <p>Understand your talent landscape</p>
              </div>
            </div>
          </div>

          <div className="sales-section">
            <h3>Sales</h3>
            <div className="sales-card">
              <div className="sales-icon">🏪</div>
              <h4>Services Marketplace</h4>
              <p>Find vetted service providers</p>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="forbusiness-sidebar-right">
        <div className="business-section">
          <h2>Explore more for business</h2>

          <div className="business-options">
            <div className="business-card">
              <h3>Hire on LinkedIn</h3>
              <p>Find, attract and recruit talent</p>
            </div>

            <div className="business-card">
              <h3>Sell with LinkedIn</h3>
              <p>Build relationships with buyers</p>
            </div>

            <div className="business-card">
              <h3>Post a job for free</h3>
              <p>Find quality candidates</p>
            </div>

            <div className="business-card">
              <h3>Advertise on LinkedIn</h3>
              <p>Acquire customers and grow your business</p>
            </div>

            <div className="business-card">
              <h3>Get started with Premium</h3>
              <p>Expand and leverage your network</p>
            </div>

            <div className="business-card">
              <h3>Learn with LinkedIn</h3>
              <p>Courses to develop your employees</p>
            </div>

            <div className="business-card">
              <h3>Admin Center</h3>
              <p>Manage Billing and Account Details</p>
            </div>

            <div className="business-card create-page">
              <h3>Create a Company Page</h3>
              <span className="plus-icon">+</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
