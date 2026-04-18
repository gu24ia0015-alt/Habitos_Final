let currentDate = new Date();

window.renderCalendar = function () {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById('calendar-title').textContent =
    new Date(year, month).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}


let currentDate = new Date();

window.renderCalendar = function () {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById('calendar-title').textContent =
    new Date(year, month).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const cal = document.getElementById('calendar');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  let html = days.map(d => `<div class="cal-header">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasComp = completions.some(c => c.completed_date === dateStr);
    const isToday = dateStr === today;

    html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasComp ? 'has-completions' : ''}"
      title="${dateStr}">${d}</div>`;
  }

  cal.innerHTML = html;
}