import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/mynetwork.css";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function getToken() {
  let t = localStorage.getItem("token");
  if (!t) return null;
  try {
    t = JSON.parse(t);
  } catch (e) {
    /* stored as raw string */
  }
  const s = String(t).replace(/^"|"$/g, "").trim();
  return s || null;
}

function profilePath(person) {
  if (person.username) return `/in/${person.username}`;
  return `/profile/${person.userId}`;
}

export default function MyNetwork() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [mutual, setMutual] = useState([]);
  const [discover, setDiscover] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);

  const loadNetwork = useCallback(async () => {
    const tok = getToken();
    if (!tok) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${tok}` };
      const [listRes, sugRes, outRes] = await Promise.all([
        fetch(`${API_BASE}/api/connections/list`, { headers }),
        fetch(`${API_BASE}/api/connections/suggestions`, { headers }),
        fetch(`${API_BASE}/api/connections/requests/outgoing`, { headers }),
      ]);
      if (listRes.ok) {
        const data = await listRes.json();
        setConnections(Array.isArray(data) ? data : []);
      }
      if (sugRes.ok) {
        const data = await sugRes.json();
        setMutual(Array.isArray(data.mutualConnections) ? data.mutualConnections : []);
        setDiscover(Array.isArray(data.peopleYouMayKnow) ? data.peopleYouMayKnow : []);
      }
      if (outRes.ok) {
        const data = await outRes.json();
        setOutgoing(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Failed to load network", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNetwork();
  }, [loadNetwork]);

  const sendConnect = async (toUserId) => {
    const tok = getToken();
    if (!tok || toUserId == null) return;
    const id = Number(toUserId);
    if (!Number.isFinite(id)) {
      alert("Invalid user.");
      return;
    }
    setConnectingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/connections/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        body: JSON.stringify({ toUserId: id }),
      });
      const text = await res.text();
      if (!res.ok) {
        alert(text || `Request failed (${res.status})`);
        return;
      }
      await loadNetwork();
    } catch (e) {
      console.error(e);
      alert("Failed to send request. Check that the server is running.");
    } finally {
      setConnectingId(null);
    }
  };

  const pendingIds = new Set(outgoing.map((o) => o.toUserId));

  const suggestions = [];
  const seen = new Set();
  for (const p of [
    ...mutual.map((x) => ({ ...x, badge: "Connection of your connection" })),
    ...discover.map((x) => ({ ...x, badge: "Not yet connected" })),
  ]) {
    if (seen.has(p.userId)) continue;
    seen.add(p.userId);
    if (pendingIds.has(p.userId)) continue;
    suggestions.push(p);
  }

  const outgoingCards = outgoing.map((r) => ({
    userId: r.toUserId,
    name: r.toName,
    headline: r.toHeadline,
    location: r.toLocation,
    email: r.toEmail,
    username: r.toUsername,
    requestId: r.requestId,
    badge: "Pending",
  }));

  return (
    <div className="mynetwork-page-container">
      <Navbar />
      <div className="mynetwork-container">
        <aside className="network-sidebar">
          <div className="sidebar-card">
            <h3>Manage my network</h3>
            <nav className="network-nav">
              <a href="#connections" className="nav-link active">
                Connections <span className="nav-count">{connections.length}</span>
              </a>
              <a href="#pending" className="nav-link">
                Pending <span className="nav-count">{outgoing.length}</span>
              </a>
              <a href="#suggestions" className="nav-link">
                Grow <span className="nav-count">{suggestions.length}</span>
              </a>
            </nav>
          </div>
        </aside>

        <main className="network-main">
          <section className="network-header" id="connections">
            <div className="network-header-main">
              <h1>
                {connections.length} {connections.length === 1 ? "Connection" : "Connections"}
              </h1>
              <button type="button" className="show-all-link">
                Recently added ▼
              </button>
            </div>
          </section>

          <div className="connections-grid">
            {loading ? (
              <div style={{ padding: 16, color: "#666" }}>Loading…</div>
            ) : connections.length === 0 ? (
              <div style={{ padding: 16, color: "#666" }}>No connections yet</div>
            ) : (
              connections.map((person) => (
                <div key={person.userId} className="connection-card">
                  <div className="card-header">
                    <div className="avatar-large">{(person?.name?.[0] || "U").toUpperCase()}</div>
                    <button
                      type="button"
                      className="close-btn"
                      aria-label="More"
                      onClick={() => navigate(profilePath(person))}
                    >
                      ⋯
                    </button>
                  </div>
                  <h3>
                    <button
                      type="button"
                      onClick={() => navigate(profilePath(person))}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        textAlign: "left",
                      }}
                    >
                      {person.name || person.email || "Unknown"}
                    </button>
                  </h3>
                  <p className="headline">{[person.headline, person.location].filter(Boolean).join(" • ")}</p>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="connect-btn"
                      onClick={() =>
                        navigate(
                          `/messaging?toUserId=${person.userId}&toEmail=${encodeURIComponent(person.email || "")}`
                        )
                      }
                    >
                      Message
                    </button>
                    <button type="button" className="show-more-btn" onClick={() => navigate(profilePath(person))}>
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <section className="network-header" id="pending" style={{ marginTop: 32 }}>
            <div className="network-header-main">
              <h1>Pending invitations</h1>
              <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                You invited these people. They will appear in Connections after they accept.
              </p>
            </div>
          </section>

          <div className="connections-grid">
            {!loading && outgoingCards.length === 0 && (
              <div style={{ padding: 16, color: "#666" }}>No pending invitations.</div>
            )}
            {outgoingCards.map((person) => (
              <div key={person.requestId} className="connection-card">
                <div className="card-header">
                  <div className="avatar-large">{(person?.name?.[0] || "U").toUpperCase()}</div>
                  <span style={{ fontSize: 12, color: "#666" }}>{person.badge}</span>
                </div>
                <h3>
                  <button
                    type="button"
                    onClick={() => navigate(profilePath(person))}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      font: "inherit",
                      textAlign: "left",
                    }}
                  >
                    {person.name || person.email || "Unknown"}
                  </button>
                </h3>
                <p className="headline">{[person.headline, person.location].filter(Boolean).join(" • ")}</p>
                <div className="card-actions">
                  <button type="button" className="show-more-btn" onClick={() => navigate(profilePath(person))}>
                    View profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="network-header" id="suggestions" style={{ marginTop: 32 }}>
            <div className="network-header-main">
              <h1>Grow your network</h1>
              <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                People who share a connection with you, and others you have not connected with yet.
              </p>
            </div>
          </section>

          <div className="connections-grid">
            {!loading && suggestions.length === 0 && (
              <div style={{ padding: 16, color: "#666" }}>No suggestions right now.</div>
            )}
            {suggestions.map((person) => (
              <div key={`sug-${person.userId}`} className="connection-card">
                <div className="card-header">
                  <div className="avatar-large">{(person?.name?.[0] || "U").toUpperCase()}</div>
                  <span style={{ fontSize: 12, color: "#666" }}>{person.badge}</span>
                </div>
                <h3>
                  <button
                    type="button"
                    onClick={() => navigate(profilePath(person))}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      font: "inherit",
                      textAlign: "left",
                    }}
                  >
                    {person.name || person.email || "Unknown"}
                  </button>
                </h3>
                <p className="headline">{[person.headline, person.location].filter(Boolean).join(" • ")}</p>
                <div className="card-actions">
                  <button
                    type="button"
                    className="connect-btn"
                    disabled={connectingId === person.userId}
                    onClick={() => sendConnect(person.userId)}
                  >
                    {connectingId === person.userId ? "Sending…" : "Connect"}
                  </button>
                  <button type="button" className="show-more-btn" onClick={() => navigate(profilePath(person))}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
