export const ui = {};

export function initUI() {
  ui.cityName = document.querySelector(".weather-description");
  ui.temperature = document.getElementById("temperature");
  ui.feelsLike = document.getElementById("feels-like");
  ui.humidity = document.getElementById("humidity");
  ui.description = document.getElementById("description");
  ui.wind = document.getElementById("wind");
  ui.icon = document.getElementById("weather-icon");
  ui.timeIcon = document.getElementById("time-icon");
  ui.message = document.querySelector(".error-message");
  ui.chartCanvas = document.getElementById("forecastChart");
}

export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;

  document.body.classList.remove("day-mode", "night-mode");
  document.body.classList.add(state.isDay ? "day-mode" : "night-mode");

  ui.timeIcon.classList.remove("fade-in");
  ui.timeIcon.classList.add("fade-out");

  setTimeout(() => {
    ui.timeIcon.src = state.isDay
      ? "./assets/sun.svg"
      : "./assets/moon.svg";

    ui.timeIcon.classList.remove("fade-out");
    ui.timeIcon.classList.add("fade-in");
  }, 200);


  let emoji = "";
  if (weatherMain.includes("clear")) emoji = state.isDay ? "☀️" : "🌙";
  else if (weatherMain.includes("cloud")) emoji = "☁️";
  else if (weatherMain.includes("rain")) emoji = "🌧️";
  else if (weatherMain.includes("snow")) emoji = "❄️";
  else if (weatherMain.includes("thunder")) emoji = "⚡";
  else if (weatherMain.includes("mist")) emoji = "🌫️";

  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  ui.temperature.textContent = `Temperature: ${Math.round(weather.main.temp)}${unitSymbol}`;
  ui.feelsLike.textContent = `Feels like: ${Math.round(weather.main.feels_like)}${unitSymbol}`;
  ui.cityName.textContent = weather.name;
  ui.humidity.textContent = `💧 Humidity: ${weather.main.humidity}%`;
  ui.description.textContent = description;
  ui.wind.textContent = `🍃 Wind: ${weather.wind.speed} m/s`;
  ui.icon.textContent = emoji;
  ui.message.textContent = "";
}

let forecastChart = null;

export function renderForecast(daily, unit = "metric") {
  if (!daily || !ui.chartCanvas) return;

  // ---- DATA ----
  const labels = daily.map(day => 
    new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
  );

  const temps = daily.map(day => {
    const c = Math.round(day.temp.day);
    return unit === "metric" ? c : Math.round(c * 9/5 + 32);
  });

  // ---- DESTROY OLD CHART ----
  if (forecastChart) {
    forecastChart.destroy();
  }

  const ctx = ui.chartCanvas.getContext("2d");

  // ---- CREATE NEW CHART ----
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

export function renderError(message) {
  ui.message.textContent = message;
  ui.cityName.textContent = "";
  ui.temperature.textContent = "";
  ui.feelsLike.textContent = "";
  ui.humidity.textContent = "";
  ui.description.textContent = "";
  ui.wind.textContent = "";
  ui.icon.textContent = "";
  ui.timeIcon.src = "";
}
