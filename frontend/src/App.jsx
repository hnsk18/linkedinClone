import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MessagingDock from "./components/MessagingDock";
import Login from "./pages/sign&login/login";
import Register from "./pages/sign&login/register";
import HomePage from "./pages/HomePage";
import MyNetwork from "./pages/MyNetwork";
import Jobs from "./pages/Jobs";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import ProfilePage from "./pages/ProfilePage";
import ForBusiness from "./pages/ForBusiness";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './index.css';

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/home", "/mynetwork", "/jobs", "/messaging", "/notifications", "/profile", "/forbusiness"].includes(location.pathname);
  // Hide the old Header (navbar) on all app-style pages and auth screens
  const hideHeader = ["/profile", "/home", "/mynetwork", "/jobs", "/messaging", "/notifications", "/login", "/register", "/forbusiness"].includes(location.pathname);
  const showMessagingDock = !["/login", "/register"].includes(location.pathname);

  return (
    <div className="app-root">
      {!hideHeader && <Header />}
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/mynetwork" element={<MyNetwork />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forbusiness" element={<ForBusiness />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      {showMessagingDock && <MessagingDock />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
