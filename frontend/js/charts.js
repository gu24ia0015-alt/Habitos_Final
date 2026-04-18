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
}