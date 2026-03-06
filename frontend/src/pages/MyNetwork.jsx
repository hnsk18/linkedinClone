import React from "react";
import Navbar from "../components/Navbar";
import "../styles/mynetwork.css";

export default function MyNetwork() {
  const suggestedConnections = [
    {
      id: 1,
      name: "Sarah Anderson",
      headline: "Marketing Manager at Tech Corp",
      mutualConnections: 12,
      avatar: "SA"
    },
    {
      id: 2,
      name: "James Wilson",
      headline: "Senior Developer at Creative Studio",
      mutualConnections: 8,
      avatar: "JW"
    },
    {
      id: 3,
      name: "Emma Johnson",
      headline: "Product Designer at Innovation Inc",
      mutualConnections: 15,
      avatar: "EJ"
    },
    {
      id: 4,
      name: "Michael Brown",
      headline: "Data Scientist at AI Solutions",
      mutualConnections: 6,
      avatar: "MB"
    },
    {
      id: 5,
      name: "Lisa Chen",
      headline: "UX Researcher at Design Labs",
      mutualConnections: 10,
      avatar: "LC"
    },
    {
      id: 6,
      name: "David Martinez",
      headline: "Project Manager at Build Co",
      mutualConnections: 9,
      avatar: "DM"
    }
  ];

  return (
    <div className="mynetwork-page-container">
      <Navbar />
      <div className="mynetwork-container">
        {/* Left Sidebar */}
        <aside className="network-sidebar">
          <div className="sidebar-card">
            <h3>Manage my network</h3>
            <nav className="network-nav">
              <a href="#" className="nav-link active">
                Connections <span className="nav-count">53</span>
              </a>
              <a href="#" className="nav-link">
                Following &amp; followers
              </a>
              <a href="#" className="nav-link">
                Groups
              </a>
              <a href="#" className="nav-link">
                Events
              </a>
              <a href="#" className="nav-link">
                Pages
              </a>
              <a href="#" className="nav-link">
                Newsletters
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="network-main">
          {/* Grow / Catch up tabs + invitations zero state */}
          <section className="network-top-card">
            <div className="network-top-tabs">
              <button className="tab-btn active">Grow</button>
              <button className="tab-btn">Catch up</button>
            </div>
            <div className="invitations-row">
              <div className="invitations-text">
                <h3>No pending invitations</h3>
                <p>When you have invitations, you can manage them here.</p>
              </div>
              <button className="manage-btn">Manage</button>
            </div>
          </section>

          {/* Puzzle skills carousel stub */}
          <section className="puzzle-card">
            <h3 className="puzzle-title">
              3 connections proved their puzzle skills. Join in.
            </h3>
            <div className="puzzle-list-inline">
              <div className="puzzle-pill">
                <span className="puzzle-icon">🧩</span>
                <div className="puzzle-text">
                  <span className="puzzle-name">Zip #353</span>
                  <span className="puzzle-meta">3 connections played</span>
                </div>
                <button className="solve-btn">Solve</button>
              </div>
              <div className="puzzle-pill">
                <span className="puzzle-icon">🧮</span>
                <div className="puzzle-text">
                  <span className="puzzle-name">Mini Sudoku #206</span>
                  <span className="puzzle-meta">2 connections played</span>
                </div>
                <button className="solve-btn">Solve</button>
              </div>
              <div className="puzzle-pill">
                <span className="puzzle-icon">🎯</span>
                <div className="puzzle-text">
                  <span className="puzzle-name">Tango #514</span>
                  <span className="puzzle-meta">2 connections played</span>
                </div>
                <button className="solve-btn">Solve</button>
              </div>
            </div>
          </section>

          {/* People you may know */}
          <section className="network-header">
            <div className="network-header-main">
              <h1>People you may know from CVR College of Engineering, Hyderabad</h1>
              <button className="show-all-link">Show all</button>
            </div>
          </section>

          <div className="connections-grid">
            {suggestedConnections.map((person) => (
              <div key={person.id} className="connection-card">
                <div className="card-header">
                  <div className="avatar-large">{person.avatar}</div>
                  <button className="close-btn">✕</button>
                </div>
                <h3>{person.name}</h3>
                <p className="headline">{person.headline}</p>
                <p className="mutual">
                  {person.mutualConnections} mutual connections
                </p>
                <div className="card-actions">
                  <button className="connect-btn">Connect</button>
                  <button className="show-more-btn">•••</button>
                </div>
              </div>
            ))}
          </div>

          <div className="show-more-section">
            <button className="show-more-primary">Show more</button>
          </div>
        </main>
      </div>
    </div>
  );
}
