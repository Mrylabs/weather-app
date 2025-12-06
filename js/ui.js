import { elements } from "./UI/elements.js";

export const ui = elements;

let forecastChart = null

// --------------------------------------------------
// Clear all UI fields
// --------------------------------------------------
export function clearUI() {
  if (!ui.cityName) return;

  ui.cityName.textContent     = "";
  ui.temperature.textContent  = "";
  ui.feelsLike.textContent    = "";
  ui.humidity.textContent     = "";
  ui.description.textContent  = "";
  ui.wind.textContent         = "";
  ui.icon.textContent         = "";
  ui.message.textContent      = "";

  if (ui.timeIcon) {
    ui.timeIcon.src = "";
    ui.timeIcon.classList.remove("fade-in", "fade-out");
  }

  if (forecastChart) {
    forecastChart.destroy();
    forecastChart = null;
  }
}

// --------------------------------------------------
// Show an error
// --------------------------------------------------
export function renderError(message) {
  clearUI();
  ui.message.textContent = message;
}

// --------------------------------------------------
// Render 7-day forecast chart
// --------------------------------------------------
export function renderForecast(daily, unit = "metric") {
  if (!daily || !ui.chartCanvas) return;

  const labels = daily.map(day =>
    new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
  );

  const temps = daily.map(day => {
    const c = Math.round(day.temp.day);
    return unit === "metric" ? c : Math.round(c * 9/5 + 32);
  });

  if (forecastChart) forecastChart.destroy();

  const ctx = ui.chartCanvas.getContext("2d");

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
