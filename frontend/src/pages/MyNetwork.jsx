import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/mynetwork.css";
import { useNavigate } from "react-router-dom";

export default function MyNetwork() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

  const token = useMemo(() => {
    let t = localStorage.getItem("token");
    if (!t) return null;
    return t.replace(/^"|"$/g, "");
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/connections/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setConnections(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load connections", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

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
                Connections <span className="nav-count">{connections.length}</span>
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
          <section className="network-header">
            <div className="network-header-main">
              <h1>{connections.length} Connections</h1>
              <button className="show-all-link">Recently added ▼</button>
            </div>
          </section>

          <div className="connections-grid">
            {loading ? (
              <div style={{ padding: 16, color: "#666" }}>Loading…</div>
            ) : connections.length === 0 ? (
              <div style={{ padding: 16, color: "#666" }}>No connections yet</div>
            ) : connections.map((person) => (
              <div key={person.id} className="connection-card">
                <div className="card-header">
                  <div className="avatar-large">{(person?.name?.[0] || "U").toUpperCase()}</div>
                  <button className="close-btn" onClick={() => navigate(`/profile/${person.userId}`)}>⋯</button>
                </div>
                <h3>{person.name || person.email || "Unknown"}</h3>
                <p className="headline">{[person.headline, person.location].filter(Boolean).join(" • ")}</p>
                <div className="card-actions">
                  <button
                    className="connect-btn"
                    onClick={() => navigate(`/messaging?toUserId=${person.userId}&toEmail=${encodeURIComponent(person.email || "")}`)}
                  >
                    Message
                  </button>
                  <button className="show-more-btn" onClick={() => navigate(`/profile/${person.userId}`)}>View</button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
