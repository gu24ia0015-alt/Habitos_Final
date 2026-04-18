let currentDate = new Date();

window.renderCalendar = function () {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById('calendar-title').textContent =
    new Date(year, month).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}