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



function setTodayDate() {
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('es-MX', opts);
}

async function loadAll() {
  await Promise.all([fetchHabits(), fetchCompletions(), fetchStats()]);
  renderHabits();
  renderStats();
  renderCharts();
  if (window.renderCalendar) window.renderCalendar();
}