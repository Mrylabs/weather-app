const ui = {
  cityName: document.querySelector(".weather-description"),
  temperature: document.getElementById("temperature"),
  feelsLike: document.getElementById("feels-like"),
  humidity: document.getElementById("humidity"),
  description: document.getElementById("description"),
  wind: document.getElementById("wind"),
  icon: document.getElementById("weather-icon"),
  timeIcon: document.getElementById("time-icon"),
  message: document.querySelector(".error-message")
};

export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;

  document.body.classList.remove("day-mode", "night-mode");
  document.body.classList.add(state.isDay ? "day-mode" : "night-mode");

  ui.timeIcon.style.opacity = 0;

  setTimeout(() => {
    ui.timeIcon.src = state.isDay
      ? "./assets/sun.svg"
      : "./assets/moon.svg";

    ui.timeIcon.style.opacity = 1;
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
  ui.humidity.textContent = `Humidity: ${weather.main.humidity}%`;
  ui.description.textContent = description;
  ui.wind.textContent = `Wind: ${weather.wind.speed} m/s`;
  ui.icon.textContent = emoji;
  ui.message.textContent = "";
}

let forecastChart = null;

export function renderForecast(daily) {
  if (!daily) return;

  // 1. Prepare data
  const labels = daily.map(day => {
    const date = new Date(day.dt * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  const temps = daily.map(day => Math.round(day.temp.day));

  // 2. If a chart already exists, destroy it
  if (forecastChart) {
    forecastChart.destroy();
  }

  // 3. Get canvas
  const ctx = document.getElementById("forecastChart").getContext("2d");

  // 4. Create chart
  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Daily Temperature",
          data: temps,
          borderWidth: 2,
          tension: 0.4, // smooth curve
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: { display: false }
      }
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
  ui.timeIcon.textContent = "";
}
