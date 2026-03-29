import React, { useEffect } from "react";
import "./Modal.css";

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="lu-modal-overlay" onMouseDown={onClose}>
      <div className="lu-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="lu-modal-header">
          <h3 className="lu-modal-title">{title}</h3>
          <button className="lu-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="lu-modal-body">{children}</div>
      </div>
    </div>
  );
}

