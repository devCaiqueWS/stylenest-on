const inferredOrigin =
  typeof window !== "undefined" && window.location && window.location.origin
    ? window.location.origin
    : "";

export const APP_BASE_URL = import.meta.env?.VITE_APP_BASE_URL || inferredOrigin;
