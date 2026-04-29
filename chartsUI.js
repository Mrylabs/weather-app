let forecastChart = null;

const chartColors = {
  max: "#fb7185", // warm red
  min: "#38bdf8", // cool blue
  text: "rgba(248, 250, 252, 0.9)",
  muted: "rgba(248, 250, 252, 0.55)",
  grid: "rgba(248, 250, 252, 0.08)",
};

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
      labels: forecast.map((day) => day.label),
      datasets: [
        {
          label: "Max",
          data: forecast.map((day) => day.max),
          borderColor: chartColors.max,
          backgroundColor: "rgba(251, 113, 133, 0.16)",
          pointBackgroundColor: chartColors.max,
          pointBorderColor: chartColors.max,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: "Min",
          data: forecast.map((day) => day.min),
          borderColor: chartColors.min,
          backgroundColor: "rgba(56, 189, 248, 0.16)",
          pointBackgroundColor: chartColors.min,
          pointBorderColor: chartColors.min,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: chartColors.text,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: chartColors.text,
            font: {
              size: 11,
              weight: "600",
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: chartColors.text,
            callback(value) {
              return `${value}°`;
            },
            font: {
              size: 11,
              weight: "600",
            },
          },
          grid: {
            color: chartColors.grid,
          },
        },
      },
    },
  });
}