import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/sign&login/login";
import Register from "../pages/sign&login/register";
import HomePage from "../pages/HomePage";
import MyNetwork from "../pages/MyNetwork";
import Jobs from "../pages/Jobs";
import Messaging from "../pages/Messaging";
import Notifications from "../pages/Notifications";
import ProfilePage from "../pages/ProfilePage";
import ForBusiness from "../pages/ForBusiness";
import PostDetailPage from "../pages/PostDetailPage";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mynetwork"
        element={
          <ProtectedRoute>
            <MyNetwork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messaging"
        element={
          <ProtectedRoute>
            <Messaging />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forbusiness"
        element={
          <ProtectedRoute>
            <ForBusiness />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:id"
        element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

