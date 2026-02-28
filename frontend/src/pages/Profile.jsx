import React, { useState } from "react";
import "../styles/profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="profile-container">
      {/* Main Profile Section */}
      <main className="profile-main">
        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="profile-banner"></div>
          
          <div className="profile-info">
            <div className="profile-avatar-large">h</div>
            
            <div className="profile-header-content">
              <div className="profile-name-section">
                <h1>hemanth naga sai kumar</h1>
                <span className="verification-badge">✓</span>
              </div>
              <p className="profile-title">He/Him</p>
              <p className="profile-location">Attended CVR College of Engineering, Hyderabad</p>
              <p className="profile-area">Guntur East, Andhra Pradesh, India · <a href="#">Contact info</a></p>
              <p className="profile-connections"><strong>51 connections</strong></p>
            </div>

            <div className="profile-actions">
              <button className="btn-primary">Open to</button>
              <button className="btn-secondary">Add profile section</button>
              <button className="btn-secondary">Enhance profile</button>
              <button className="btn-secondary">Resources</button>
            </div>
          </div>
        </div>

        {/* Open to Work Section */}
        <div className="profile-card">
          <div className="card-header">
            <h3>Open to work</h3>
            <button className="edit-btn">✏️</button>
          </div>
          <p className="work-title">Software Engineer, Web Developer, Python Deve...</p>
          <a href="#" className="show-details">Show details</a>
          <p className="work-description">Showcase your services as a section on your profile so your business can be easily discovered.</p>
          <a href="#" className="get-started">Get started</a>
        </div>

        {/* Suggested Section */}
        <div className="profile-card">
          <h3>Suggested for you</h3>
          <p className="private-label">🔒 Private to you</p>
          
          <div className="suggestion-item">
            <div className="suggestion-icon">⭐</div>
            <div className="suggestion-content">
              <h4>🟠 PREMIUM</h4>
              <p><strong>Enhance your profile</strong></p>
              <p className="small-text">Stand out for almost 2x as many opportunities with the help of AI and much more.</p>
              <button className="enhance-btn">✨ Enhance with AI</button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="profile-card">
          <h3>Analytics</h3>
          <p className="private-label">🔒 Private to you</p>
          
          <div className="analytics-grid">
            <div className="analytics-item">
              <p className="analytics-title">30 profile views</p>
              <p className="analytics-subtitle">Discover who's viewed your profile</p>
            </div>
            <div className="analytics-item">
              <p className="analytics-title">11 post impressions</p>
              <p className="analytics-subtitle">See who's engaging with your posts</p>
            </div>
            <div className="analytics-item">
              <p className="analytics-title">5 search appearances</p>
              <p className="analytics-subtitle">See how often you appear in search results</p>
            </div>
          </div>
          
          <a href="#" className="show-analytics">Show all analytics →</a>
        </div>

        {/* Activity Section */}
        <div className="profile-card">
          <div className="activity-header">
            <h3>Activity</h3>
            <button className="create-post-btn">✏️ Create a post</button>
          </div>

          <div className="activity-tabs">
            <button 
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button 
              className={`tab ${activeTab === "comments" ? "active" : ""}`}
              onClick={() => setActiveTab("comments")}
            >
              Comments
            </button>
            <button 
              className={`tab ${activeTab === "videos" ? "active" : ""}`}
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </button>
          </div>

          {activeTab === "posts" && (
            <div className="activity-content">
              <div className="post-item">
                <div className="post-avatar">H</div>
                <div className="post-content">
                  <p className="post-text">hemanth naga sai kumar posted this · 2 days</p>
                  <div className="post-preview">
                    <p>🔥 Built a Gesture-Controlled Racing Game Interface</p>
                    <p className="preview-text">I've been experimenting with computer vision and human-computer interaction, and I built end-time gesture control system using...</p>
                  </div>
                  <p className="engagement">👍 12 · 3 comments</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="activity-content">
              <p className="no-content">No comments yet</p>
            </div>
          )}

          {activeTab === "videos" && (
            <div className="activity-content">
              <p className="no-content">No videos yet</p>
            </div>
          )}

          <a href="#" className="show-all">Show all posts →</a>
        </div>

        {/* Experience Section */}
        <div className="profile-card">
          <div className="section-header">
            <h3>Experience</h3>
            <button className="add-btn">+</button>
          </div>

          <div className="experience-item">
            <div className="exp-icon">🎓</div>
            <div className="exp-content">
              <h4>Student</h4>
              <p className="exp-company">Smart Interviews · Part-time</p>
              <p className="exp-date">May 2025 - Feb 2026 · 1 yr</p>
              <p className="exp-skills">🔧 <strong>Python (Programming Language)</strong>, Java Development and +2 skills</p>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-card">
          <div className="section-header">
            <h3>Education</h3>
            <button className="add-btn">+</button>
          </div>

          <div className="education-item">
            <div className="edu-icon">🏛️</div>
            <div className="edu-content">
              <h4>CVR College of Engineering, Hyderabad</h4>
              <p className="edu-field">2022</p>
            </div>
          </div>
        </div>

        {/* Licenses & Certifications */}
        <div className="profile-card">
          <div className="section-header">
            <h3>Licenses & certifications</h3>
            <button className="add-btn">+</button>
          </div>

          <div className="cert-item">
            <div className="cert-icon">🏅</div>
            <div className="cert-content">
              <h4>Deloitte Australia - Technology Job Simulation</h4>
              <p className="cert-issuer">Issued Dec 2023</p>
              <p className="cert-id">Credential ID: 9bNxAzGZblHmrU</p>
              <button className="show-cred">Show credential 🔗</button>
            </div>
          </div>

          <div className="cert-item">
            <div className="cert-icon">🎖️</div>
            <div className="cert-content">
              <h4>Smart Interviews</h4>
              <p className="cert-issuer">Smart Interviews</p>
              <p className="cert-id">Credential ID: hsmrschldb</p>
              <button className="show-cred">Show credential 🔗</button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="profile-card">
          <div className="section-header">
            <h3>Skills</h3>
            <button className="add-btn">+</button>
          </div>

          <div className="skill-item">
            <p><strong>Python (Programming Language)</strong></p>
            <p className="skill-endorsements">📌 Student at Smart Interviews</p>
          </div>

          <div className="skill-item">
            <p><strong>Java Development</strong></p>
            <p className="skill-endorsements">📌 Student at Smart Interviews</p>
          </div>

          <a href="#" className="show-all-skills">Show all 4 skills →</a>
        </div>

        {/* Interests Section */}
        <div className="profile-card">
          <h3>Interests</h3>
          
          <div className="interests-grid">
            <div className="interest-item">
              <div className="interest-icon">📊</div>
              <div className="interest-info">
                <h4>Google</h4>
                <p className="followers">2.6M followers</p>
              </div>
              <button className="follow-btn">✓ Following</button>
            </div>

            <div className="interest-item">
              <div className="interest-icon">🔍</div>
              <div className="interest-info">
                <h4>Google Cloud</h4>
                <p className="followers">1.3M followers</p>
              </div>
              <button className="follow-btn">✓ Following</button>
            </div>
          </div>

          <a href="#" className="show-all-interests">Show all companies →</a>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="profile-sidebar">
        {/* Profile Card */}
        <div className="sidebar-card">
          <div className="profile-settings">
            <h3>Profile language</h3>
            <select className="language-select">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="profile-settings">
            <h3>Public profile & URL</h3>
            <p className="url-text">www.linkedin.com/in/hemanth-naga-sai-kumar</p>
            <button className="edit-url-btn">✏️</button>
          </div>
        </div>

        {/* Job Search Card */}
        <div className="job-search-card">
          <h4>LinkedIn</h4>
          <p className="job-title">Your job search <strong>powered by your network</strong></p>
          <button className="explore-btn">Explore jobs</button>
          <img src="data:image/svg+xml,%3Csvg width='100%' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23001f3f' width='100%' height='150'/%3E%3C/svg%3E" alt="Job search" className="job-image" />
        </div>

        {/* Premium Section */}
        <div className="sidebar-card premium-card">
          <h3>🟠 Premium</h3>
          <p><strong>Who your viewers also viewed</strong></p>
          <p className="private-text">🔒 Private to you</p>

          <div className="suggested-person">
            <div className="person-avatar">SL</div>
            <div className="person-info">
              <h4>Sadanala Lahari</h4>
              <p className="time">1st</p>
              <p className="education">Attended CVR College of Engineering, Hyderabad</p>
            </div>
          </div>

          <button className="message-btn">📬 Message</button>

          <div className="suggested-person">
            <div className="person-avatar">VK</div>
            <div className="person-info">
              <h4>Vaishnavi KVM C</h4>
              <p className="time">3d</p>
              <p className="education">Instrumentation & Control Engineer</p>
            </div>
          </div>

          <button className="message-btn">📬 Message</button>

          <div className="suggested-person">
            <div className="person-avatar">VM</div>
            <div className="person-info">
              <h4>Venkatapathy Madhyasth</h4>
              <p className="time">6d</p>
              <p className="education">Student at CVR College of Engineering, Hyderabad</p>
            </div>
          </div>

          <button className="contact-btn">♪ Contact</button>

          <a href="#" className="show-all-link">Show all</a>
        </div>

        {/* People You May Know */}
        <div className="sidebar-card">
          <h3>People you may know</h3>
          <p className="subtitle">From your company</p>

          <div className="suggested-person">
            <div className="person-avatar">SR</div>
            <div className="person-info">
              <h4>Somesh Reddy Kettipagiu</h4>
              <p className="title">Web Developer | MERN Stack | Cyber Security...</p>
            </div>
          </div>

          <button className="connect-btn">+ Connect</button>

          <div className="suggested-person">
            <div className="person-avatar">ES</div>
            <div className="person-info">
              <h4>EGALA SRINIDHI REDDY</h4>
              <p className="title">B.tech 2nd Year (CSDS) Student at CVR College of...</p>
            </div>
          </div>

          <button className="connect-btn">+ Connect</button>

          <div className="suggested-person">
            <div className="person-avatar">RM</div>
            <div className="person-info">
              <h4>Raghu Mohan</h4>
              <p className="title">Student at SNIST Electronics Communication</p>
            </div>
          </div>

          <button className="connect-btn">+ Connect</button>

          <div className="suggested-person">
            <div className="person-avatar">CU</div>
            <div className="person-info">
              <h4>Chirakla Uttara</h4>
              <p className="title">Student at Sreenidhi Institute of Science and Technology</p>
            </div>
          </div>

          <button className="connect-btn">+ Connect</button>

          <div className="suggested-person">
            <div className="person-avatar">HV</div>
            <div className="person-info">
              <h4>Harsha Vardhan</h4>
              <p className="title">Software Developer and Instructor @ Smartphone Interviews</p>
            </div>
          </div>

          <button className="connect-btn">+ Connect</button>

          <a href="#" className="show-all-link">Show all</a>
        </div>

        {/* You Might Like */}
        <div className="sidebar-card">
          <h3>You might like</h3>
          <p className="subtitle">Pages for you</p>

          <div className="page-item">
            <div className="page-icon">🐙</div>
            <div className="page-info">
              <h4>GitHub</h4>
              <p className="page-followers">Software Development 🎯</p>
              <p className="followers-count">1.5M followers</p>
            </div>
          </div>

          <button className="follow-page-btn">+ Follow</button>

          <div className="page-item">
            <div className="page-icon">⚡</div>
            <div className="page-info">
              <h4>LeetCode Forward</h4>
              <p className="page-followers">E-learning</p>
              <p className="followers-count">55.8K followers</p>
            </div>
          </div>

          <button className="follow-page-btn">+ Follow</button>

          <a href="#" className="show-all-link">Show all</a>
        </div>

        {/* Job Search Card Bottom */}
        <div className="job-search-card">
          <h4>LinkedIn</h4>
          <p className="job-title">Your job search <strong>powered by your network</strong></p>
          <button className="explore-btn">Explore jobs</button>
        </div>
      </aside>
    </div>
  );
}
