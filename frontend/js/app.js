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



// ── FETCH ─────────────────────────────────────────────────────
async function fetchHabits() {
  const res = await fetch(`${API}/habits`);
  habits = await res.json();
}

async function fetchCompletions() {
  const res = await fetch(`${API}/completions`);
  completions = await res.json();
}

async function fetchStats() {
  const res = await fetch(`${API}/stats`);
  stats = await res.json();
}



// ── RENDER HABITS ─────────────────────────────────────────────
function renderHabits() {
  const list = document.getElementById('habits-list');
  const today = new Date().toISOString().split('T')[0];

  if (habits.length === 0) {
    list.innerHTML = '<p class="empty-msg">No tienes hábitos aún. ¡Crea uno! 🚀</p>';
    return;
  }

  list.innerHTML = habits.map(habit => {
    const isDone = completions.some(c =>
      c.habit_id === habit.id && c.completed_date === today
    );
    const habitStats = stats.find(s => s.habit_id === habit.id);
    const streak = habitStats ? habitStats.current_streak : 0;

    return `
      <div class="habit-item" id="habit-${habit.id}">
        <div class="habit-color" style="background:${habit.color}"></div>
        <div class="habit-info">
          <p class="habit-name">${habit.name}</p>
          <p class="habit-streak">🔥 ${streak} días de racha</p>
        </div>
        <button class="habit-check ${isDone ? 'done' : ''}"
          onclick="toggleHabit(${habit.id})"
          title="${isDone ? 'Marcar incompleto' : 'Marcar completo'}">
          ${isDone ? '✓' : ''}
        </button>
        <button class="habit-delete" onclick="deleteHabit(${habit.id})" title="Eliminar">🗑</button>
      </div>`;
  }).join('');
}



// ── RENDER STAT CARDS ─────────────────────────────────────────
function renderStats() {
  const today = new Date().toISOString().split('T')[0];
  const completedToday = completions.filter(c => c.completed_date === today).length;
  const bestStreak = stats.reduce((max, s) => Math.max(max, s.current_streak), 0);

  document.getElementById('total-habits').textContent = habits.length;
  document.getElementById('completed-today').textContent = completedToday;
  document.getElementById('best-streak').textContent = bestStreak;
}



// ── TOGGLE COMPLETION ─────────────────────────────────────────
async function toggleHabit(habitId) {
  const today = new Date().toISOString().split('T')[0];
  await fetch(`${API}/completions/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habit_id: habitId, date: today })
  });
  await loadAll();
}



// ── DELETE HABIT ──────────────────────────────────────────────
async function deleteHabit(habitId) {
  if (!confirm('¿Eliminar este hábito?')) return;
  await fetch(`${API}/habits/${habitId}`, { method: 'DELETE' });
  await loadAll();
}