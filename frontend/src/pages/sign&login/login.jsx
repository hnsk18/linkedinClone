import React, { useState } from "react";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    console.log({ identifier, password });
    alert("Sign in (client-only) — wire to backend to authenticate.");
  };

  return (
    <div className="signin-layout">
      <div className="signin-card">
        <h2 className="signin-title">Sign in</h2>

        <form className="signin-form" onSubmit={submit}>
          <label className="field-label">Email or phone</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="text-input"
            required
          />

          <label className="field-label">Password</label>
          <div className="password-wrapper">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input password-input"
              required
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShow((s) => !s)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <a className="forgot" href="#">Forgot password?</a>

          <button className="primary-pill" type="submit">Sign in</button>

          <div className="or-divider"><span>or</span></div>

          <p className="agreement small">
            By clicking Continue to join or sign in, you agree to LinkUp's <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
          </p>

          <button type="button" className="google-pill">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M12 11.1v2.9h5.1c-.2 1.2-.9 2.2-1.9 2.9l3 2.3C19.9 18.2 21 15.9 21 13c0-.7-.1-1.4-.3-2H12z"/>
              <path fill="#34A853" d="M6.3 14.5c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9L3.3 6.4C2.4 7.9 2 9.4 2 11s.4 3.1 1.3 4.6l3-1.1z"/>
              <path fill="#4A90E2" d="M12 6.8c1 0 1.9.3 2.6.8l2-2C16.8 4.7 14.6 4 12 4 8.9 4 6.4 5.4 4.9 7.9l3 2.3C9.1 9 10.5 8 12 8z"/>
              <path fill="#FBBC05" d="M21 13c0-.7-.1-1.4-.3-2H12v3.9h5.1c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.8-1.5 3-3.9 3-6.1z"/>
            </svg>
            Continue with Google
          </button>

          <p className="new-line">New to LinkUp? <a href="/register">Join now</a></p>
        </form>
      </div>
    </div>
  );
}
