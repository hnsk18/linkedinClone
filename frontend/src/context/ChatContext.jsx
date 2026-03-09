import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";

const API_BASE = "http://localhost:8080";

const ChatContext = createContext(null);

function getAuthToken() {
  if (typeof window === "undefined") return null;
  let token = localStorage.getItem("token");
  if (!token) return null;
  return token.replace(/^"|"$/g, "");
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setCurrentUserEmail(decoded.sub || decoded.email || null);
    } catch {
      setCurrentUserEmail(null);
    }
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${API_BASE}/chat`);

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      setConnected(true);
      client.subscribe("/topic/messages", (frame) => {
        try {
          const body = JSON.parse(frame.body);
          setMessages((prev) => [...prev, body]);
        } catch (e) {
          console.error("Failed to parse incoming message", e);
        }
      });
    };

    client.onStompError = () => {
      setConnected(false);
    };

    client.onWebSocketClose = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  const sendMessage = (content, receiverEmail = null) => {
    const trimmed = (content || "").trim();
    if (!trimmed || !clientRef.current || !connected) return;

    const senderEmail = currentUserEmail || "me@example.com";
    const payload = {
      senderEmail,
      receiverEmail,
      content: trimmed,
    };

    clientRef.current.publish({
      destination: "/app/send",
      body: JSON.stringify(payload),
    });
  };

  const value = {
    messages,
    sendMessage,
    connected,
    currentUserEmail,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return ctx;
}

