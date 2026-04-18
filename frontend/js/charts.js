let chartInstances = {};

function renderCharts() {
  const container = document.getElementById('charts-container');

  if (!stats || stats.length === 0) {
    container.innerHTML = '<p class="empty-msg">Agrega hábitos para ver gráficas 📊</p>';
    return;
  }

  // Destruir charts anteriores para evitar duplicados
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  container.innerHTML = stats.map(s =>
    `<div class="chart-wrapper">
       <h4>${s.name} — ${s.total_completions} completaciones</h4>
       <canvas id="chart-${s.habit_id}"></canvas>
     </div>`
  ).join('');
}