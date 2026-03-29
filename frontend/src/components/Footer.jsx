import React from "react";

export default function Footer() {
  const links = [
    "About",
    "Accessibility",
    "User Agreement",
    "Privacy Policy",
    "Cookie Policy",
    "Copyright Policy",
    "Brand Policy",
    "Guest Controls",
    "Community Guidelines",
    "Language"
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="brand-small">LinkUp © {new Date().getFullYear()}</span>
          <nav className="footer-links">
            {links.map((l) => (
              <a key={l} href="#">{l}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
