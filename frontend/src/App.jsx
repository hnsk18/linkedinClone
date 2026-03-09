import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MessagingDock from "./components/MessagingDock";
import AppRoutes from "./routes/AppRoutes";
import { ChatProvider } from "./context/ChatContext";

import "./index.css";

function AppContent() {
  const location = useLocation();

  const hideFooter = [
    "/home",
    "/mynetwork",
    "/jobs",
    "/messaging",
    "/notifications",
    "/profile",
    "/forbusiness",
  ].includes(location.pathname);

  const hideHeader = [
    "/profile",
    "/home",
    "/mynetwork",
    "/jobs",
    "/messaging",
    "/notifications",
    "/login",
    "/register",
    "/forbusiness",
  ].includes(location.pathname);

  const showMessagingDock = !["/login", "/register"].includes(
    location.pathname
  );

  return (
    <div className="app-root">
      {!hideHeader && <Header />}

      <main className="site-main">
        <AppRoutes />
      </main>

      {!hideFooter && <Footer />}

      {showMessagingDock && <MessagingDock />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </BrowserRouter>
  );
}
