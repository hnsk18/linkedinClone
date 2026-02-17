import React, { useState } from "react";
import "../styles/jobs.css";

export default function Jobs() {
  const [dismissedJobs, setDismissedJobs] = useState(new Set());

  const jobListings = [
    {
      id: 1,
      company: "KAM-Wheat",
      verified: true,
      title: "Data Analyst East (On-site)",
      location: "India",
      postedTime: "1 week ago",
      postedType: "Recent soon work hire",
      logo: "🏢"
    },
    {
      id: 2,
      company: "Dalox",
      verified: false,
      title: "Data Entry Executive",
      location: "India (Remote)",
      postedTime: "20 hours ago",
      postedType: "Be an early applicant",
      badge: "Easy Apply",
      logo: "📋"
    },
    {
      id: 3,
      company: "Sardine",
      verified: false,
      title: "Technical Account Manager",
      location: "India (Remote)",
      postedTime: "2 weeks ago",
      postedType: "Easy Apply",
      logo: "💻"
    }
  ];

  const moreJobs = [
    {
      id: 4,
      company: "KAM-Wheat",
      verified: true,
      title: "KAM-Wheat",
      subtitle: "Limited Courier East (On-site)",
      location: "India",
      postedTime: "1 week ago",
      badge: "Easy Apply",
      logo: "🏢"
    },
    {
      id: 5,
      company: "District Account Manager",
      title: "District Account Manager-Biosurgery Specialist-Vijayawada",
      location: "Johnson & Johnson Medtech • Vijayawada (Remote)",
      postedTime: "3 weeks ago",
      badge: "Be an early applicant",
      logo: "🔴"
    },
    {
      id: 6,
      company: "Luxor",
      title: "Enterprise Account Manager",
      location: "Luxor • Vijayawada (Remote)",
      postedTime: "3 weeks ago",
      badge: "Promoted",
      logo: "🟡"
    }
  ];

  const jobCollections = [
    { id: 1, name: "Easy Apply", icon: "✅" },
    { id: 2, name: "Part-time", icon: "⏰" },
    { id: 3, name: "Healthcare", icon: "🏥" },
    { id: 4, name: "More", icon: "➕" }
  ];

  const dismissJob = (id) => {
    setDismissedJobs(new Set([...dismissedJobs, id]));
  };

  return (
    <div className="jobs-container">
      {/* Left Sidebar */}
      <aside className="jobs-sidebar">
        <div className="profile-section">
          <div className="profile-avatar-large">H</div>
          <h3>hemanth naga sai kumar</h3>
          <p className="profile-location">Advanced CVR College of Engineering, Hyderabad</p>
          <p className="profile-subtitle">🏢 CVR College of Engineering, Hyderabad</p>
        </div>

        <nav className="jobs-nav">
          <a href="#" className="nav-link">📋 Preferences</a>
          <a href="#" className="nav-link">💼 My jobs</a>
          <a href="#" className="nav-link">📊 My Career Insights</a>
        </nav>

        <button className="post-job-btn">📝 Post a free job</button>

        <div className="sidebar-footer">
          <a href="#">About</a>
          <a href="#">Accessibility</a>
          <a href="#">Help Center</a>
          <a href="#">Privacy & Terms</a>
          <a href="#">Ad Choices</a>
          <a href="#">Advertising</a>
          <a href="#">Business Services</a>
          <a href="#">Get the LinkedIn app</a>
          <a href="#">More</a>
        </div>
        <p className="linkedin-copy">LinkedIn© 2026</p>
      </aside>

      {/* Main Content */}
      <main className="jobs-main">
        <div className="search-section">
          <input type="text" placeholder="Describe the job you want" className="job-search" />
        </div>

        {/* Hiring Card */}
        <div className="hiring-card">
          <div className="hiring-content">
            <h3>Hi hemanth, are you hiring?</h3>
            <p>Post a free job and use LinkedIn's hiring tools to make a hire, fast.</p>
          </div>
          <div className="hiring-actions">
            <button className="btn-primary">Yes, I'm hiring</button>
            <button className="btn-secondary">No, not right now</button>
          </div>
          <button className="close-card">✕</button>
        </div>

        {/* Premium Section */}
        <div className="premium-section">
          <h2>⭐ Premium</h2>
          <p>Jobs where you're more likely to hear back</p>
          <p className="premium-desc">Based on your profile, job preferences, and recruiter feedback on similar jobs</p>

          {jobListings.filter(job => !dismissedJobs.has(job.id)).map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-content">
                <div className="job-logo">{job.logo}</div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company-name">
                    {job.company}
                    {job.verified && " ✓"}
                  </p>
                  <p className="job-meta">{job.location}</p>
                  <p className="job-time">{job.postedTime}</p>
                  {job.badge && <span className="job-badge">{job.badge}</span>}
                </div>
              </div>
              <button className="dismiss-btn" onClick={() => dismissJob(job.id)}>✕</button>
            </div>
          ))}
          <a href="#" className="show-all">Show all →</a>
        </div>

        {/* Job Collections */}
        <div className="collections-section">
          <h2>Explore with job collections</h2>
          <div className="collections-grid">
            {jobCollections.map((collection) => (
              <div key={collection.id} className="collection-card">
                <span className="collection-icon">{collection.icon}</span>
                <p>{collection.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More Jobs */}
        <div className="more-jobs-section">
          <h2>More jobs for you</h2>
          <p className="section-desc">Based on your profile, preferences, and activity like applies, searches, and saves</p>

          {moreJobs.filter(job => !dismissedJobs.has(job.id)).map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-content">
                <div className="job-logo">{job.logo}</div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                  {job.subtitle && <p className="job-meta">{job.subtitle}</p>}
                  <p className="job-time">{job.postedTime}</p>
                  {job.badge && <span className="job-badge">{job.badge}</span>}
                </div>
              </div>
              <button className="dismiss-btn" onClick={() => dismissJob(job.id)}>✕</button>
            </div>
          ))}
          <a href="#" className="show-all">Show all →</a>
        </div>

        {/* Search For Jobs */}
        <div className="search-jobs-section">
          <div className="search-icon">🔍</div>
          <h2>Search for jobs</h2>
          <p>Start a search and we'll share opportunities that meet your search criteria</p>
          <button className="search-btn">Search now</button>
        </div>
      </main>
    </div>
  );
}
