export const ui = {};

export function initUI() {
  ui.cityName     = document.querySelector(".weather-description");
  ui.temperature  = document.getElementById("temperature");
  ui.feelsLike    = document.getElementById("feels-like");
  ui.humidity     = document.getElementById("humidity");
  ui.description  = document.getElementById("description");
  ui.wind         = document.getElementById("wind");
  ui.icon         = document.getElementById("weather-icon");
  ui.timeIcon     = document.getElementById("time-icon");
  ui.message      = document.querySelector(".error-message");
  ui.chartCanvas  = document.getElementById("forecastChart");
}

let forecastChart = null;

function getWeatherEmoji(main, isDay) {
  if (main.includes("clear")) return isDay ? "☀️" : "🌙";
  if (main.includes("cloud")) return "☁️";
  if (main.includes("rain")) return "🌧️";
  if (main.includes("snow")) return "❄️";
  if (main.includes("thunder")) return "⚡";
  if (main.includes("mist")) return "🌫️";
  return "";
}


function updateTimeIcon(isDay) {
  if (!ui.timeIcon) return;

  ui.timeIcon.classList.remove("fade-in");
  ui.timeIcon.classList.add("fade-out");

  setTimeout(() => {
    ui.timeIcon.src = isDay ? "./assets/sun.svg" : "./assets/moon.svg";
    ui.timeIcon.classList.remove("fade-out");
    ui.timeIcon.classList.add("fade-in");
  }, 200);
}


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
    ui.timeIcon.classList.remove("fade-in", "fade-out");
    ui.timeIcon.src = "";
  }

  if (forecastChart) {
    forecastChart.destroy();
    forecastChart = null;
  }
}

export function renderError(message) {
  clearUI();
  ui.message.textContent = message;
}


export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;


  document.body.classList.toggle("day-mode", state.isDay);
  document.body.classList.toggle("night-mode", !state.isDay);

  updateTimeIcon(state.isDay);

  const emoji = getWeatherEmoji(weatherMain, state.isDay);
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  ui.temperature.textContent = `Temperature: ${Math.round(weather.main.temp)}${unitSymbol}`;
  ui.feelsLike.textContent   = `Feels like: ${Math.round(weather.main.feels_like)}${unitSymbol}`;
  ui.cityName.textContent    = weather.name;
  ui.humidity.textContent    = `💧 Humidity: ${weather.main.humidity}%`;
  ui.description.textContent = description;
  ui.wind.textContent        = `🍃 Wind: ${weather.wind.speed} m/s`;
  ui.icon.textContent        = emoji;
  ui.message.textContent     = "";
}


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
