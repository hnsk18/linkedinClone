import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/messaging.css";
import { useChat } from "../context/ChatContext";
import { useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function Messaging() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [activeTab, setActiveTab] = useState("Focused");
  const [draft, setDraft] = useState("");

  const { messages, sendMessage, currentUserEmail, connected } = useChat();

  const [params] = useSearchParams();
  const toEmail = (params.get("toEmail") || "").trim();

  const token = useMemo(() => {
    let t = localStorage.getItem("token");
    if (!t) return null;
    return t.replace(/^"|"$/g, "");
  }, []);

  const [threadMessages, setThreadMessages] = useState([]);

  // Load thread history when opened from a profile.
  useEffect(() => {
    const load = async () => {
      if (!token || !toEmail) return;
      try {
        const res = await fetch(`${API_BASE}/api/messages/thread?with=${encodeURIComponent(toEmail)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setThreadMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load thread", e);
      }
    };
    load();
  }, [token, toEmail]);

  // Merge live websocket messages into the open thread.
  useEffect(() => {
    if (!toEmail || !currentUserEmail) return;
    const last = messages[messages.length - 1];
    if (!last) return;
    const a = (last.senderEmail || "").toLowerCase();
    const b = (last.receiverEmail || "").toLowerCase();
    const me = currentUserEmail.toLowerCase();
    const other = toEmail.toLowerCase();
    const isInThread =
      (a === me && b === other) ||
      (a === other && b === me);
    if (!isInThread) return;
    setThreadMessages((prev) => [...prev, last]);
  }, [messages, toEmail, currentUserEmail]);

  const conversations = [
    {
      id: 1,
      name: "IFC Health",
      avatar: "IF",
      preview: "Sponsored: Improve your healthcare ethics skills with...",
      date: "Feb 13",
      unread: true,
      type: "sponsored"
    },
    {
      id: 2,
      name: "NANGAAJI RUSHIKESH",
      avatar: "NR",
      preview: "Your Tango #456 | 159 and flawless First 5 placement...",
      date: "Jan 6",
      unread: false,
      type: "contact"
    },
    {
      id: 3,
      name: "Vamshi Kasam",
      avatar: "V",
      preview: "You: Tango #150 | 159 and flawless First 5 placement...",
      date: "Jan 6",
      unread: false,
      type: "contact"
    },
    {
      id: 4,
      name: "Akhil Pidathala",
      avatar: "AP",
      preview: "All in: Eddi anyar",
      date: "Dec 15, 2025",
      unread: false,
      type: "contact"
    },
    {
      id: 5,
      name: "Kanthula Raju",
      avatar: "K",
      preview: "Kanthula Raju",
      date: "Dec 7, 2025",
      unread: false,
      type: "contact"
    },
    {
      id: 6,
      name: "Hemanth Dandh",
      avatar: "HD",
      preview: "Your Hey Hi Hemanth, join also Hemanth by the way and join...",
      date: "Nov 30, 2025",
      unread: false,
      type: "contact"
    }
  ];

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft, toEmail || null);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="messaging-page-container">
      <Navbar />
      <div className="messaging-container">
      {/* Left Sidebar - Conversations List (still static UI) */}
      <aside className="messaging-sidebar">
        <div className="messaging-header">
          <h2>Messaging</h2>
          <button className="compose-btn">✎</button>
        </div>

        <div className="search-box">
          <input type="text" placeholder="🔍 Search messages" />
        </div>

        <div className="tabs">
          {["Focused", "Jobs", "Unread", "Connections", "InMail", "Starred"].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="conversations-list">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                selectedConversationId === conversation.id ? "active" : ""
              } ${conversation.unread ? "unread" : ""}`}
              onClick={() => setSelectedConversationId(conversation.id)}
            >
              <div className="conversation-avatar">{conversation.avatar}</div>
              <div className="conversation-info">
                <h4>{conversation.name}</h4>
                <p>{conversation.preview}</p>
              </div>
              <div className="conversation-meta">
                <span className="date">{conversation.date}</span>
                {conversation.unread && <div className="unread-dot"></div>}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content - Message Thread */}
        <main className="messaging-main">
          <div className="message-thread-header">
            <div className="thread-info">
              <div className="thread-avatar">G</div>
              <h3>{toEmail ? toEmail : "Global chat"}</h3>
            </div>
            <div className="thread-actions">
              <button className="icon-btn">⋯</button>
              <button className="icon-btn">✎</button>
            </div>
          </div>

          <div className="message-content chat-thread">
            <div className="chat-messages">
              {!connected && (
                <div className="chat-status">Connecting to chat…</div>
              )}
              {(toEmail ? threadMessages : messages).map((m, idx) => {
                const isMe =
                  m.senderEmail &&
                  currentUserEmail &&
                  m.senderEmail === currentUserEmail;
                return (
                  <div
                    key={m.id ?? idx}
                    className={`chat-message ${isMe ? "sent" : "received"}`}
                  >
                    <div className="chat-bubble">
                      {!isMe && (
                        <div className="chat-meta">
                          {m.senderEmail || "Unknown"}
                        </div>
                      )}
                      <div className="chat-text">{m.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Composer area */}
          <div className="message-composer">
            <textarea
              className="composer-input"
              placeholder="Write a message..."
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="composer-footer">
              <div className="composer-tools">
                <button className="composer-icon-btn" type="button">🙂</button>
                <button className="composer-icon-btn" type="button">GIF</button>
                <button className="composer-icon-btn" type="button">📎</button>
              </div>
              <button className="send-btn" type="button" onClick={handleSend}>Send</button>
            </div>
          </div>
        </main>

      {/* Right Sidebar - Info/Ads */}
      <aside className="messaging-right">
        <div className="promo-card">
          <h3>💼 State Bank of India</h3>
          <p>hemanth, grow your career by following State Bank of India</p>
          <p>Keep up with interesting, relevant updates</p>
          <div className="follow-info">
            <span>😊 2 of your connections are following</span>
          </div>
          <button className="follow-btn">Follow</button>
        </div>

        <div className="footer-links">
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
        <p className="copyright">LinkedIn © 2026</p>
      </aside>
    </div>
    </div>
  );
}
