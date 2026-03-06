import React, { useState } from "react";
import "../styles/messaging.css";

const conversationsMock = [
  {
    id: 1,
    name: "Amazon Web Services (AWS)",
    avatar: "AWS",
    preview: "Sponsored · Hi hemanth, curious about how to migrate...",
    date: "Mar 4",
    unread: true,
  },
  {
    id: 2,
    name: "NANGAAJI RUSHIKESH",
    avatar: "N",
    preview: "You: Tango #456 | 1:59 and flawless First 5 placements...",
    date: "Jan 6",
    unread: false,
  },
  {
    id: 3,
    name: "Vamshi Kasam",
    avatar: "V",
    preview: "You: Tango #456 | 1:59 and flawless First 5 placements...",
    date: "Jan 6",
    unread: false,
  },
  {
    id: 4,
    name: "Akhil Pidathala",
    avatar: "A",
    preview: "Akhil: Endhii ayyaa",
    date: "Dec 15, 2025",
    unread: false,
  },
  {
    id: 5,
    name: "Kanthula Raju",
    avatar: "K",
    preview: "Kanthula: Hii",
    date: "Dec 7, 2025",
    unread: false,
  },
  {
    id: 6,
    name: "Hemanth Dandh...",
    avatar: "H",
    preview: "You: Hey hi Hemanth... iam also Hemanth by the way...",
    date: "Nov 30, 2025",
    unread: false,
  },
];

export default function MessagingDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Focused");

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="messaging-dock">
      {/* Collapsed bar */}
      {!isOpen && (
        <button className="messaging-dock-bar" onClick={toggleOpen}>
          <div className="dock-avatar">h</div>
          <span className="dock-title">Messaging</span>
        </button>
      )}

      {/* Expanded popup */}
      {isOpen && (
        <div className="messaging-dock-popup">
          <div className="dock-header" onClick={toggleOpen}>
            <div className="dock-header-left">
              <div className="dock-avatar">h</div>
              <div className="dock-header-text">
                <span className="dock-title">Messaging</span>
              </div>
            </div>
            <div className="dock-header-actions">
              <button className="dock-icon-btn">⋯</button>
              <button className="dock-icon-btn">✎</button>
              <button className="dock-icon-btn">⌄</button>
            </div>
          </div>

          <div className="dock-search">
            <input type="text" placeholder="Search messages" />
          </div>

          <div className="dock-tabs">
            <button
              className={`dock-tab ${activeTab === "Focused" ? "active" : ""}`}
              onClick={() => setActiveTab("Focused")}
            >
              Focused
            </button>
            <button
              className={`dock-tab ${activeTab === "Other" ? "active" : ""}`}
              onClick={() => setActiveTab("Other")}
            >
              Other
            </button>
          </div>

          <div className="dock-conversations">
            {conversationsMock.map((c) => (
              <div
                key={c.id}
                className={`dock-conversation ${c.unread ? "unread" : ""}`}
              >
                <div className="dock-conv-avatar">{c.avatar[0]}</div>
                <div className="dock-conv-main">
                  <div className="dock-conv-header-row">
                    <span className="dock-conv-name">{c.name}</span>
                    <span className="dock-conv-date">{c.date}</span>
                  </div>
                  <p className="dock-conv-preview">{c.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

