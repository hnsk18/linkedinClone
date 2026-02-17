import React from "react";
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
    <div className="mynetwork-container">
      {/* Left Sidebar */}
      <aside className="network-sidebar">
        <div className="sidebar-card">
          <h3>Manage your network</h3>
          <nav className="network-nav">
            <a href="#" className="nav-link active">
              <span>👥</span> Grow your network
            </a>
            <a href="#" className="nav-link">
              <span>✉️</span> Invitations
            </a>
            <a href="#" className="nav-link">
              <span>👁️</span> Following
            </a>
            <a href="#" className="nav-link">
              <span>👥</span> Followers
            </a>
            <a href="#" className="nav-link">
              <span>📝</span> Contacts
            </a>
          </nav>
        </div>

        <div className="sidebar-card">
          <h3>💡 Pro Tip</h3>
          <p className="pro-tip">
            The more people you connect with, the better your opportunities.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="network-main">
        <div className="network-header">
          <h1>People you may know</h1>
          <p>Grow your network by connecting with professionals in your field</p>
        </div>

        <div className="connections-grid">
          {suggestedConnections.map((person) => (
            <div key={person.id} className="connection-card">
              <div className="card-header">
                <div className="avatar-large">{person.avatar}</div>
                <button className="close-btn">✕</button>
              </div>
              <h3>{person.name}</h3>
              <p className="headline">{person.headline}</p>
              <p className="mutual">🔗 {person.mutualConnections} mutual connections</p>
              <div className="card-actions">
                <button className="connect-btn">➕ Connect</button>
                <button className="show-more-btn">•••</button>
              </div>
            </div>
          ))}
        </div>

        <div className="show-more-section">
          <button className="show-more-primary">Show more people</button>
        </div>
      </main>
    </div>
  );
}
