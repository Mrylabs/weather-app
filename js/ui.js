const ui = {
  cityName: document.getElementById("city-name"),
  temperature: document.getElementById("temperature"),
  feelsLike: document.getElementById("feels-like"),
  humidity: document.getElementById("humidity"),
  description: document.getElementById("description"),
  wind: document.getElementById("wind"),
  icon: document.getElementById("weather-icon"),
  timeIcon: document.getElementById("time-icon"),
  message: document.getElementById("message"),
};

export function renderWeather(state) {
  const weather = state.weather;
  if (!weather) return;

  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;

  document.body.style.background = state.isDay
    ? "linear-gradient(to bottom, #87ceeb, #f0f8ff)"
    : "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";

  ui.timeIcon.textContent = state.isDay ? "☀️" : "🌙";

  let emoji = "";
  if (weatherMain.includes("clear")) emoji = state.isDay ? "☀️" : "🌙";
  else if (weatherMain.includes("cloud")) emoji = "☁️";
  else if (weatherMain.includes("rain")) emoji = "🌧️";
  else if (weatherMain.includes("snow")) emoji = "❄️";
  else if (weatherMain.includes("thunder")) emoji = "⚡";
  else if (weatherMain.includes("mist")) emoji = "🌫️";


  ui.cityName.textContent = weather.name;
  ui.temperature.textContent = `Temperature: ${Math.round(weather.main.temp)}°C`;
  ui.feelsLike.textContent = `Feels like: ${Math.round(weather.main.feels_like)}°C`;
  ui.humidity.textContent = `Humidity: ${weather.main.humidity}%`;
  ui.description.textContent = description;
  ui.wind.textContent = `Wind: ${weather.wind.speed} m/s`;
  ui.icon.textContent = emoji;
  ui.message.textContent = "";
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
