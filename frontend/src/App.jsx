import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/sign&login/login";
import Register from "./pages/sign&login/register";
import Home from "./pages/Home";
import MyNetwork from "./pages/MyNetwork";
import Jobs from "./pages/Jobs";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ForBusiness from "./pages/ForBusiness";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const hideFooter = ["/home", "/mynetwork", "/jobs", "/messaging", "/notifications", "/profile", "/forbusiness"].includes(location.pathname);

  return (
    <div className="app-root">
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mynetwork" element={<MyNetwork />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forbusiness" element={<ForBusiness />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
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
