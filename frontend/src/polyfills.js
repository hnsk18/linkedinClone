// Ensure Node-style `global` exists for libraries like sockjs-client
if (typeof window !== "undefined" && typeof window.global === "undefined") {
  // eslint-disable-next-line no-undef
  window.global = window;
}

