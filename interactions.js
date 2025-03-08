let chart, chartType = 'line', selectedFillColor = '#36A2EB', selectedBorderColor = '#36A2EB', selectedBgColor = '#ffffff';

function initChart() {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  const data = { labels: ['January', 'February', 'March', 'April', 'May'], datasets: [{ label: 'Sample Data', data: [65, 59, 80, 81, 56], backgroundColor: selectedFillColor, borderColor: selectedBorderColor, borderWidth: 2 }] };
  const options = { responsive: true, maintainAspectRatio: true, aspectRatio: 1, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Chart Title' } }, scales: { x: { title: { display: true, text: 'X-Axis' }, grid: { display: true } }, y: { title: { display: true, text: 'Y-Axis' }, grid: { display: true } } } };
  chart = new Chart(ctx, { type: chartType, data: data, options: options });
  document.getElementById('chartTitle').value = 'Chart Title';
  document.getElementById('xAxisLabel').value = 'X-Axis';
  document.getElementById('yAxisLabel').value = 'Y-Axis';
  document.getElementById('dataInputContainer').innerHTML = '';
  data.labels.forEach((label, index) => addDataRow(label, data.datasets[0].data[index]));
}

function updateChart() {
  const title = document.getElementById('chartTitle').value, xAxisLabel = document.getElementById('xAxisLabel').value, yAxisLabel = document.getElementById('yAxisLabel').value;
  let chartData = {}, datasets = [];
  if (chartType === 'line' || chartType === 'bar') {
    const dataRows = document.querySelectorAll('#dataInputContainer .data-row'), labels = [], values = [];
    dataRows.forEach(row => { const label = row.querySelector('.data-label').value, value = parseFloat(row.querySelector('.data-value').value); if (label && !isNaN(value)) { labels.push(label); values.push(value); } });
    chartData = { labels: labels, datasets: [{ label: 'Data', data: values, backgroundColor: chartType === 'line' ? 'rgba(' + hexToRgb(selectedFillColor) + ',0.2)' : selectedFillColor, borderColor: selectedBorderColor, borderWidth: 2 }] };
  } else if (chartType === 'scatter') {
    const scatterRows = document.querySelectorAll('#scatterInputContainer .data-row'), scatterData = [];
    scatterRows.forEach(row => { const x = parseFloat(row.querySelector('.scatter-x').value), y = parseFloat(row.querySelector('.scatter-y').value); if (!isNaN(x) && !isNaN(y)) scatterData.push({ x, y }); });
    chartData = { datasets: [{ label: 'Scatter Data', data: scatterData, backgroundColor: selectedFillColor, borderColor: selectedBorderColor, borderWidth: 2, pointRadius: 6, pointHoverRadius: 8 }] };
  } else if (chartType === 'pie') {
    const dataRows = document.querySelectorAll('#dataInputContainer .data-row'), labels = [], values = [], backgroundColors = [], borderColors = [];
    const colorOptions = Array.from(document.querySelectorAll('#FillColorPicker .color-option')).map(el => el.dataset.color);
    dataRows.forEach((row, index) => { const label = row.querySelector('.data-label').value, value = parseFloat(row.querySelector('.data-value').value); if (label && !isNaN(value)) { labels.push(label); values.push(value); backgroundColors.push(colorOptions[index % colorOptions.length]); borderColors.push('#ffffff'); } });
    chartData = { labels: labels, datasets: [{ data: values, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1 }] };
  }
  const showGridLines = document.getElementById('gridLines').value === 'true', legendPosition = document.getElementById('legendPosition').value;
  const chartOptions = { responsive: true, maintainAspectRatio: true, aspectRatio: 1, plugins: { legend: { position: legendPosition, display: chartType !== 'scatter' }, title: { display: title !== '', text: title } } };
  if (chartType !== 'pie') chartOptions.scales = { x: { title: { display: xAxisLabel !== '', text: xAxisLabel }, grid: { display: showGridLines } }, y: { title: { display: yAxisLabel !== '', text: yAxisLabel }, grid: { display: showGridLines } } };
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('chartCanvas').getContext('2d'), { type: chartType === 'candlestick' ? 'bar' : chartType, data: chartData, options: chartOptions });
}

