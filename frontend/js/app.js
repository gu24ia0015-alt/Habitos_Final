const API = 'http://127.0.0.1:5000/api';
let habits = [];
let completions = [];
let stats = [];
let selectedColor = '#6366f1';

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTodayDate();
  loadAll();
  setupModal();
  setupTheme();
});