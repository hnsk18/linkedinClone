import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/messaging.css";
import { useChat } from "../context/ChatContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function MessagingDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Focused");
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [threadMsgs, setThreadMsgs] = useState([]);
  const [meName, setMeName] = useState("");

  const { messages, sendMessage, currentUserEmail, connected } = useChat();

  const token = useMemo(() => {
    let t = localStorage.getItem("token");
    if (!t) return null;
    try {
      t = JSON.parse(t);
    } catch (e) {
      /* ignore */
    }
    return t.replace(/^"|"$/g, "");
  }, []);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Dock: failed to load conversations", e);
    }
  }, [token]);

  const loadThread = useCallback(
    async (peerEmail) => {
      if (!token || !peerEmail) return;
      try {
        const res = await fetch(
          `${API_BASE}/api/messages/thread?with=${encodeURIComponent(peerEmail)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setThreadMsgs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Dock: failed to load thread", e);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const u = await res.json();
        setMeName(u?.name || "");
      } catch (e) {
        console.error(e);
      }
    })();
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (isOpen) loadConversations();
  }, [isOpen, loadConversations]);

  useEffect(() => {
    loadConversations();
  }, [messages.length, loadConversations]);

  useEffect(() => {
    if (selectedPeer) loadThread(selectedPeer);
  }, [selectedPeer, loadThread, messages.length]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const dockInitial = (meName || currentUserEmail || "u").trim().charAt(0).toLowerCase();

  const handleSend = () => {
    if (!draft.trim()) return;
    if (!selectedPeer) {
      window.alert("Select a conversation first, or open Messaging to start a new chat.");
      return;
    }
    if (!connected) {
      window.alert("Messaging is reconnecting. Try again in a moment.");
      return;
    }
    sendMessage(draft, selectedPeer);
    setDraft("");
    setTimeout(() => loadThread(selectedPeer), 400);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="messaging-dock">
      {!isOpen && (
        <button type="button" className="messaging-dock-bar" onClick={toggleOpen}>
          <div className="dock-avatar">{dockInitial}</div>
          <span className="dock-title">Messaging</span>
        </button>
      )}

      {isOpen && (
        <div className="messaging-dock-popup">
          <div
            className="dock-header"
            onClick={toggleOpen}
            onKeyDown={(e) => e.key === "Enter" && toggleOpen()}
            role="button"
            tabIndex={0}
          >
            <div className="dock-header-left">
              <div className="dock-avatar">{dockInitial}</div>
              <div className="dock-header-text">
                <span className="dock-title">Messaging</span>
                {!connected && (
                  <span style={{ fontSize: 11, color: "#666", marginLeft: 8 }}>Connecting…</span>
                )}
              </div>
            </div>
            <div className="dock-header-actions">
              <Link to="/messaging" className="dock-icon-btn" title="Open full messaging" onClick={(e) => e.stopPropagation()}>
                ↗
              </Link>
              <button type="button" className="dock-icon-btn">
                ⌄
              </button>
            </div>
          </div>

          <div className="dock-search">
            <input type="text" placeholder="Search messages" readOnly />
          </div>

          <div className="dock-tabs">
            <button
              type="button"
              className={`dock-tab ${activeTab === "Focused" ? "active" : ""}`}
              onClick={() => setActiveTab("Focused")}
            >
              Focused
            </button>
            <button
              type="button"
              className={`dock-tab ${activeTab === "Other" ? "active" : ""}`}
              onClick={() => setActiveTab("Other")}
            >
              Other
            </button>
          </div>

          <div className="dock-conversations">
            {conversations.length === 0 && (
              <p style={{ padding: "12px 16px", margin: 0, fontSize: 13, color: "#666" }}>
                No conversations yet.{" "}
                <Link to="/messaging" onClick={(e) => e.stopPropagation()}>
                  Open Messaging
                </Link>
              </p>
            )}
            {conversations.slice(0, 8).map((c) => {
              const peer = c.otherEmail || "";
              const active = selectedPeer === peer;
              return (
                <button
                  key={peer}
                  type="button"
                  className={`dock-conversation ${active ? "sent" : "unread"}`}
                  onClick={() => setSelectedPeer(peer)}
                >
                  <div className="dock-conv-avatar">{(c.otherName || peer || "?").charAt(0).toUpperCase()}</div>
                  <div className="dock-conv-main">
                    <div className="dock-conv-header-row">
                      <span className="dock-conv-name">{c.otherName || peer}</span>
                      <span style={{ fontSize: 11, color: "#999" }}>{formatTime(c.timestamp)}</span>
                    </div>
                    <p className="dock-conv-preview">
                      {c.isMine ? "You: " : ""}
                      {c.lastMessage || ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPeer && threadMsgs.length > 0 && (
            <div
              style={{
                maxHeight: 120,
                overflowY: "auto",
                borderTop: "1px solid #eee",
                padding: "8px 12px",
                fontSize: 12,
                color: "#444",
              }}
            >
              {threadMsgs.slice(-6).map((m) => {
                const mine =
                  m.senderEmail &&
                  currentUserEmail &&
                  m.senderEmail.toLowerCase() === currentUserEmail.toLowerCase();
                return (
                  <div key={m.id} style={{ marginBottom: 6 }}>
                    <strong>{mine ? "You" : m.senderEmail}</strong>: {m.content}
                  </div>
                );
              })}
            </div>
          )}

          <div className="dock-composer">
            <input
              type="text"
              className="dock-input"
              placeholder={selectedPeer ? `Message ${selectedPeer}` : "Select a chat to reply…"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="dock-send-btn" type="button" onClick={handleSend} disabled={!connected}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
