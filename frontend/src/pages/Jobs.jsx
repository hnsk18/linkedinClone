import React, { useState } from "react";
import Navbar from "../components/Navbar";
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
      badge: "Easy Apply",
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
    <div className="jobs-page-container">
      <Navbar />
      <div className="jobs-container">
        {/* Left Sidebar */}
        <aside className="jobs-sidebar">
          <div className="profile-section">
            <div className="profile-avatar-large">h</div>
            <h3>hemanth naga sai kumar</h3>
            <p className="profile-location">
              Attended CVR College of Engineering, Hyderabad
            </p>
            <p className="profile-subtitle">
              CVR College of Engineering, Hyderabad
            </p>
          </div>

          <nav className="jobs-nav">
            <a href="#" className="nav-link">
              Preferences
            </a>
            <a href="#" className="nav-link">
              My jobs
            </a>
            <a href="#" className="nav-link">
              My Career Insights
            </a>
          </nav>

          <button className="post-job-btn">Post a free job</button>

          <div className="sidebar-footer">
            <a href="#">About</a>
            <a href="#">Accessibility</a>
            <a href="#">Help Center</a>
            <a href="#">Privacy &amp; Terms</a>
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
          {/* Search bar */}
          <section className="search-section">
            <input
              type="text"
              placeholder="Describe the job you want"
              className="job-search"
            />
          </section>

          {/* Top job picks for you */}
          <section className="top-picks-card">
            <header className="card-header-row">
              <div>
                <h2>Top job picks for you</h2>
                <p>
                  Based on your profile, preferences, and activity like applies,
                  searches, and saves
                </p>
              </div>
            </header>

            <div className="jobs-list">
              {jobListings
                .filter((job) => !dismissedJobs.has(job.id))
                .map((job) => (
                  <article key={job.id} className="job-card">
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
                        {job.badge && (
                          <span className="job-badge">{job.badge}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissJob(job.id)}
                    >
                      ✕
                    </button>
                  </article>
                ))}
            </div>

            <button className="show-all-full">Show all →</button>
          </section>

          {/* Premium: Jobs where you're more likely to hear back */}
          <section className="premium-section">
            <header className="card-header-row premium-header">
              <span className="premium-label">Premium</span>
              <div>
                <h2>Jobs where you're more likely to hear back</h2>
                <p className="premium-desc">
                  Based on your profile, job criteria, and recruiter feedback on
                  similar jobs
                </p>
              </div>
            </header>

            <div className="jobs-list">
              {moreJobs
                .filter((job) => !dismissedJobs.has(job.id))
                .map((job) => (
                  <article key={job.id} className="job-card">
                    <div className="job-card-content">
                      <div className="job-logo">{job.logo}</div>
                      <div className="job-info">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company}</p>
                        {job.subtitle && (
                          <p className="job-meta">{job.subtitle}</p>
                        )}
                        <p className="job-time">{job.postedTime}</p>
                        {job.badge && (
                          <span className="job-badge">{job.badge}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissJob(job.id)}
                    >
                      ✕
                    </button>
                  </article>
                ))}
            </div>

            <button className="show-all-full">Show all →</button>
          </section>

          {/* Explore with job collections */}
          <section className="collections-section">
            <h2>Explore with job collections</h2>
            <div className="collections-grid">
              {jobCollections.map((collection) => (
                <div key={collection.id} className="collection-card">
                  <span className="collection-icon">{collection.icon}</span>
                  <p>{collection.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* More jobs for you */}
          <section className="more-jobs-section">
            <h2>More jobs for you</h2>
            <p className="section-desc">
              Based on your profile, preferences, and activity like applies, searches, and saves
            </p>
            <div className="jobs-list">
              {moreJobs
                .filter((job) => !dismissedJobs.has(job.id))
                .map((job) => (
                  <article key={job.id} className="job-card">
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
                    <button
                      className="dismiss-btn"
                      onClick={() => dismissJob(job.id)}
                    >
                      ✕
                    </button>
                  </article>
                ))}
            </div>
            <button className="show-all-full">Show all →</button>
          </section>
        </main>
      </div>
    </div>
  );
}
