import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (typeof window === "undefined") {
    return <Navigate to="/login" replace />;
  }

  let token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Strip accidental surrounding quotes from older logins
  token = token.replace(/^"|"$/g, "");

  try {
    const decoded = jwtDecode(token);
    // If token has an expiry and it's in the past, treat as logged out
    if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  } catch (e) {
    // Invalid / corrupt token – clear it and force login
    localStorage.removeItem("token");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}