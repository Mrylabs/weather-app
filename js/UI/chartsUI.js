let forecastChart = null;

export function renderForecastChart(forecast) {
  if (!forecast || forecast.length === 0) return;

  const canvas = document.getElementById("forecastChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (forecastChart) {
    forecastChart.destroy();
  }

  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: forecast.map(day => day.label),
      datasets: [
        {
          label: "Max",
          data: forecast.map(day => day.max),
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Min",
          data: forecast.map(day => day.min),
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
      },
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    },
  });
}