function addDataRow(label = '', value = '') {
  const container = document.getElementById('dataInputContainer'), newRow = document.createElement('div');
  newRow.className = 'data-row';
  newRow.innerHTML = `<input type="text" placeholder="Label" class="data-label" value="${label}"><input type="number" placeholder="Value" class="data-value" value="${value}"><button class="remove-row-btn">×</button>`;
  newRow.querySelector('.remove-row-btn').addEventListener('click', () => container.removeChild(newRow));
  container.appendChild(newRow);
}

function addScatterRow(x = '', y = '') {
  const container = document.getElementById('scatterInputContainer'), newRow = document.createElement('div');
  newRow.className = 'data-row';
  newRow.innerHTML = `<input type="number" placeholder="X Value" class="scatter-x" value="${x}"><input type="number" placeholder="Y Value" class="scatter-y" value="${y}"><button class="remove-row-btn">×</button>`;
  newRow.querySelector('.remove-row-btn').addEventListener('click', () => container.removeChild(newRow));
  container.appendChild(newRow);
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
  return r + ',' + g + ',' + b;
}

function downloadChart(format) {
  const canvas = document.getElementById('chartCanvas'), tempCanvas = document.createElement('canvas'), tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
  tempCtx.fillStyle = selectedBgColor; tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(canvas, 0, 0);
  const link = document.createElement('a');
  link.href = tempCanvas.toDataURL(`image/${format}`); link.download = `chart.${format}`;
  link.click();
}

function updateChartTypeUI() {
  document.querySelectorAll('.chart-specific-fields').forEach(el => el.classList.remove('active'));
  document.getElementById('axisLabels').style.display = chartType === 'pie' ? 'none' : 'block';
  if (chartType === 'scatter') {
    document.getElementById('scatterDataInput').classList.add('active');
    if (document.querySelectorAll('#scatterInputContainer .data-row').length === 0) for (let i = 0; i < 5; i++) addScatterRow(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
  } else {
    document.getElementById('standardDataInput').classList.add('active');
    if (document.querySelectorAll('#dataInputContainer .data-row').length === 0) ['Jan', 'Feb', 'Mar', 'Apr', 'May'].forEach((label, i) => addDataRow(label, [65, 59, 80, 81, 56][i]));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChart();
  document.getElementById('updateChart').addEventListener('click', updateChart);
  document.getElementById('addDataRow').addEventListener('click', () => addDataRow());
  document.getElementById('addScatterRow').addEventListener('click', () => addScatterRow());
  document.getElementById('chartType').addEventListener('change', function() { chartType = this.value; updateChartTypeUI(); });
  document.getElementById('downloadPNG').addEventListener('click', () => downloadChart('png'));
  document.getElementById('downloadJPG').addEventListener('click', () => downloadChart('jpg'));
  document.querySelectorAll('.color-picker .color-option').forEach(option => option.addEventListener('click', function() {
    const pickerId = this.parentElement.id;
    if (pickerId === 'FillColorPicker') selectedFillColor = this.dataset.color;
    else if (pickerId === 'borderColorPicker') selectedBorderColor = this.dataset.color;
    else if (pickerId === 'bgColorPicker') selectedBgColor = this.dataset.color;
    document.querySelectorAll(`#${pickerId} .color-option`).forEach(o => o.style.border = '1px solid #ddd');
    this.style.border = '3px solid #333';
  }));
  document.querySelector('#FillColorPicker .color-option[data-color="#36A2EB"]').style.border = '3px solid #333';
  document.querySelector('#borderColorPicker .color-option[data-color="#36A2EB"]').style.border = '3px solid #333';
  document.querySelector('#bgColorPicker .color-option[data-color="#ffffff"]').style.border = '3px solid #333';
  document.querySelector('.chart-container').addEventListener('click', function() {
    const flash = document.createElement('div');
    flash.style.position = 'absolute'; flash.style.top = '0'; flash.style.left = '0'; flash.style.right = '0'; flash.style.bottom = '0'; flash.style.backgroundColor = 'rgba(255,255,255,0.5)'; flash.style.pointerEvents = 'none'; flash.style.transition = 'opacity 0.3s';
    this.appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => { this.removeChild(flash); }, 300); }, 100);
  });
  updateChartTypeUI();
});