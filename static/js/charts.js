/**
 * Chart configurations for 2026 NBA Finals Predictor
 * Uses Chart.js for data visualization
 */

// Chart.js global defaults for dark theme
Chart.defaults.color = '#8888aa';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Inter', sans-serif";

/**
 * Create a donut chart for series win probability
 */
function createSeriesProbChart(canvasId, spursProb, knicksProb) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Spurs', 'Knicks'],
      datasets: [{
        data: [spursProb, knicksProb],
        backgroundColor: [
          '#c4ced4',
          '#006bb6',
        ],
        borderColor: [
          '#e0e0e0',
          '#f58426',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 12,
            font: { size: 13, weight: '600' },
          },
        },
        tooltip: {
          backgroundColor: '#1a1a25',
          titleColor: '#f0f0f5',
          bodyColor: '#8888aa',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    },
  });
}

/**
 * Create a horizontal bar chart for team stat comparison
 */
function createStatComparisonChart(canvasId, labels, spursData, knicksData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Spurs',
          data: spursData,
          backgroundColor: 'rgba(196, 206, 212, 0.7)',
          borderColor: '#c4ced4',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Knicks',
          data: knicksData,
          backgroundColor: 'rgba(0, 107, 182, 0.7)',
          borderColor: '#006bb6',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 12,
          },
        },
        tooltip: {
          backgroundColor: '#1a1a25',
          titleColor: '#f0f0f5',
          bodyColor: '#8888aa',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.03)',
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: { size: 12, weight: '500' },
          },
        },
      },
    },
  });
}

/**
 * Create a bar chart for series outcome probabilities
 */
function createOutcomeChart(canvasId, outcomeProbs) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const labels = Object.keys(outcomeProbs);
  const data = Object.values(outcomeProbs);

  const colors = labels.map(label => {
    const [spursWins, knicksWins] = label.split('-').map(Number);
    if (spursWins === 4) return '#c4ced4';
    if (knicksWins === 4) return '#006bb6';
    return 'rgba(255, 255, 255, 0.1)';
  });

  const borderColors = labels.map(label => {
    const [spursWins, knicksWins] = label.split('-').map(Number);
    if (spursWins === 4) return '#e0e0e0';
    if (knicksWins === 4) return '#f58426';
    return 'rgba(255, 255, 255, 0.15)';
  });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => `${l}`),
      datasets: [{
        label: 'Probability %',
        data: data,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a25',
          titleColor: '#f0f0f5',
          bodyColor: '#8888aa',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            title: (items) => `Series: Spurs ${items[0].label} Knicks`,
            label: (ctx) => ` Probability: ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          title: {
            display: true,
            text: 'Series Result (Spurs-Knicks)',
            color: '#555577',
            font: { size: 12 },
          },
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          title: {
            display: true,
            text: 'Probability %',
            color: '#555577',
            font: { size: 12 },
          },
          beginAtZero: true,
        },
      },
    },
  });
}

/**
 * Create a radar chart for player comparison
 */
function createPlayerRadarChart(canvasId, player1Name, player1Stats, player2Name, player2Stats) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['PTS', 'REB', 'AST', 'STL', 'BLK', 'FG%'],
      datasets: [
        {
          label: player1Name,
          data: player1Stats,
          backgroundColor: 'rgba(196, 206, 212, 0.15)',
          borderColor: '#c4ced4',
          borderWidth: 2,
          pointBackgroundColor: '#c4ced4',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
        },
        {
          label: player2Name,
          data: player2Stats,
          backgroundColor: 'rgba(0, 107, 182, 0.15)',
          borderColor: '#006bb6',
          borderWidth: 2,
          pointBackgroundColor: '#006bb6',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 12,
          },
        },
      },
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          pointLabels: {
            color: '#8888aa',
            font: { size: 12, weight: '600' },
          },
          ticks: {
            display: false,
          },
          suggestedMin: 0,
        },
      },
    },
  });
}

/**
 * Create a game-by-game probability line chart
 */
function createGameProbChart(canvasId, games, spursProbs, knicksProbs) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: games,
      datasets: [
        {
          label: 'Spurs Win %',
          data: spursProbs,
          borderColor: '#c4ced4',
          backgroundColor: 'rgba(196, 206, 212, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#c4ced4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
        {
          label: 'Knicks Win %',
          data: knicksProbs,
          borderColor: '#006bb6',
          backgroundColor: 'rgba(0, 107, 182, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#006bb6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: '#1a1a25',
          titleColor: '#f0f0f5',
          bodyColor: '#8888aa',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          min: 0,
          max: 100,
          ticks: {
            callback: (v) => `${v}%`,
          },
        },
      },
    },
  });
}
