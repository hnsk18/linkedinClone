import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/messaging.css";
import { useChat } from "../context/ChatContext";
import { useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// ── Emoji list ────────────────────────────────────────────────────────
const EMOJI_LIST = [
  "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","🥰","😘",
  "😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥",
  "😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕",
  "🙃","🤑","😲","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯",
  "😬","😰","😱","🥵","🥶","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢",
  "🤧","🥴","🤠","😈","👿","👻","💀","☠️","💩","🤡","👹","👺","👾","🤖","🎃",
  "👋","🤚","🖐️","✋","🖖","👌","🤌","✌️","🤞","🤟","🤘","🤙","👈","👉","👆",
  "👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗",
  "💖","💘","💝","💟","🔥","⭐","🌟","💫","✨","🎉","🎊","🎈","🎁","🏆","🥇",
];

export default function Messaging() {
  const [activeTab, setActiveTab] = useState("all");
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [threadMessages, setThreadMessages] = useState([]);

  // Persist read state across refreshes
  const [openedEmails, setOpenedEmails] = useState(() => {
    try {
      const stored = localStorage.getItem("msg_read_emails");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Composer panel state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null); // { name, url, type }

  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const hasLoadedInitial = useRef(false);
  const menuRef = useRef(null);

  // ── Three-dots menu & modes ─────────────────────────────────────────
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [manageMode, setManageMode] = useState(false); // manage conversations
  const [selectedConvs, setSelectedConvs] = useState(new Set()); // selected emails
  const [showAwayModal, setShowAwayModal] = useState(false);
  const [awayMsg, setAwayMsg] = useState("I'm currently away. I'll respond to your message when I return.");
  const [awayStart, setAwayStart] = useState(new Date().toISOString().split("T")[0]);
  const [awayEnd, setAwayEnd] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );

  // ── Compose new message ─────────────────────────────────────────────
  const [showCompose, setShowCompose] = useState(false);
  const [composeSearch, setComposeSearch] = useState("");
  const [composeResults, setComposeResults] = useState([]);
  const [composeTo, setComposeTo] = useState(null); // selected user {name, email}
  const [composeDraft, setComposeDraft] = useState("");

  const { messages, sendMessage, currentUserEmail, connected } = useChat();
  const [params, setParams] = useSearchParams();
  const toEmail = (params.get("toEmail") || "").trim();

  // Prefill composer when opened from feed "Send" (e.g. ?prefill=...), then strip param from URL
  useEffect(() => {
    const prefill = params.get("prefill");
    if (!toEmail || !prefill) return;
    setDraft(prefill);
    const next = new URLSearchParams(params);
    next.delete("prefill");
    setParams(next, { replace: true });
  }, [toEmail, params, setParams]);

  const token = useMemo(() => {
    let t = localStorage.getItem("token");
    if (!t) return null;
    return t.replace(/^\"|\"$/g, "");
  }, []);

  // Persist openedEmails to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("msg_read_emails", JSON.stringify([...openedEmails]));
    } catch {}
  }, [openedEmails]);

  // Close emoji picker and header menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowHeaderMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Conversations ───────────────────────────────────────────────────
  const loadConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load conversations", e);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Initial thread load from URL ────────────────────────────────────
  useEffect(() => {
    if (hasLoadedInitial.current) return;
    const load = async () => {
      if (!token || !toEmail) return;
      hasLoadedInitial.current = true;
      setOpenedEmails((prev) => new Set([...prev, toEmail.toLowerCase()]));
      try {
        const res = await fetch(
          `${API_BASE}/api/messages/thread?with=${encodeURIComponent(toEmail)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setThreadMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load thread", e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, toEmail]);

  // ── WebSocket incoming messages ─────────────────────────────────────
  useEffect(() => {
    if (!toEmail || !currentUserEmail) return;
    const last = messages[messages.length - 1];
    if (!last) return;
    const a = (last.senderEmail || "").toLowerCase();
    const b = (last.receiverEmail || "").toLowerCase();
    const me = currentUserEmail.toLowerCase();
    const other = toEmail.toLowerCase();
    const isInThread = (a === me && b === other) || (a === other && b === me);
    if (!isInThread) return;
    setThreadMessages((prev) => {
      const optimisticIdx = prev.findIndex(
        (m) =>
          String(m.id).startsWith("optimistic-") &&
          m.senderEmail === last.senderEmail &&
          m.content === last.content
      );
      if (optimisticIdx !== -1) {
        const updated = [...prev];
        updated[optimisticIdx] = last;
        return updated;
      }
      return [...prev, last];
    });
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, toEmail, currentUserEmail]);

  // Auto-scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  // ── Open conversation ───────────────────────────────────────────────
  const openConversation = async (email) => {
    setParams({ toEmail: email });
    setOpenedEmails((prev) => new Set([...prev, email.toLowerCase()]));
    setThreadMessages([]);
    setAttachedFile(null);
    if (!token) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/messages/thread?with=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setThreadMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load thread", e);
    }
  };

  // ── Send ────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!draft.trim() && !attachedFile) return;

    let content = draft.trim();
    if (attachedFile) {
      content = attachedFile.type.startsWith("image/")
        ? `[IMAGE] ${attachedFile.name}`
        : `[FILE] ${attachedFile.name}`;
      if (draft.trim()) content = `${draft.trim()}\n${content}`;
    }

    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      senderEmail: currentUserEmail,
      receiverEmail: toEmail || null,
      content,
      attachedFile: attachedFile || null,
    };
    if (toEmail) setThreadMessages((prev) => [...prev, optimisticMsg]);

    sendMessage(content, toEmail || null);
    setDraft("");
    setAttachedFile(null);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
    setTimeout(loadConversations, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Emoji ───────────────────────────────────────────────────────────
  const insertEmoji = (emoji) => {
    setDraft((prev) => prev + emoji);
  };

  // ── File attachment ─────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachedFile({ name: file.name, url, type: file.type });
    e.target.value = "";
  };

  // ── GIF search (Tenor free API) ─────────────────────────────────────
  const [gifQuery, setGifQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const TENOR_KEY = "AIzaSyAI6zHhPMkoFMKaEBHR5gDnSdoLT-pq2sM"; // demo key
  const searchGifs = async (q) => {
    if (!q.trim()) { setGifs([]); return; }
    try {
      const res = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(q)}&key=${TENOR_KEY}&limit=12&media_filter=gif`
      );
      if (!res.ok) return;
      const data = await res.json();
      setGifs(data.results || []);
    } catch {}
  };

  const sendGif = (gifUrl) => {
    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      senderEmail: currentUserEmail,
      receiverEmail: toEmail || null,
      content: `[GIF] ${gifUrl}`,
      gifUrl,
    };
    if (toEmail) setThreadMessages((prev) => [...prev, optimisticMsg]);
    sendMessage(`[GIF] ${gifUrl}`, toEmail || null);
    setShowGifPicker(false);
    setGifs([]);
    setGifQuery("");
    setTimeout(loadConversations, 400);
  };

  // ── Manage mode helpers ─────────────────────────────────────────────
  const toggleSelectConv = (email) => {
    setSelectedConvs((prev) => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  };

  const markSelectedAsRead = () => {
    setOpenedEmails((prev) => new Set([...prev, ...[...selectedConvs].map((e) => e.toLowerCase())]));
    setSelectedConvs(new Set());
  };

  const deleteSelectedConvs = () => {
    if (!window.confirm(`Delete ${selectedConvs.size} conversation(s) from your view?`)) return;
    setConversations((prev) => prev.filter((c) => !selectedConvs.has(c.otherEmail)));
    setSelectedConvs(new Set());
    // If the open thread was deleted, close it
    if (toEmail && selectedConvs.has(toEmail)) {
      setParams({});
      setThreadMessages([]);
    }
  };

  // ── Compose new message ─────────────────────────────────────────────
  const searchUsers = async (q) => {
    if (!q.trim() || !token) { setComposeResults([]); return; }
    try {
      const res = await fetch(
        `${API_BASE}/api/users/search?q=${encodeURIComponent(q)}&limit=8`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setComposeResults(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleComposeSend = () => {
    if (!composeTo || !composeDraft.trim()) return;
    sendMessage(composeDraft.trim(), composeTo.email);
    openConversation(composeTo.email);
    setShowCompose(false);
    setComposeTo(null);
    setComposeDraft("");
    setComposeSearch("");
    setComposeResults([]);
  };

  const filteredConversations = conversations.filter((c) => {
    // Skip global chat / null-receiver entries
    if (!c.otherEmail || c.otherEmail === "null") return false;
    const matchesSearch =
      !searchQuery.trim() ||
      (c.otherName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.otherEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "unread") {
      return matchesSearch && !openedEmails.has((c.otherEmail || "").toLowerCase());
    }
    return matchesSearch;
  });

  const unreadCount = conversations.filter(
    (c) => !openedEmails.has((c.otherEmail || "").toLowerCase())
  ).length;

  const displayName = toEmail || "Select a conversation";
  const avatarLetter = (toEmail || "?")[0].toUpperCase();

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // ── Render message content ──────────────────────────────────────────
  const renderContent = (m) => {
    if (m.gifUrl) return <img src={m.gifUrl} alt="GIF" className="chat-gif" />;
    if (m.content?.startsWith("[GIF] ")) {
      return <img src={m.content.replace("[GIF] ", "")} alt="GIF" className="chat-gif" />;
    }
    // Optimistic image (blob URL still alive)
    if (m.attachedFile?.type?.startsWith("image/")) {
      return (
        <>
          <a href={m.attachedFile.url} target="_blank" rel="noreferrer">
            <img src={m.attachedFile.url} alt={m.attachedFile.name} className="chat-img-preview" />
          </a>
          {m.content && !m.content.startsWith("[IMAGE]") && <div className="chat-text">{m.content}</div>}
        </>
      );
    }
    // Optimistic file (blob URL still alive)
    if (m.attachedFile?.url) {
      return (
        <a href={m.attachedFile.url} target="_blank" rel="noreferrer" download={m.attachedFile.name} className="chat-file-link">
          📎 {m.attachedFile.name}
        </a>
      );
    }
    // Stored image message (no blob after refresh)
    if (m.content?.startsWith("[IMAGE] ")) {
      return <div className="chat-text chat-file">📷 {m.content.replace("[IMAGE] ", "")}</div>;
    }
    // Stored file message (no blob after refresh — show download hint)
    if (m.content?.startsWith("[FILE] ")) {
      const name = m.content.replace("[FILE] ", "");
      return (
        <div className="chat-file-chip">
          <span className="chat-file-icon">📎</span>
          <span className="chat-file-label">{name}</span>
          <span className="chat-file-note">(open in new session to download)</span>
        </div>
      );
    }
    // Mixed text + [FILE] or [IMAGE] suffix
    if (m.content?.includes("\n[FILE] ") || m.content?.includes("\n[IMAGE] ")) {
      const parts = m.content.split("\n");
      return (
        <>
          {parts.map((p, i) => (
            p.startsWith("[FILE] ") ? (
              <div key={i} className="chat-file-chip">
                <span className="chat-file-icon">📎</span>
                <span className="chat-file-label">{p.replace("[FILE] ", "")}</span>
              </div>
            ) : p.startsWith("[IMAGE] ") ? (
              <div key={i} className="chat-file-chip">
                <span className="chat-file-icon">📷</span>
                <span className="chat-file-label">{p.replace("[IMAGE] ", "")}</span>
              </div>
            ) : <div key={i} className="chat-text">{p}</div>
          ))}
        </>
      );
    }
    return <div className="chat-text">{m.content}</div>;
  };

  return (
    <div className="messaging-page-container">
      <Navbar />
      <div className="messaging-container">

        {/* ── Left Sidebar ── */}
        <aside className="messaging-sidebar">
          {/* Header with three-dots menu */}
          <div className="messaging-header">
            <h2>Messaging</h2>
            <div className="messaging-header-actions">
              {/* Three-dots dropdown */}
              <div className="msg-menu-wrap" ref={menuRef}>
                <button
                  className="compose-btn"
                  title="Options"
                  onClick={() => setShowHeaderMenu((v) => !v)}
                >⋯</button>
                {showHeaderMenu && (
                  <div className="msg-dropdown">
                    <button className="msg-dropdown-item" onClick={() => {
                      setManageMode(true);
                      setShowHeaderMenu(false);
                      setSelectedConvs(new Set());
                    }}>🗂 Manage conversations</button>
                    <button className="msg-dropdown-item" onClick={() => {
                      setShowAwayModal(true);
                      setShowHeaderMenu(false);
                    }}>🌙 Set away message</button>
                    <button className="msg-dropdown-item" onClick={() => {
                      alert("Settings coming soon!");
                      setShowHeaderMenu(false);
                    }}>⚙️ Manage settings</button>
                  </div>
                )}
              </div>
              {/* Compose new message */}
              <button
                className="compose-btn"
                title="New message"
                onClick={() => setShowCompose(true)}
              >✎</button>
            </div>
          </div>

          {/* Manage-mode action bar */}
          {manageMode && (
            <div className="manage-bar">
              <span className="manage-count">
                {selectedConvs.size > 0 ? `${selectedConvs.size} selected` : "Select conversations"}
              </span>
              <div className="manage-actions">
                <button
                  className="manage-btn read-btn"
                  disabled={selectedConvs.size === 0}
                  onClick={markSelectedAsRead}
                  title="Mark as read"
                >✓ Read</button>
                <button
                  className="manage-btn delete-btn"
                  disabled={selectedConvs.size === 0}
                  onClick={deleteSelectedConvs}
                  title="Delete selected"
                >🗑 Delete</button>
                <button
                  className="manage-btn cancel-btn"
                  onClick={() => { setManageMode(false); setSelectedConvs(new Set()); }}
                >✕</button>
              </div>
            </div>
          )}

          <div className="msg-search-box">
            <span className="msg-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="msg-search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          <div className="msg-tabs">
            <button
              className={`msg-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >All chats</button>
            <button
              className={`msg-tab ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Unread
              {unreadCount > 0 && <span className="msg-tab-badge">{unreadCount}</span>}
            </button>
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 && (
              <div className="msg-empty">
                {searchQuery ? "No conversations match." : activeTab === "unread" ? "No unread messages." : "No conversations yet."}
              </div>
            )}
            {filteredConversations.map((c) => {
              const isActive = (c.otherEmail || "").toLowerCase() === toEmail.toLowerCase();
              const isUnread = !openedEmails.has((c.otherEmail || "").toLowerCase());
              const isSelected = selectedConvs.has(c.otherEmail);
              const initial = (c.otherName || c.otherEmail || "?")[0].toUpperCase();
              return (
                <div
                  key={c.otherEmail}
                  className={`conversation-item ${isActive ? "active" : ""} ${isUnread ? "unread" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => manageMode ? toggleSelectConv(c.otherEmail) : openConversation(c.otherEmail)}
                >
                  {manageMode && (
                    <input
                      type="checkbox"
                      className="conv-checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectConv(c.otherEmail)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="conversation-avatar">{initial}</div>
                  <div className="conversation-info">
                    <h4>{c.otherName || c.otherEmail}</h4>
                    <p>{c.isMine ? `You: ${c.lastMessage}` : c.lastMessage}</p>
                  </div>
                  <div className="conversation-meta">
                    <span className="date">{formatTime(c.timestamp)}</span>
                    {isUnread && !manageMode && <div className="unread-dot" />}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main Thread ── */}
        <main className="messaging-main">
          {!toEmail ? (
            /* ── Empty state ── */
            <div className="messaging-empty-state">
              <img
                src="/messaging_empty_state.png"
                alt="Start a conversation"
                className="messaging-empty-img"
              />
              <h3>Your messages</h3>
              <p>Select a conversation from the left to start messaging.</p>
            </div>
          ) : (
            <>
              <div className="message-thread-header">
                <div className="thread-info">
                  <div className="thread-avatar">{avatarLetter}</div>
                  <h3>{toEmail}</h3>
                </div>
                <div className="thread-actions">
                  <button className="icon-btn">⋯</button>
                  <button className="icon-btn">✎</button>
                </div>
              </div>

              <div className="message-content chat-thread">
                <div className="chat-messages">
                  {!connected && <div className="chat-status">Connecting to chat…</div>}
                  {threadMessages.map((m, idx) => {
                    const isMe =
                      m.senderEmail &&
                      currentUserEmail &&
                      m.senderEmail.toLowerCase() === currentUserEmail.toLowerCase();
                    return (
                      <div key={m.id ?? idx} className={`chat-message ${isMe ? "sent" : "received"}`}>
                        <div className="chat-bubble">
                          {!isMe && <div className="chat-meta">{m.senderEmail || "Unknown"}</div>}
                          {renderContent(m)}
                          {m.timestamp && <div className="chat-time">{formatTime(m.timestamp)}</div>}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>
              </div>

              {/* Composer */}
              <div className="message-composer">
                {attachedFile && (
                  <div className="composer-attachment">
                    {attachedFile.type.startsWith("image/") ? (
                      <img src={attachedFile.url} alt={attachedFile.name} className="attachment-preview-img" />
                    ) : (
                      <span className="attachment-file-name">📎 {attachedFile.name}</span>
                    )}
                    <button className="attachment-remove" onClick={() => setAttachedFile(null)}>✕</button>
                  </div>
                )}

                <textarea
                  className="composer-input"
                  placeholder="Write a message..."
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                {showEmojiPicker && (
                  <div className="emoji-picker" ref={emojiPickerRef}>
                    {EMOJI_LIST.map((emoji) => (
                      <button key={emoji} className="emoji-btn" type="button" onClick={() => insertEmoji(emoji)}>{emoji}</button>
                    ))}
                  </div>
                )}

                {showGifPicker && (
                  <div className="gif-picker">
                    <input
                      className="gif-search-input"
                      type="text"
                      placeholder="Search GIFs..."
                      value={gifQuery}
                      onChange={(e) => { setGifQuery(e.target.value); searchGifs(e.target.value); }}
                      autoFocus
                    />
                    <div className="gif-grid">
                      {gifs.length === 0 && gifQuery && <div className="gif-empty">No GIFs found.</div>}
                      {gifs.length === 0 && !gifQuery && <div className="gif-empty">Type to search GIFs…</div>}
                      {gifs.map((g) => {
                        const url = g.media_formats?.gif?.url || g.media_formats?.tinygif?.url;
                        const preview = g.media_formats?.nanogif?.url || url;
                        return <img key={g.id} src={preview} alt={g.title} className="gif-item" onClick={() => sendGif(url)} />;
                      })}
                    </div>
                  </div>
                )}

                <div className="composer-footer">
                  <div className="composer-tools">
                    <button className={`composer-icon-btn ${showEmojiPicker ? "active" : ""}`} type="button" title="Emoji"
                      onClick={() => { setShowEmojiPicker((v) => !v); setShowGifPicker(false); }}>🙂</button>
                    <button className={`composer-icon-btn gif-btn ${showGifPicker ? "active" : ""}`} type="button" title="GIF"
                      onClick={() => { setShowGifPicker((v) => !v); setShowEmojiPicker(false); }}>GIF</button>
                    <button className="composer-icon-btn" type="button" title="Attach file or image"
                      onClick={() => fileInputRef.current?.click()}>📎</button>
                    <input ref={fileInputRef} type="file" accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
                      style={{ display: "none" }} onChange={handleFileChange} />
                  </div>
                  <button className="send-btn" type="button" onClick={handleSend}
                    disabled={!draft.trim() && !attachedFile}>Send</button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="messaging-right">
          <div className="promo-card">
            <h3>💼 State Bank of India</h3>
            <p>hemanth, grow your career by following State Bank of India</p>
            <p>Keep up with interesting, relevant updates</p>
            <div className="follow-info"><span>😊 2 of your connections are following</span></div>
            <button className="follow-btn">Follow</button>
          </div>
          <div className="footer-links">
            <a href="#">About</a><a href="#">Accessibility</a><a href="#">Help Center</a>
            <a href="#">Privacy &amp; Terms</a><a href="#">Ad Choices</a>
            <a href="#">Advertising</a><a href="#">Business Services</a>
            <a href="#">Get the LinkedIn app</a><a href="#">More</a>
          </div>
          <p className="copyright">LinkedIn &copy; 2026</p>
        </aside>
      </div>

      {/* ── Compose New Message Modal ── */}
      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compose-modal-header">
              <h3>New message</h3>
              <button className="modal-close" onClick={() => setShowCompose(false)}>✕</button>
            </div>

            {/* Recipient search */}
            {!composeTo ? (
              <>
                <div className="compose-search-box">
                  <span className="compose-search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Type a name or email..."
                    value={composeSearch}
                    autoFocus
                    onChange={(e) => { setComposeSearch(e.target.value); searchUsers(e.target.value); }}
                  />
                </div>
                {composeResults.length > 0 && (
                  <div className="compose-results">
                    {composeResults.map((u) => (
                      <div
                        key={u.email}
                        className="compose-result-item"
                        onClick={() => { setComposeTo(u); setComposeSearch(""); setComposeResults([]); }}
                      >
                        <div className="compose-result-avatar">{(u.name || u.email || "?")[0].toUpperCase()}</div>
                        <div className="compose-result-info">
                          <strong>{u.name || u.email}</strong>
                          {u.headline && <span>{u.headline}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {composeSearch && composeResults.length === 0 && (
                  <div className="compose-empty">No users found for "{composeSearch}"</div>
                )}
              </>
            ) : (
              <>
                {/* Selected recipient */}
                <div className="compose-to-chip">
                  <span>To:</span>
                  <div className="compose-chip">
                    {composeTo.name || composeTo.email}
                    <button onClick={() => setComposeTo(null)}>✕</button>
                  </div>
                </div>
                {/* Compose area */}
                <textarea
                  className="compose-textarea"
                  placeholder={`Write a message to ${composeTo.name || composeTo.email}...`}
                  value={composeDraft}
                  onChange={(e) => setComposeDraft(e.target.value)}
                  autoFocus
                  rows={5}
                />
                <div className="compose-modal-footer">
                  <button
                    className="send-btn"
                    onClick={handleComposeSend}
                    disabled={!composeDraft.trim()}
                  >Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Away Message Modal ── */}
      {showAwayModal && (
        <div className="modal-overlay" onClick={() => setShowAwayModal(false)}>
          <div className="away-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compose-modal-header">
              <h3>Set an away message</h3>
              <button className="modal-close" onClick={() => setShowAwayModal(false)}>✕</button>
            </div>
            <p className="away-desc">Inform your connections you may be slow to respond.</p>
            <div className="away-dates">
              <label>
                Start date
                <input type="date" value={awayStart} onChange={(e) => setAwayStart(e.target.value)} />
              </label>
              <span className="away-dash">—</span>
              <label>
                End date
                <input type="date" value={awayEnd} onChange={(e) => setAwayEnd(e.target.value)} />
              </label>
            </div>
            <label className="away-msg-label">
              Message
              <textarea
                className="compose-textarea"
                value={awayMsg}
                onChange={(e) => setAwayMsg(e.target.value)}
                rows={5}
                maxLength={300}
              />
              <span className="away-char">{awayMsg.length}/300</span>
            </label>
            <div className="compose-modal-footer">
              <button className="send-btn" onClick={() => { alert("Away message saved!"); setShowAwayModal(false); }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
