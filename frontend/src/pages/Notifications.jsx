import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/notifications.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function getToken() {
  let t = localStorage.getItem("token");
  if (!t) return null;
  try {
    t = JSON.parse(t);
  } catch (e) {
    /* ignore */
  }
  return String(t).replace(/^"|"$/g, "").trim() || null;
}

function formatTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 48) return `${hrs}h`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [invites, setInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [me, setMe] = useState(null);

  const token = useMemo(() => getToken(), []);

  const loadInvites = useCallback(async () => {
    const tok = getToken();
    if (!tok) return;
    setInvitesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/connections/requests/incoming`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setInvites(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load invitations", e);
    } finally {
      setInvitesLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    const tok = getToken();
    if (!tok) return;
    setNotifLoading(true);
    try {
      const q = filter === "all" ? "all" : filter;
      const res = await fetch(`${API_BASE}/api/notifications?filter=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setNotifLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const tok = getToken();
    if (!tok) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${tok}` },
        });
        if (res.ok) setMe(await res.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const respond = async (requestId, action) => {
    const tok = getToken();
    if (!tok) return;
    try {
      const res = await fetch(`${API_BASE}/api/connections/requests/${requestId}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!res.ok) {
        const t = await res.text();
        alert(t || "Failed");
        return;
      }
      setInvites((prev) => prev.filter((x) => x.requestId !== requestId));
      loadNotifications();
    } catch (e) {
      console.error(e);
      alert("Failed");
    }
  };

  const markRead = async (id) => {
    const tok = getToken();
    if (!tok) return;
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    const tok = getToken();
    if (!tok) return;
    try {
      await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const openNotification = async (n) => {
    await markRead(n.id);
    if (n.relatedPostId) {
      navigate(`/post/${n.relatedPostId}`);
      return;
    }
    if (n.actorUserId != null) {
      const path = n.actorUsername ? `/in/${n.actorUsername}` : `/profile/${n.actorUserId}`;
      navigate(path);
    }
  };

  const meInitial = (me?.name || me?.email || "u").trim().charAt(0).toLowerCase();

  return (
    <div className="notifications-page-container">
      <Navbar />
      <div className="notifications-container">
        <aside className="notifications-sidebar">
          <div className="profile-banner">
            <div className="banner-image" />
            <div className="banner-content">
              <div className="profile-avatar-large">{meInitial}</div>
              <h3>{me?.name || "Your profile"}</h3>
              <p className="profile-education">{me?.headline || " "}</p>
              {me?.location && (
                <div className="profile-meta">
                  <span>{me.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="manage-notifications">
            <p>Notifications from connections, posts, and comments</p>
          </div>
        </aside>

        <main className="notifications-feed">
          <div className="invites-card">
            <div className="invites-header">
              <h3>Invitations</h3>
              <span className="invites-count">{invites.length}</span>
            </div>
            {invitesLoading ? (
              <div className="invites-empty">Loading…</div>
            ) : invites.length === 0 ? (
              <div className="invites-empty">No invitations right now</div>
            ) : (
              <div className="invites-list">
                {invites.map((r) => (
                  <div key={r.requestId} className="invite-item">
                    <div className="invite-avatar">{(r.fromName?.[0] || "U").toUpperCase()}</div>
                    <div className="invite-body">
                      <div className="invite-title">
                        <strong>{r.fromName || r.fromEmail || "Unknown"}</strong>
                      </div>
                      <div className="invite-subtitle">
                        {[r.fromHeadline, r.fromLocation].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                    <div className="invite-actions">
                      <button type="button" className="invite-btn primary" onClick={() => respond(r.requestId, "accept")}>
                        Accept
                      </button>
                      <button type="button" className="invite-btn" onClick={() => respond(r.requestId, "reject")}>
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-tabs" style={{ alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className={`tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              All
            </button>
            <button
              type="button"
              className={`tab ${filter === "connections" ? "active" : ""}`}
              onClick={() => setFilter("connections")}
            >
              Connections
            </button>
            <button type="button" className={`tab ${filter === "posts" ? "active" : ""}`} onClick={() => setFilter("posts")}>
              My posts
            </button>
            <button type="button" className={`tab ${filter === "jobs" ? "active" : ""}`} onClick={() => setFilter("jobs")}>
              Jobs
            </button>
            <button
              type="button"
              className={`tab ${filter === "mention" ? "active" : ""}`}
              onClick={() => setFilter("mention")}
            >
              Mentions
            </button>
            <button
              type="button"
              className="tab"
              style={{ marginLeft: "auto", fontSize: 13 }}
              onClick={markAllRead}
            >
              Mark all read
            </button>
          </div>

          <div className="notifications-list">
            {notifLoading ? (
              <div className="no-notifications">
                <p>Loading notifications…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications in this category yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="notification-item"
                  onClick={() => openNotification(n)}
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    background: n.read ? "transparent" : "rgba(10, 102, 194, 0.06)",
                    border: "none",
                    borderBottom: "1px solid #eee",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div className="notification-dot" style={{ opacity: n.read ? 0.2 : 1 }} />
                  <div className="notification-avatar">
                    {(n.actorName || n.message || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="notification-body" style={{ flex: 1 }}>
                    <p className="notification-main" style={{ margin: "0 0 4px" }}>
                      {n.message}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{n.type.replace(/_/g, " ")}</p>
                  </div>
                  <div className="notification-time">{formatTime(n.createdAt)}</div>
                </button>
              ))
            )}
          </div>
        </main>

        <aside className="notifications-sidebar-right">
          <div className="sidebar-links">
            <span style={{ fontSize: 12, color: "#666" }}>LinkUp — college project build</span>
          </div>
          <div className="sidebar-links">
            <a href="/home">Home</a>
            <a href="/mynetwork">My Network</a>
            <a href="/jobs">Jobs</a>
          </div>
          <div className="copyright">
            <p>© {new Date().getFullYear()}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
