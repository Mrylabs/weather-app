import { elements } from "./elements";

let forecastChart = null;

export function renderForecastChart(daily, unit = "metric") {
  if (!daily || !elements.chartCanvas) return;

  const labels = daily.map(day =>
    new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
  );

  const temps = daily.map(day => {
    const c = Math.round(day.temp.day);
    return unit === "metric" ? c : Math.round(c * 9/5 + 32);
  });

  destroyForecastChart();

  const ctx = elements.chartCanvas.getContext("2d");

  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Daily Temperature",
          data: temps,
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    options: {
      scales: { y: { beginAtZero: false } },
      plugins: { legend: { display: false } }
    }
  });
}

export function destroyForecastChart() {
  if (!forecastChart) return;
  forecastChart.destroy();
  forecastChart = null;
}