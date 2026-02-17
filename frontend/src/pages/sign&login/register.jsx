import React, { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    alert("Agree & Join (client-only). Connect to backend to complete registration.");
  };

  return (
    <div className="join-layout">
      <div className="join-card">
        <h2 className="join-title">Join LinkUp</h2>

        <form className="join-form" onSubmit={submit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="text-input"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password (6+ characters)"
            className="text-input"
          />

          <p className="agreement">
            By clicking Agree & Join, you agree to the LinkUp <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
          </p>

          <button className="primary-pill" type="submit">Agree & Join</button>

          <div className="or-divider"><span>or</span></div>

          <button type="button" className="google-pill">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M12 11.1v2.9h5.1c-.2 1.2-.9 2.2-1.9 2.9l3 2.3C19.9 18.2 21 15.9 21 13c0-.7-.1-1.4-.3-2H12z"/>
              <path fill="#34A853" d="M6.3 14.5c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9L3.3 6.4C2.4 7.9 2 9.4 2 11s.4 3.1 1.3 4.6l3-1.1z"/>
              <path fill="#4A90E2" d="M12 6.8c1 0 1.9.3 2.6.8l2-2C16.8 4.7 14.6 4 12 4 8.9 4 6.4 5.4 4.9 7.9l3 2.3C9.1 9 10.5 8 12 8z"/>
              <path fill="#FBBC05" d="M21 13c0-.7-.1-1.4-.3-2H12v3.9h5.1c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.8-1.5 3-3.9 3-6.1z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="signup-line">Already on LinkUp? <a href="/login">Sign in</a></p>
        </form>
      </div>
    </div>
  );
}
