import React, { useState } from "react";
import "../styles/messaging.css";

export default function Messaging() {
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [activeTab, setActiveTab] = useState("Focused");

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

  const messages = [
    {
      id: 1,
      sender: "IFC Health",
      avatar: "IF",
      content: "Why Enroll?",
      timestamp: "Today",
      details: [
        "Access courses anytime, anywhere, at your own pace and at no cost",
        "Earn a certificate to demonstrate your commitment to healthcare ethics",
        "It's free thanks to generous support of the Government of Tokyo",
        "",
        "We look forward to supporting your professional growth. Join the 100M+ health professionals who participated in free IFH online healthcare training.",
        "",
        "If you have questions or difficulties registering on the online training platform, please send an email to ephealthteam@ifc.org"
      ],
      buttons: ["Register Now", "Browse Courses", "Visit Our Website", "Maybe Later", "Not interested"],
      isSponsored: true
    }
  ];

  const selectedMessage = messages[0];
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="messaging-container">
      {/* Left Sidebar - Conversations List */}
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
      {selectedMessage && (
        <main className="messaging-main">
          <div className="message-thread-header">
            <div className="thread-info">
              <div className="thread-avatar">{selectedMessage.avatar}</div>
              <h3>{selectedMessage.sender}</h3>
            </div>
            <div className="thread-actions">
              <button className="icon-btn">⋯</button>
              <button className="icon-btn">✎</button>
            </div>
          </div>

          <div className="message-content">
            <div className="message-body">
              <h4>{selectedMessage.content}</h4>
              {selectedMessage.details.map((detail, idx) => (
                <div key={idx}>
                  {detail && <p>{detail}</p>}
                </div>
              ))}
            </div>

            {selectedMessage.isSponsored && (
              <div className="message-actions">
                {selectedMessage.buttons.map((button, idx) => (
                  <button key={idx} className="action-btn">
                    {button}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

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
  );
}
