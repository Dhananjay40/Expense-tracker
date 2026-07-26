// src/config/api.ts

// Toggle this or read from VITE_API_URL if environment variable is set
const RENDER_BACKEND_URL = "https://expense-tracker-backend-vdyi.onrender.com"; 
// const LOCAL_BACKEND_URL = "http://127.0.0.1:8000";

// Uses environment variable if available (e.g. on Vercel), otherwise falls back to local
export const API_BASE_URL = import.meta.env.VITE_API_URL || RENDER_BACKEND_URL;